import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

const waitingQueue: WebSocket[] = [];
const activeRooms: Map<string, { users: WebSocket[] }> = new Map();
let roomCounter = 1;

wss.on('connection', (ws) => {
  console.log(`New connection. Queue size: ${waitingQueue.length + 1}`);
  
  waitingQueue.push(ws);
  ws.send(JSON.stringify({ type: 'waiting', message: 'Looking for partner...' }));

  tryPairUsers();

  ws.on('message', (data) => {
    const room = findRoomByUser(ws);
    if (!room) return;

    const otherUser = room.users.find(user => user !== ws);
    if (otherUser?.readyState === WebSocket.OPEN) {
      otherUser.send(data.toString());
    }
  });

  ws.on('close', () => {
    // Remove from queue if still waiting
    const queueIndex = waitingQueue.indexOf(ws);
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1);
      console.log(`User left queue. Queue size: ${waitingQueue.length}`);
      return;
    }

    // Handle room cleanup
    const room = findRoomByUser(ws);
    if (room) {
      const otherUser = room.users.find(user => user !== ws);
      if (otherUser?.readyState === WebSocket.OPEN) {
        otherUser.send(JSON.stringify({ 
          type: 'partner-disconnected'
        }));
      }
      
      // Delete the room
      for (const [id, r] of activeRooms) {
        if (r === room) {
          activeRooms.delete(id);
          console.log(`Room ${id} closed. Total rooms: ${activeRooms.size}`);
          break;
        }
      }
    }
  });
});

function findRoomByUser(ws: WebSocket) {
  for (const room of activeRooms.values()) {
    if (room.users.includes(ws)) {
      return room;
    }
  }
  return null;
}

function tryPairUsers() {
  while (waitingQueue.length >= 2) {
    const user1 = waitingQueue.shift()!;
    const user2 = waitingQueue.shift()!;

    if (user1.readyState !== WebSocket.OPEN || user2.readyState !== WebSocket.OPEN) {
      if (user1.readyState === WebSocket.OPEN) waitingQueue.unshift(user1);
      if (user2.readyState === WebSocket.OPEN) waitingQueue.unshift(user2);
      continue;
    }

    const roomId = `room-${roomCounter++}`;
    activeRooms.set(roomId, { users: [user1, user2] });
    
    [user1, user2].forEach((user, index) => {
      user.send(JSON.stringify({
        type: 'paired',
        isInitiator: index === 0
      }));
    });

    console.log(`Created room ${roomId}. Total rooms: ${activeRooms.size}`);
  }
}

server.listen(4000, () => {
  console.log('Signaling server running on ws://localhost:4000');
});