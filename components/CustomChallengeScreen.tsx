import React from 'react';
import { GeminiOrbIcon } from './icons';
import { ChallengeData } from '../types';

interface CustomChallengeScreenProps {
  challenge: ChallengeData | null;
  onAccept: () => void;
}

const CustomChallengeScreen: React.FC<CustomChallengeScreenProps> = ({ challenge, onAccept }) => {
  const focusSetup = challenge?.focusSetup || "'Your Hidden Strength'";
  const mission = challenge?.mission || "Our primary mission will be to eliminate impulsive trades and focus exclusively on mastering your hidden strength.";

  return (
    <div className="flex items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="max-w-2xl w-full bg-gray-800/50 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700 backdrop-blur-sm text-center">
        <div className="mb-8">
            <GeminiOrbIcon className="w-20 h-20 mx-auto text-blue-400"/>
            <h1 className="text-3xl font-bold mt-4 text-white">Your 90-Day Apex Challenge</h1>
        </div>
        <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>Based on the analysis, I have designed your challenge. {mission} We'll focus on mastering the <strong className="text-blue-400 font-semibold">{focusSetup}</strong> setup.</p>
            <p className="font-semibold text-white">This is how we turn your hidden strength into your core skill.</p>
            <p className="text-2xl font-bold text-white mt-8">Are you ready to accept your challenge?</p>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onAccept}
            className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            Accept the Challenge
          </button>
          <button
            className="w-full sm:w-auto text-gray-400 font-semibold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors"
          >
            I have questions first
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomChallengeScreen;