import React from 'react';
import { ApexLogo } from './icons';

interface IntroductionScreenProps {
  onNext: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onNext }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
      <ApexLogo className="w-20 h-20 text-teal-400 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Apex Challenge</h1>
      <p className="text-xl text-gray-300 max-w-2xl mb-8">
        We'll help you identify your trading patterns, conquer your psychological hurdles, and build a personalized roadmap to consistent profitability.
      </p>
      <p className="text-lg text-gray-400 max-w-2xl mb-12">
        To start, we'll have a brief chat to understand your unique journey as a trader.
      </p>
      <button
        onClick={onNext}
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Let's Get Started
      </button>
    </div>
  );
};

export default IntroductionScreen;