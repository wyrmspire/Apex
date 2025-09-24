
import React from 'react';
import { GeminiOrbIcon } from './icons';

interface IntroductionScreenProps {
  onNext: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onNext }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="max-w-2xl w-full bg-gray-800/50 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700 backdrop-blur-sm">
        <div className="text-center mb-8">
            <GeminiOrbIcon className="w-20 h-20 mx-auto text-blue-400 animate-pulse-slow"/>
        </div>
        <div className="space-y-6 text-lg text-gray-300 text-center leading-relaxed">
            <p>Welcome. I'm your AI performance coach.</p>
            <p>My purpose isn't to give you signals or tell you what to trade. It's to help you discover and master your own unique edge.</p>
            <p>Before we design your 90-day challenge, I need to understand your journey.</p>
            <p className="font-semibold text-white">Shall we begin?</p>
        </div>
        <div className="mt-12 text-center">
          <button
            onClick={onNext}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            Start the Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroductionScreen;