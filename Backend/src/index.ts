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




const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const waitingClients: WebSocket[] = [];
let roomCounter = 1;
const clientToRoomId = new Map<WebSocket, string>();
const rooms = new Map<string, WebSocket[]>();


const enqueueClient = (client: WebSocket) => {
  if (waitingClients.includes(client)) return;
  if (clientToRoomId.has(client)) return;

  waitingClients.push(client);
  client.send(JSON.stringify({ type: 'waiting', message: 'Waiting for a match...' }));

  tryMatchClients();
};

const cleanupRoom = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach(client => {
    clientToRoomId.delete(client);
    client.removeAllListeners('message');
    client.removeAllListeners('close');
  });

  rooms.delete(roomId);
};

const tryMatchClients = () => {
  while (waitingClients.length >= 2) {
    const client1 = waitingClients.shift()!;
    const client2 = waitingClients.shift()!;

    const roomId = `room-${roomCounter++}`;
    rooms.set(roomId, [client1, client2]);
    clientToRoomId.set(client1, roomId);
    clientToRoomId.set(client2, roomId);

    client1.send(JSON.stringify({ type: 'match', roomId }));
    client2.send(JSON.stringify({ type: 'match', roomId }));

    console.log(`Matched two users in ${roomId}`);
    const relayMessage = (sender: WebSocket, data: string) => {
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch {
    return;
  }

  const roomId = clientToRoomId.get(sender);
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  const receiver = room.find(client => client !== sender);
  if (!receiver || receiver.readyState !== WebSocket.OPEN) return;

  if (parsed.type === "skip") {
    receiver.send(JSON.stringify({ 
      type: "alert", 
      message: "You have been skipped. Finding new connection..." 
    }));
    sender.send(JSON.stringify({ 
      type: "toast", 
      message: "Skipping and finding new match..." 
    }));

    sender.send(JSON.stringify({ type: "clear" }));
    receiver.send(JSON.stringify({ type: "clear" }));

    clientToRoomId.delete(sender);
    clientToRoomId.delete(receiver);

    cleanupRoom(roomId);

    const senderIdx = waitingClients.indexOf(sender);
    if (senderIdx !== -1) waitingClients.splice(senderIdx, 1);
    const receiverIdx = waitingClients.indexOf(receiver);
    if (receiverIdx !== -1) waitingClients.splice(receiverIdx, 1);

    enqueueClient(sender);
    
    enqueueClient(receiver);

    return;
  }

  receiver.send(data);
};


   const closedRooms = new Set<string>();

const closeRoom = () => {
  if (closedRooms.has(roomId)) return;
  closedRooms.add(roomId);

  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'leave', message: 'Your partner disconnected.' }));
    }
  });

  cleanupRoom(roomId);

  room.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      enqueueClient(client);
    }
  });
};

    client1.on('message', (data) => relayMessage(client1, data.toString()));
    client2.on('message', (data) => relayMessage(client2, data.toString()));

    client1.on('close', closeRoom);
    client2.on('close', closeRoom);
  }
};

wss.on('connection', (ws: WebSocket) => {
  console.log('A user connected');

  enqueueClient(ws);

  ws.on('error', () => {
    const idx = waitingClients.indexOf(ws);
    if (idx !== -1) waitingClients.splice(idx, 1);
  });

  ws.on('close', () => {
    const idx = waitingClients.indexOf(ws);
    if (idx !== -1) waitingClients.splice(idx, 1);
    const roomId = clientToRoomId.get(ws);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        room.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'leave', message: 'Your partner disconnected.' }));
          }
        });
      }
      cleanupRoom(roomId);
      room?.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          enqueueClient(client);
        }
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
