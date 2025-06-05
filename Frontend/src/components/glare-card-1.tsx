import { GlareCard } from "../ui/glare-card";
import { XCircle } from "lucide-react";
import { Link as ScrollLink } from 'react-scroll';

export function GlareCardDemo1() {
  return (
    <>
     <div className="flex flex-col items-center justify-center space-y-6">
    <GlareCard className="flex h-full max-w-md w-full flex-col items-center justify-center rounded-2xl p-8 backdrop-blur-lg border border-white/10 shadow-xl text-white">
        <h3 className="text-3xl font-extrabold mb-6 text-center">Free Plan</h3>

        <ul className="space-y-4 text-base text-left w-full">
          {[
            "Ad-free chatting",
            "Video Calling",
            "Faster performance",
            "Enhanced customization",
            "Priority notifications",
          ].map((feature, i) => (
            <li key={i} className="flex items-center space-x-2">
              <XCircle className="text-red-500 w-5 h-5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <div className="text-xl font-medium text-gray-300">Free</div>
          <div className="text-6xl font-bold text-white mt-1">0/-</div>
          <div className="text-sm text-gray-400 mt-1">per month</div>
        </div>
      </GlareCard>
       <ScrollLink
                  to="hero"
                  smooth={true}
                  duration={500}
                  offset={-60}
                  >
      <button
       
        className="px-6 py-3 rounded-full font-semibold text-black bg-white hover:bg-gray-200 hover:cursor-pointer"
      >
        Start Now
      </button>
      </ScrollLink>
      </div>
      </>
  );
}
