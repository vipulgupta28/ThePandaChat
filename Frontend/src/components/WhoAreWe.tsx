import React, { useRef, useEffect } from 'react';
import { GlobeDemo } from './globe';

const WhoAreWe: React.FC = () => {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <section id="whoarewe" className="relative py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-6 md:px-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight animate-fadeInUp">
            Who Are We?
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto animate-fadeInUp delay-200">
            Panda is a space where anonymity sparks authenticity. Here's what makes us different:
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-0">
          <div className="relative w-full lg:w-1/2 h-[500px] animate-fadeInUp delay-300">
           <GlobeDemo/>
          </div>

          <div className="w-full lg:w-1/2 text-white text-xl space-y-6 animate-fadeInUp delay-500 leading-relaxed">
            <p>
              <strong className="text-white">Panda</strong> is an open-source software with a mission to build anonymous,
              inclusive, and empowering digital spaces.
            </p>
            <p>
              We believe in the power of authentic human expression — where people can share their thoughts without fear, connect with
              others from around the globe, and foster real, unfiltered conversations.
            </p>
            <p>
              Our global community is built by the people, for the people — with transparency, respect, and collaboration at its core.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
