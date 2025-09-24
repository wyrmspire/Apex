import React, { useState, useEffect } from 'react';
// Corrected import to use @google/genai SDK
import { GoogleGenAI } from '@google/genai';
import { InsightCardData, ChallengeData } from '../types';
import { GeminiOrbIcon } from './icons';

interface CustomChallengeScreenProps {
  reportData: InsightCardData[];
  onComplete: (challenge: ChallengeData) => void;
}

const CustomChallengeScreen: React.FC<CustomChallengeScreenProps> = ({ reportData, onComplete }) => {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateChallenge = async () => {
      setIsLoading(true);
      try {
        // Corrected initialization to use an object with the apiKey
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const insightsSummary = reportData.map(insight => `- ${insight.title} (${insight.type}): ${insight.content}`).join('\n');

        const prompt = `
          Based on the following trading performance insights, create a specific, actionable, 1-week challenge for the trader.
          
          **Performance Insights:**
          ${insightsSummary}
          
          The challenge should have two parts:
          1.  **Focus Setup**: A single, specific trade setup they should ONLY focus on for the week. This should be derived from their strengths.
          2.  **Mission**: A single, clear mission to combat their primary weakness. This should be a behavioral goal.
          
          Format the output as a single, valid JSON object with two keys: "focusSetup" and "mission". The entire response text should be only the JSON object.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
        });
        
        // Corrected response handling to use the .text property and strip markdown
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.slice(7, -3);
        }
        const generatedChallenge = JSON.parse(jsonText);
        setChallenge(generatedChallenge);

      } catch (error) {
        console.error('Error generating challenge:', error);
        setChallenge({
          focusSetup: 'Error generating challenge.',
          mission: 'Please check the console for details and try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateChallenge();
  }, [reportData]);

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <GeminiOrbIcon className="w-16 h-16 text-teal-400 animate-spin mb-4" />
        <h1 className="text-3xl font-bold text-white">Crafting Your Custom Challenge...</h1>
        <p className="text-lg text-gray-400 mt-2">Gemini is designing a mission just for you.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Your 1-Week Challenge</h1>
      <p className="text-lg text-gray-400 mb-10 max-w-2xl">This mission is designed to build on your strengths and directly address your biggest leak.</p>
      
      <div className="bg-gray-800 p-8 rounded-lg max-w-3xl w-full border border-gray-700 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-teal-400 mb-2 tracking-widest uppercase">Focus Setup</h2>
          <p className="text-2xl text-white">{challenge?.focusSetup}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-teal-400 mb-2 tracking-widest uppercase">Your Mission</h2>
          <p className="text-2xl text-white">{challenge?.mission}</p>
        </div>
      </div>

      {challenge && !isLoading && (
        <button
          onClick={() => onComplete(challenge)}
          className="mt-12 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Begin Challenge & Go to Dashboard
        </button>
      )}
    </div>
  );
};

export default CustomChallengeScreen;