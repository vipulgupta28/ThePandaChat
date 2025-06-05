import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';
import logo from "../assets/panda.png";
import background from "../assets/background-img.jpg";

const Footer: React.FC = () => {
  return (
    <footer
      className="relative w-full bg-cover bg-center text-white rounded-xl"
      style={{ backgroundImage: `url(${background})` }}
    >
    
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center flex flex-col items-center">
  
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} className="h-10 w-10 sm:h-12 sm:w-12" alt="Panda Logo" />
          <h2 className="text-3xl sm:text-4xl font-bold">Panda</h2>
        </div>

        <p className="text-gray-300 max-w-md text-sm sm:text-base mb-6">
          Anonymous chat platform connecting people worldwide.
        </p>

        <div className="flex space-x-6 mb-6">
          <a href="#" className="text-white hover:text-white transition-colors">
            <Twitter size={22} />
          </a>
          <a href="#" className="text-white hover:text-white transition-colors">
            <Instagram size={22} />
          </a>
          <a href="https://www.github.com/vipulgupta28/Panda" className="text-white hover:text-white transition-colors">
            <Github size={22} />
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base text-white mb-6">
          <a 
            href="/Panda_Privacy_Policy.pdf" 
            download="Panda_Privacy_Policy.pdf"
            className="hover:bg-zinc-800 p-3 rounded-full duration-400"
          >
            Privacy
          </a>
          <a 
            href="/Panda_Terms_of_Service.pdf" 
            download="Panda_Terms_of_Service.pdf"
            className="hover:bg-zinc-800 p-3 rounded-full duration-400"
          >
            Terms
          </a>
          <a 
            href="/Panda_Contact.pdf" 
            download="Panda_Contact.pdf"
            className="hover:bg-zinc-800 p-3 rounded-full duration-400"
          >
            Contact
          </a>
        </div>

        <p className="text-xs sm:text-sm text-white">
          &copy; {new Date().getFullYear()} PANDA. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
