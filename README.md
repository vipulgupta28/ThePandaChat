# Panda — Connect Anonymously with the World

> Chat and video call with real people from 150+ countries. No accounts. No judgment. Just genuine conversation.

Panda is a real-time anonymous communication platform that pairs you instantly with strangers for text chat and live video calls. Built for spontaneity — one click is all it takes.

---

## What Panda Does

- **Anonymous by design** — no sign-up, no profile, no trace. Jump straight into a conversation.
- **Instant random pairing** — our matchmaking engine connects you with someone new in seconds.
- **Text chat** — send messages, images, videos, voice clips, and emoji in real time.
- **Live video calls** — face-to-face conversations over a peer-to-peer WebRTC connection.
- **Skip anytime** — not feeling it? Hit skip and you're matched with someone new instantly.
- **Global reach** — users across 150+ countries, visualized through an interactive 3D globe.
- **Premium tier** — payment-gated features powered by a secure payment gateway integration.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D Rendering | Three.js + React Three Fiber |
| Routing | React Router v7 |
| Real-time Messaging | Native WebSocket API |
| Video Calls | WebRTC (RTCPeerConnection) |
| Notifications | react-hot-toast |
| Auth & DB | Firebase + Supabase |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| Language | TypeScript |
| WebSocket Server | ws (dual WebSocketServer — chat & video) |
| Authentication | JWT + bcrypt |
| Payments | Razorpay |
| Email | Nodemailer |
| Caching | ioredis |
| Auth & DB | Firebase Admin + Supabase |

### Infrastructure
- Frontend deployed on **Vercel**
- WebSocket upgrade routing handled manually for `/chat` and `/video-call` endpoints
- STUN server (Google) for WebRTC NAT traversal

---

## Architecture Highlights

### Real-time Chat
A pure WebSocket matchmaking system pairs waiting users into private rooms. Messages relay directly between matched peers — no persistence, no history, complete privacy. Users can skip at any point, re-entering the queue to be matched again immediately.

### Video Calling
Built on native browser WebRTC (`RTCPeerConnection`) with a WebSocket-based signaling layer. The server handles offer/answer exchange and ICE candidate relay without ever touching the media stream — video and audio flow peer-to-peer.

### Dual WebSocket Architecture
A single HTTP server upgrades connections to one of two independent `WebSocketServer` instances based on the URL path (`/chat` or `/video-call`), keeping the two systems fully isolated while sharing one port.

---

## Features at a Glance

- Rich media chat — text, images, video, and voice messages
- Emoji picker with inline support
- Message status indicators (sent / delivered / seen)
- Animated hero with rotating text using Framer Motion
- Interactive 3D globe (Three.js + react-globe.gl)
- Glare card UI components for premium pricing display
- Fully responsive — mobile, tablet, and desktop
- Payment gateway integration for premium access

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

The backend runs on port `4000` by default. Set `VITE_BACKEND_API_URL` in the frontend `.env` to point to your backend.

---

## Skills Demonstrated

- Full-stack TypeScript (React + Node.js + Express)
- Real-time systems engineering — WebSocket server design, room management, queue-based matchmaking
- WebRTC — peer-to-peer video, signaling, ICE negotiation
- Modern React — hooks, refs, portals, context, React 19 patterns
- UI/UX engineering — Framer Motion animations, Tailwind CSS v4, Three.js 3D
- Payment integration — Razorpay order creation
- Auth & backend services — JWT, bcrypt, Firebase Admin, Supabase, Nodemailer
- Cloud deployment — Vercel, environment configuration, serverless routing

---

## Legal

- [Privacy Policy](public/Panda_Privacy_Policy.pdf)
- [Terms of Service](public/Panda_Terms_of_Service.pdf)
- [Contact](public/Panda_Contact.pdf)

---

Built with the belief that the best conversations happen between strangers.
