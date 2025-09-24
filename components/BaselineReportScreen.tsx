import React, { useState, useEffect } from 'react';
// Corrected import to use @google/genai SDK
import { GoogleGenAI } from '@google/genai';
import { InterviewData, Trade, InsightCardData } from '../types';
import { ChartIcon } from './icons';

interface BaselineReportScreenProps {
  interviewData: InterviewData;
  trades: Trade[];
  onComplete: (insights: InsightCardData[]) => void;
}

const BaselineReportScreen: React.FC<BaselineReportScreenProps> = ({ interviewData, trades, onComplete }) => {
  const [insights, setInsights] = useState<InsightCardData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
      try {
        // Corrected initialization to use an object with the apiKey
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const tradeSummaries = trades.map(t => `- Reason for trade: ${t.reason}`).join('\n');
        
        const prompt = `
          Analyze the following trader's data to generate a baseline performance report.
          
          **Trader Interview:**
          - Trading Story: ${interviewData.story}
          - Preferred Setups: ${interviewData.setups}
          - Biggest Mistake: ${interviewData.mistake}
          - Ideal Trading Day: ${interviewData.idealDay}
          
          **Recent Trades:**
          ${tradeSummaries}
          
          Based on all this information, identify 3 key insights. For each insight, provide a title, a short content paragraph (2-3 sentences), and an icon type from this list: 'strength', 'weakness', 'opportunity'.
          
          Format the output as a valid JSON array of objects, where each object has "type", "title", and "content" fields. The entire response text should be only the JSON array.
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
        const generatedInsights = JSON.parse(jsonText);

        const insightsWithIcons: InsightCardData[] = generatedInsights.map((insight: any) => ({
            ...insight,
            icon: 'ChartIcon'
        }));

        setInsights(insightsWithIcons);

      } catch (error) {
        console.error('Error generating report:', error);
        const fallbackInsights: InsightCardData[] = [
          { type: 'error', title: 'Error Loading Report', content: 'There was an issue generating your report. Please check the console for details and try again later.', icon: 'ChartIcon' },
        ];
        setInsights(fallbackInsights);
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, [interviewData, trades]);

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <ChartIcon className="w-16 h-16 text-teal-400 animate-pulse mb-4" />
        <h1 className="text-3xl font-bold text-white">Generating Your Baseline Report...</h1>
        <p className="text-lg text-gray-400 mt-2">Gemini is analyzing your interview and trade logs.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-white mb-2">Your Baseline Report</h1>
      <p className="text-lg text-gray-400 mb-10">Here are the key insights from your initial data.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {insights?.map((insight, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col">
            <h2 className="text-2xl font-semibold text-teal-400 mb-3">{insight.title}</h2>
            <p className="text-gray-300 flex-grow">{insight.content}</p>
          </div>
        ))}
      </div>

      {insights && !isLoading && (
        <button
          onClick={() => onComplete(insights)}
          className="mt-12 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create My Custom Challenge
        </button>
      )}
    </div>
  );
};

export default BaselineReportScreen;