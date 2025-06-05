import React, { useEffect, useRef, useState } from 'react';

const VideoCall: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState('Connecting...');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
  const BACKEND_HOST = BACKEND_URL.replace(/^https?:\/\//, '');

  useEffect(() => {
    const initWebSocket = () => {
      const ws = new WebSocket(`wss://${BACKEND_HOST}/video-call`);
      socketRef.current = ws;

      const startCall = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
          });
          peerConnectionRef.current = pc;

          // Add all tracks to connection
          stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
          });

          // Handle remote stream
          pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
              }
              setStatus('Connected');
            }
          };

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              ws.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate
              }));
            }
          };

          return pc;
        } catch (err) {
          console.error('Error starting call:', err);
          setStatus('Failed to access media devices');
          return null;
        }
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        
        switch (msg.type) {
          case 'waiting':
            setStatus('Waiting for partner...');
            break;
            
          case 'paired':
            setStatus('Partner found! Connecting...');
            const pc = await startCall();
            if (msg.isInitiator && pc) {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              ws.send(JSON.stringify({ type: 'offer', offer }));
            }
            break;
            
          case 'offer':
            if (!peerConnectionRef.current) await startCall();
            await peerConnectionRef.current?.setRemoteDescription(msg.offer);
            const answer = await peerConnectionRef.current?.createAnswer();
            await peerConnectionRef.current?.setLocalDescription(answer);
            ws.send(JSON.stringify({ type: 'answer', answer }));
            break;
            
          case 'answer':
            await peerConnectionRef.current?.setRemoteDescription(msg.answer);
            break;
            
          case 'ice-candidate':
            if (msg.candidate) {
              try {
                await peerConnectionRef.current?.addIceCandidate(msg.candidate);
              } catch (err) {
                console.error('Error adding ICE candidate:', err);
              }
            }
            break;
            
          case 'partner-disconnected':
            setStatus('Partner disconnected. Reconnecting...');
            handleCleanup();
            setTimeout(initWebSocket, 2000);
            break;
        }
      };
    };

    initWebSocket();

    const handleCleanup = () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    return () => {
      handleCleanup();
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-8">
  <div className="text-lg mb-6">{status}</div>

  <div className="flex justify-center items-center gap-8 flex-wrap">
    <video
      ref={localVideoRef}
      autoPlay
      playsInline
      muted
      className="w-[580px] h-[500px] rounded-2xl shadow-lg object-cover"
    />

    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className="w-[580px] h-[500px] rounded-2xl shadow-lg object-cover"
    />
  </div>
</div>

  );
};

export default VideoCall;