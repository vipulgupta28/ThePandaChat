import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

import logo from "../assets/panda.png";
import { Link as ScrollLink } from 'react-scroll';



const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 

  return (
    <nav
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        w-[95%] md:w-[90%] lg:w-2/3
        rounded-full
        transition-all duration-300
        ${isScrolled ? 'bg-white text-black p-2 shadow-lg' : 'text-white p-0'}
      `}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-6 md:gap-12 flex-wrap">
          {/* Logo */}
          <ScrollLink
            to="hero"
            smooth={true}
            duration={500}
            offset={-60}
            className={`flex items-center gap-2 font-medium text-3xl cursor-pointer ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
            onClick={() => setIsOpen(false)} 
          >
            <img className="h-10 w-12" src={logo} alt="Panda Logo" />
            Panda
          </ScrollLink>

          <div className="hidden md:flex items-center space-x-8">
            {['features', 'how it works', 'whoarewe', 'pricing'].map((section) => (
              <ScrollLink
                key={section}
                to={section}
                smooth={true}
                duration={500}
                offset={-60}
                className={`rounded-full p-3 transition-colors duration-300 hover:bg-black hover:text-white cursor-pointer ${
                  isScrolled ? 'text-black font-medium' : 'text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {section === 'whoarewe' ? 'About' : section.charAt(0).toUpperCase() + section.slice(1)}
              </ScrollLink>
            ))}
          </div>

          <div className="hidden md:block flex gap-4">
            <ScrollLink
          
                to= 'startConnecting' 
                smooth={true}
                duration={500}
                offset={-60}>
                  <div>
                    
                  </div>
            <button
              className="bg-black hover:cursor-pointer text-white px-5 py-2 rounded hover:opacity-90 transition"
            >
              Get Started
            </button>

            
            </ScrollLink>


              {/* <button
              onClick={()=>navigate("/authpage")}
              className="bg-black ml-3 hover:cursor-pointer text-white px-5 py-2 rounded hover:opacity-90 transition"
            >
              Login
            </button> */}
            
            
            
            
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isScrolled ? 'text-black' : 'text-white'} focus:outline-none`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden bg-white shadow-lg rounded-b-lg mt-2 px-6 w-full absolute left-0 right-0 z-50 overflow-hidden
            transition-all duration-300 ease-in-out
            ${isOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
          `}
          style={{ transitionProperty: 'max-height, opacity, padding' }}
        >
          <div className="flex flex-col space-y-6">
            {['features', 'how-it-works', 'whoarewe', 'pricing'].map((section) => (
              <ScrollLink
                key={section}
                to={section}
                smooth={true}
                duration={500}
                offset={-60}
                className="text-gray-800 hover:text-black text-lg font-semibold py-3 cursor-pointer transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {section === 'whoarewe' ? 'About' : section.charAt(0).toUpperCase() + section.slice(1)}
              </ScrollLink>
            ))}

                <ScrollLink
          
                to= 'startConnecting' 
                smooth={true}
                duration={500}
                offset={-60}>
            <button
            onClick={()=>setIsOpen(!isOpen)}
              className="w-full  py-3 text-lg font-semibold">
              Get Started
            </button>

            
            </ScrollLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
