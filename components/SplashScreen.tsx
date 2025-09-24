import React, { useEffect } from 'react';
import { ApexLogo } from './icons';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="animate-pulse">
        <ApexLogo className="w-24 h-24 text-teal-400" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-wider">Apex Challenge</h1>
      <p className="mt-2 text-lg text-gray-400">Your AI Trading Performance Coach</p>
    </div>
  );
};

export default SplashScreen;