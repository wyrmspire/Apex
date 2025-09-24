
import React from 'react';
import { GeminiOrbIcon } from './icons';

interface ObservationInstructionsScreenProps {
  onNext: () => void;
}

const ObservationInstructionsScreen: React.FC<ObservationInstructionsScreenProps> = ({ onNext }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="max-w-2xl w-full bg-gray-800/50 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700 backdrop-blur-sm">
        <div className="text-center mb-8">
          <GeminiOrbIcon className="w-20 h-20 mx-auto text-blue-400"/>
        </div>
        <div className="space-y-6 text-lg text-gray-300 text-center leading-relaxed">
            <p className="font-semibold text-white">Thank you for sharing that. My analysis begins now, but I need your help.</p>
            <p>For the next <span className="font-bold text-blue-400">5 trading days</span>, I have one simple instruction for you: Trade exactly as you normally would.</p>
            <p className="text-gray-400">Don't try to be perfect or change your behavior. My goal is to see your unfiltered process. For every trade you take, log it here. It's a simple process: just a screenshot of your chart and a quick note on why you took it.</p>
            <p className="font-semibold text-white">I will not judge or score you this week. I am only observing. Are you ready?</p>
        </div>
        <div className="mt-12 text-center">
          <button
            onClick={onNext}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            I'm Ready. Start My 5-Day Observation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObservationInstructionsScreen;
