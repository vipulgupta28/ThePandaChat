import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { razorpay } from './utils/razropay';

const app = express();
app.use(cors());
app.use(express.json());



app.post("/api/v1/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: 100, // amount in paise
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const videoCallWSS = new WebSocketServer({ noServer: true });
const chatWSS = new WebSocketServer({ noServer: true });

// === VIDEO CALLING LOGIC ===
const videoWaitingQueue: WebSocket[] = [];
const videoRooms: Map<string, { users: WebSocket[] }> = new Map();
let videoRoomCounter = 1;

videoCallWSS.on('connection', (ws: WebSocket) => {
  console.log(`New video call connection. Queue size: ${videoWaitingQueue.length + 1}`);
  
  videoWaitingQueue.push(ws);
  ws.send(JSON.stringify({ type: 'waiting', message: 'Looking for partner...' }));
  pairVideoUsers();

  ws.on('message', (data) => {
    const room = findVideoRoom(ws);
    if (!room) return;

    const otherUser = room.users.find(u => u !== ws);
    if (otherUser?.readyState === WebSocket.OPEN) {
      otherUser.send(data.toString());
    }
  });

  ws.on('close', () => {
    const idx = videoWaitingQueue.indexOf(ws);
    if (idx !== -1) videoWaitingQueue.splice(idx, 1);

    const room = findVideoRoom(ws);
    if (room) {
      const otherUser = room.users.find(u => u !== ws);
      if (otherUser?.readyState === WebSocket.OPEN) {
        otherUser.send(JSON.stringify({ type: 'partner-disconnected' }));
      }

      for (const [roomId, r] of videoRooms) {
        if (r === room) {
          videoRooms.delete(roomId);
          break;
        }
      }
    }
  });
});

function findVideoRoom(ws: WebSocket) {
  for (const room of videoRooms.values()) {
    if (room.users.includes(ws)) return room;
  }
  return null;
}

function pairVideoUsers() {
  while (videoWaitingQueue.length >= 2) {
    const user1 = videoWaitingQueue.shift()!;
    const user2 = videoWaitingQueue.shift()!;

    if (user1.readyState !== WebSocket.OPEN || user2.readyState !== WebSocket.OPEN) continue;

    const roomId = `video-room-${videoRoomCounter++}`;
    videoRooms.set(roomId, { users: [user1, user2] });

    [user1, user2].forEach((user, idx) => {
      user.send(JSON.stringify({ type: 'paired', isInitiator: idx === 0 }));
    });

    console.log(`Created video room ${roomId}`);
  }
}

// === MESSAGING LOGIC ===
const chatWaitingClients: WebSocket[] = [];
let chatRoomCounter = 1;
const clientToRoomId = new Map<WebSocket, string>();
const chatRooms = new Map<string, WebSocket[]>();

const enqueueChatClient = (client: WebSocket) => {
  if (chatWaitingClients.includes(client)) return;
  if (clientToRoomId.has(client)) return;

  chatWaitingClients.push(client);
  client.send(JSON.stringify({ type: 'waiting', message: 'Waiting for a match...' }));
  tryMatchChatClients();
};

const tryMatchChatClients = () => {
  while (chatWaitingClients.length >= 2) {
    const client1 = chatWaitingClients.shift()!;
    const client2 = chatWaitingClients.shift()!;
    const roomId = `chat-room-${chatRoomCounter++}`;
    chatRooms.set(roomId, [client1, client2]);
    clientToRoomId.set(client1, roomId);
    clientToRoomId.set(client2, roomId);

    client1.send(JSON.stringify({ type: 'match', roomId }));
    client2.send(JSON.stringify({ type: 'match', roomId }));

    const relay = (sender: WebSocket, msg: string) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch {
        return;
      }

      const roomId = clientToRoomId.get(sender);
      const room = chatRooms.get(roomId!);
      if (!room) return;

      const receiver = room.find(c => c !== sender);
      if (!receiver || receiver.readyState !== WebSocket.OPEN) return;

      if (data.type === "skip") {
        receiver.send(JSON.stringify({ type: "alert", message: "You have been skipped." }));
        sender.send(JSON.stringify({ type: "toast", message: "Skipping..." }));
        receiver.send(JSON.stringify({ type: "clear" }));
        sender.send(JSON.stringify({ type: "clear" }));

        clientToRoomId.delete(sender);
        clientToRoomId.delete(receiver);
        chatRooms.delete(roomId!);

        enqueueChatClient(sender);
        enqueueChatClient(receiver);
        return;
      }

      receiver.send(msg);
    };

    const close = () => {
      const room = chatRooms.get(roomId)!;
      if (!room) return;

      room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'leave', message: 'Your partner disconnected.' }));
          enqueueChatClient(client);
        }
        clientToRoomId.delete(client);
      });

      chatRooms.delete(roomId);
    };

    client1.on('message', msg => relay(client1, msg.toString()));
    client2.on('message', msg => relay(client2, msg.toString()));

    client1.on('close', close);
    client2.on('close', close);
  }
};

chatWSS.on('connection', (ws: WebSocket) => {
  enqueueChatClient(ws);
  ws.on('error', () => {
    const idx = chatWaitingClients.indexOf(ws);
    if (idx !== -1) chatWaitingClients.splice(idx, 1);
  });
});

// === MANUAL UPGRADE ROUTING ===
server.on('upgrade', (req, socket, head) => {
  const { url } = req;

  if (url === '/video-call') {
    videoCallWSS.handleUpgrade(req, socket, head, (ws) => {
      videoCallWSS.emit('connection', ws, req);
    });
  } else if (url === '/chat') {
    chatWSS.handleUpgrade(req, socket, head, (ws) => {
      chatWSS.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// === LISTEN ===
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WebSocket video call: ws://localhost:${PORT}/video-call`);
  console.log(`WebSocket chat: ws://localhost:${PORT}/chat`);
});
