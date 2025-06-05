import React from 'react';

import { GlareCardDemo1 } from './glare-card-1';
import { PremiumCardDemo } from './premium-card';

const CallToAction: React.FC = () => {
  return (
    <section id="pricing" className="py-20 relative bg-gblack">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-6xl font-bold mb-4">Unlock Premium Features</h2>
          <p className="text-lg text-gray-300">
            Choose the experience that suits you best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <GlareCardDemo1/>

          <PremiumCardDemo/>

           
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
