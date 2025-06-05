import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, isLast }) => {
  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-400 text-black text-lg font-bold shadow-md z-10">
        {number}
      </div>

      {!isLast && (
        <>
          <div className="block md:hidden w-0.5 h-12 bg-gray-600 opacity-30 ml-6 -mt-2"></div>
          <div className="hidden md:block absolute left-6 top-14 h-20 w-0.5 bg-gray-600 opacity-30"></div>
        </>
      )}

      <div className="pl-1">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-gray-300 text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <section id="how it works" className="py-16 px-4 sm:px-6 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 px-2">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Panda lets you start real conversations — instantly, anonymously, globally.
          </p>
        </div>

        <div className="space-y-12 md:space-y-20">
          <Step
            number={1}
            title="No Login — Just Start Chatting"
            description="No need to sign up. Just hit the start button and you're in. No personal data required."
          />
          <Step
            number={2}
            title="Instant Pairing Across the World"
            description="Click 'Start Chatting' and we'll connect you instantly with someone, anywhere on the globe."
          />
          <Step
            number={3}
            title="Don’t Like the Chat? Just Skip"
            description="Not vibing with your current match? Hit 'Next' and move on. It's that simple."
            isLast
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
