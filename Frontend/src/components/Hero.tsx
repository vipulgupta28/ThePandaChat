import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSocket } from './socket';
import { motion, AnimatePresence } from 'framer-motion';


const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const options = ["World", "People", "Your ex may be"];
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
  const BACKEND_HOST = BACKEND_URL.replace(/^https?:\/\//, '');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setCurrentOption(prev => (prev + 1) % options.length);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStartChatting = () => {
    setConnecting(true);

    const socket = new WebSocket(`wss://${BACKEND_HOST}/chat`);

    socket.onopen = () => {
      console.log("Connected to server...");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSocket(socket);

      if (data.type === "waiting") {
        console.log("Waiting for partner...");
      }

      if (data.type === "match") {
        const { roomId } = data;
        navigate('/chatpage', { state: { roomId } });
      }

      if (data.type === "partner-disconnected") {
        alert("Your partner has disconnected.");
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  };

  return (
    <div id='hero' className="relative min-h-screen flex items-center justify-center px-4 md:px-6 overflow-hidden">
 
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] h-[600px] sm:h-[850px] rounded-full bg-white/30 blur-3xl z-0" />

      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
  <span className="block mb-5">
    Connect{' '}
    <span className="bg-gradient-to-br from-zinc-900 to-black px-3 py-1 rounded-xl inline-block -rotate-3">
      Anonymously
    </span>
  </span>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-2">

              <span
              id='startConnecting'
               className="text-3xl sm:text-6xl text-white">With</span>

              <AnimatePresence mode="wait">
                <motion.span
                  key={currentOption}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-6xl text-white font-semibold"
                >
                  {options[currentOption]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>


          <p className="text-base sm:text-lg md:text-xl text-white mb-8 sm:mb-10 px-2 sm:px-0">
            Chat with random people all over the globe without revealing your identity.
            Make new friends, share stories, and have meaningful conversations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
            
              className="px-6 py-3 rounded-md font-semibold hover:cursor-pointer text-white bg-gradient-to-br from-zinc-900 to-black hover:bg-white/10 transition disabled:opacity-50"
              onClick={handleStartChatting}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Start Chatting Now"}
            </button>

            <button
            
              className="px-6 py-3 rounded-md font-semibold hover:cursor-pointer text-white bg-gradient-to-br from-zinc-900 to-black hover:bg-white/10 transition disabled:opacity-50"
              onClick={()=>navigate("/vcpage")}
          
            >
              Start Video Calling
            </button>

            
          </div>

          <div className="mt-12 md:mt-16 flex justify-center">
            <p className="px-4 py-1 rounded-full bg-gradient-to-b from-black to-[#0d0d26] border border-[#3f3f60] text-sm sm:text-base font-medium text-[#d5e3f0] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
              checkout payment gateway in the pricing section
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

