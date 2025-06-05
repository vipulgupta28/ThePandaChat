import React, { useState } from 'react';
import globe from "../assets/globe.png"
import anonymous from "../assets/anonymous.png"
import connection from "../assets/connection.png"
interface FeatureProps {
 
  title: string;
  description: string;
  image:string;
  active: boolean;
  onClick: () => void;
}

const Feature: React.FC<FeatureProps> = ({ title, description,image, active, onClick }) => {
  return (
    <div
      onClick={(e) => {
  e.preventDefault();
  e.stopPropagation(); 
 onClick();
}}

      className={`shrink-0 w-82 h-96 cursor-pointer transform transition-all duration-500 p-6 mx-4 
        rounded-2xl border border-zinc-700 shadow-xl text-white
        bg-gradient-to-br from-zinc-900 to-black 
        ${active ? 'scale-105 -translate-y-10 opacity-100 shadow-2xl' : 'opacity-30'}`
      }
    >
     
      <h3 className="text-3xl flex justify-center font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-center">{description}</p>
      <img src={image} alt={title} className="w-full h-60 object-cover rounded-lg " />
    </div>
  );
};

const Features: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1); 

 const featuresData = [
  {
    title: '100% Anonymous',
    description: 'Chat freely without revealing your identity. Your personal information stays private.',
    image: anonymous,
  },
  {
    title: 'Global Reach',
    description: 'Connect with people from over 150 countries, experiencing diverse cultures and perspectives.',
    image: globe,
  },
  {
    title: 'Instant Connection',
    description: 'Just one click to start chatting with someone new from anywhere in the world.',
    image: connection,
  },
];


  return (
    <section id="features" className="py-20 bg-black">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose Panda</h2>
        <p className="text-white max-w-2xl mx-auto">
          Our platform offers a unique way to connect with people around the world while maintaining your privacy.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center px-6 py-10 md:space-x-6 space-y-6 md:space-y-0">
  {featuresData.map((feature, index) => (
    <Feature
      key={index}
      title={feature.title}
      description={feature.description}
      image={feature.image}
      active={index === activeIndex}
      onClick={() => setActiveIndex(index)}
    />
  ))}
</div>

    </section>
  );
};

export default Features;
