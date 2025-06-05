import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from './socket';
import panda from "../assets/panda.png"
import EmojiPicker from 'emoji-picker-react';
import { FaSmile } from "react-icons/fa";
import toast from "react-hot-toast"
import { FaMicrophone, FaPaperclip } from 'react-icons/fa';

const Chat: React.FC = () => {
  type Message = {
  sender: "you" | "partner";
  content: string;
  time: string;
  status?: "sent" | "delivered" | "seen";
};

  const socket = getSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const filesArray = Array.from(e.target.files);
    setMediaFiles(filesArray);
  }
};



  const handleEmojiClick = (emojiData: any) => {
    setInput(prev => prev + emojiData.emoji);
  };

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  };

  if (showEmojiPicker) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showEmojiPicker]);

  const sendAudioMessage = (base64Audio: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: Message = {
      sender: "you",
      content: base64Audio,
      time: now,
      status: "sent",
    };
    socket.send(base64Audio); 
    setMessages(prev => [...prev, msg]);
  }
};


  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    const localChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        localChunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: "audio/webm" });
      const reader = new FileReader();

      

      reader.onloadend = () => {
        const base64AudioMessage = reader.result as string;
        sendAudioMessage(base64AudioMessage); // send to partner
      };

      reader.readAsDataURL(blob); // properly encoded
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  } catch (err) {
    console.error("Error accessing microphone:", err);
  }
};

const stopRecording = () => {
  mediaRecorder?.stop();
  setIsRecording(false);
};



useEffect(() => {
  if (!socket) return;

  socket.onmessage = (event: MessageEvent) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let parsed;
    try {
      parsed = JSON.parse(event.data);
    } catch {
      parsed = { type: "text", content: event.data };
    }

    if (parsed.type === "toast") {
      toast(parsed.message); // you can use any toast library here
      return;
    }

    if (parsed.type === "alert") {
      toast(parsed.message); // can show different styling if needed
      return;
    }

    if (parsed.type === "clear") {
      setMessages([]);
      return;
    }
     if (["waiting", "match", "leave"].includes(parsed.type)) {
      return;
    }

    const msg: Message = {
      sender: "partner",
      content: parsed.content || event.data,
      time: now,
      status: "seen",
    };

    setMessages(prev => [...prev, msg]);
  };

  socket.onclose = () => {
    alert("Chat ended.");
  };

  return () => {
    socket.onmessage = null;
    socket.onclose = null;
  };
}, [socket]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (mediaFiles.length > 0) {
    mediaFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Media = reader.result as string;
        const msg: Message = {
          sender: "you",
          content: base64Media,
          time: now,
          status: "sent",
        };
        socket.send(JSON.stringify({ type: "media", content: base64Media }));
        setMessages(prev => [...prev, msg]);
      };
      reader.readAsDataURL(file);
    });
    setMediaFiles([]);
  }

  if (input.trim() !== "") {
    const msg: Message = {
      sender: "you",
      content: input.trim(),
      time: now,
      status: "sent",
    };
    socket.send(JSON.stringify({ type: "text", content: input }));
    setMessages(prev => [...prev, msg]);
    setInput("");
  }
};

const handleSkip = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "skip" }));
    
  }
};


  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-[300px] bg-black border-r border-zinc-700 p-4 hidden sm:block">
        <h2 className="text-4xl text-center font-bold mb-4">Panda</h2>
        
      </aside>

      <div className="flex flex-col flex-1">
        <div className="p-4 border-b border-gray-700 bg-black sticky top-0 z-10 flex items-center justify-between">
  {/* Left: Avatar + Name */}
  <div className="flex gap-3 items-center">
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img src={panda} alt="Avatar" className="w-full h-full object-cover" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-white">Stranger</h2>
      <p className="text-xs text-green-400">Online</p> 
    </div>
  </div>

 
  <div>
    <button
      onClick={handleSkip}
      className="text-white bg-red-800 hover:cursor-pointer px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
    >
      Skip
    </button>
  </div>
</div>


        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-300">
          {messages.map((msg, idx) => {
            const isYou = msg.sender === "you";

            const statusIcon = isYou && (
              <span className="ml-2 text-xs">
                {msg.status === "sent" && "✔"}
                {msg.status === "delivered" && "✔✔"}
                {msg.status === "seen" && <span className="text-blue-400">✔✔</span>}
              </span>
            );
          
  return (
    <div key={idx} className={`flex ${isYou ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] flex gap-3 px-4 py-2 text-sm rounded-2xl whitespace-pre-line relative
        ${isYou
          ? "bg-black text-white rounded-br-none"
          : "bg-gray-700 text-white rounded-bl-none"}`}>
        <p>
  {msg.content.startsWith("data:audio") ? (
    <audio controls src={msg.content}>
  Your browser does not support the audio element.
</audio>

  ) : msg.content.startsWith("data:image") ? (
    <img src={msg.content} alt="sent-media" className="max-w-xs h-100 rounded" />
  ) : msg.content.startsWith("data:video") ? (
    <video src={msg.content} controls className="max-w-xs rounded" />
  ) : (
    msg.content
  )}
</p>

        
        <div className="text-right text-xs text-gray-400 mt-1 flex items-center justify-end">
          <span>{msg.time}</span>
          {statusIcon}
        </div>
      </div>
    </div>
  );
})}

 <div ref={messagesEndRef} />
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
  {mediaFiles.map((file, index) => (
    <div key={index} className="relative">
      {file.type.startsWith("image/") ? (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="h-40 w-40 object-cover rounded left-10"
        />
      ) : (
        <video
          src={URL.createObjectURL(file)}
          controls
          className="h-20 w-20 rounded"
        />
      )}
    </div>
  ))}
</div>

        <div className="p-4 bg-black border-t border-zinc-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 rounded-full border  text-white "
              placeholder="Type a message..."
            />
            
            <div className="flex items-center gap-4 relative">
  {!isRecording ? (
    <button
      onClick={startRecording}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-700 text-white transition cursor-pointer"
      aria-label="Start recording"
    >
      <FaMicrophone className='size-6'/>
    </button>
  ) : (
    <button
      onClick={stopRecording}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
      aria-label="Stop recording"
    >
      ⏹
    </button>
  )}

  <div className="relative">
    <FaSmile
      className="text-2xl cursor-pointer text-white"
      onClick={() => setShowEmojiPicker(prev => !prev)}
      aria-label="Toggle emoji picker"
    />
    {showEmojiPicker && (
      <div
        className="absolute bottom-full mb-2 right-0 z-50"
        ref={emojiPickerRef}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>
    )}
  </div>

  <label htmlFor="fileInput" className="cursor-pointer text-white">
    <FaPaperclip className="size-6 hover:cursor-pointer " aria-label="Attach files" />
  </label>
  <input
    type="file"
    id="fileInput"
    accept="image/*,video/*"
    multiple
    className="hidden"
    onChange={handleFileChange}
  />
</div>

            
            <button
              onClick={sendMessage}
              className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 hover:cursor-pointer transition"
            >
              Send
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
