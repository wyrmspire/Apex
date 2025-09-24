import React, { useState } from 'react';
import { GeminiOrbIcon, LeftArrowIcon, RightArrowIcon } from './icons';
import { InsightCardData } from '../types';

interface BaselineReportScreenProps {
  cards: InsightCardData[] | null;
  onNext: () => void;
}

const BaselineReportScreen: React.FC<BaselineReportScreenProps> = ({ cards, onNext }) => {
    const [currentCard, setCurrentCard] = useState(0);

    if (!cards || cards.length === 0) {
        // Fallback for unexpected empty state
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h2 className="text-xl text-gray-400">No report data available.</h2>
                <button onClick={onNext} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Continue
                </button>
            </div>
        );
    }
    
    const nextCard = () => {
        if (currentCard < cards.length - 1) {
            setCurrentCard(currentCard + 1);
        }
    };

    const prevCard = () => {
        if (currentCard > 0) {
            setCurrentCard(currentCard - 1);
        }
    };
    
    const card = cards[currentCard];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
            <header className="text-center mb-8 max-w-2xl">
                <GeminiOrbIcon className="w-16 h-16 mx-auto text-blue-400 mb-4"/>
                <h1 className="text-3xl font-bold text-white">Your Baseline Report</h1>
                <p className="text-lg text-gray-400 mt-2">I've analyzed your 5 days of trading and our conversation. I've identified a few key patterns and a powerful hidden strength.</p>
            </header>

            <div className="w-full max-w-md relative">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl min-h-[320px] flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider">{card.type}</p>
                        <h2 className="text-2xl font-bold text-white mt-2 mb-4">{card.icon} {card.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{card.content}</p>
                    </div>
                </div>

                <button onClick={prevCard} disabled={currentCard === 0} className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 p-3 bg-gray-700 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600 transition">
                    <LeftArrowIcon className="w-6 h-6"/>
                </button>
                <button onClick={nextCard} disabled={currentCard === cards.length - 1} className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 p-3 bg-gray-700 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600 transition">
                    <RightArrowIcon className="w-6 h-6"/>
                </button>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
                {cards.map((_, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full transition-colors ${currentCard === index ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                ))}
            </div>

            <div className="mt-10">
                {currentCard === cards.length - 1 ? (
                    <button
                        onClick={onNext}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    >
                        View My Challenge
                    </button>
                ) : (
                     <button
                        onClick={nextCard}
                        className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300"
                    >
                        Next Insight
                    </button>
                )}
            </div>
        </div>
    );
};

export default BaselineReportScreen;