import React from 'react';

interface ObservationInstructionsScreenProps {
  onNext: () => void;
}

const ObservationInstructionsScreen: React.FC<ObservationInstructionsScreenProps> = ({ onNext }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Phase 2: Observation</h1>
      <p className="text-xl text-gray-300 max-w-3xl mb-8">
        Great, thank you for sharing. Now, for the next 3-5 trading days, I need you to do one simple thing:
      </p>
      <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full mb-12 border border-gray-700">
        <h2 className="text-2xl font-semibold text-teal-400 mb-4">Log Every Trade</h2>
        <p className="text-lg text-gray-400">
          After you take a trade (win, loss, or break-even), come back here and log it. You'll need to upload a screenshot of your chart at the time of execution and write a brief reason for taking the trade.
        </p>
      </div>
      <p className="text-lg text-gray-400 max-w-2xl mb-12">
        This will give us the raw data we need to find your edge and plug your leaks.
      </p>
      <button
        onClick={onNext}
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        I'm Ready, Let's Go
      </button>
    </div>
  );
};

export default ObservationInstructionsScreen;
