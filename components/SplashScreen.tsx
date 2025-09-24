
import React from 'react';
import { ApexLogo } from './icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="text-center animate-fade-in-slow">
        <div className="flex justify-center items-center gap-4 mb-6 opacity-80 animate-pulse-slow">
            <ApexLogo className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-light tracking-wider text-gray-200">Apex Challenge</h1>
        </div>
        <p className="text-lg text-gray-400 animate-fade-in-delayed tracking-wide">
          The journey to consistent trading starts with understanding.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;