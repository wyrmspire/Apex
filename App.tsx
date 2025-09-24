import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FlowStep, Trade, InterviewData, InsightCardData, ChallengeData } from './types';
import SplashScreen from './components/SplashScreen';
import IntroductionScreen from './components/IntroductionScreen';
import InterviewScreen from './components/InterviewScreen';
import ObservationInstructionsScreen from './components/ObservationInstructionsScreen';
import DailyLoggingHub from './components/DailyLoggingHub';
import BaselineReportScreen from './components/BaselineReportScreen';
import CustomChallengeScreen from './components/CustomChallengeScreen';
import { GeminiOrbIcon } from './components/icons';

const AnalyzingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
    <GeminiOrbIcon className="w-24 h-24 mx-auto text-blue-400 animate-pulse-slow mb-6"/>
    <h1 className="text-3xl font-bold text-white">Analyzing Your Trades...</h1>
    <p className="mt-4 text-lg text-gray-300">The coach is reviewing your interview and trade logs to identify patterns and find your edge.</p>
  </div>
);

const App: React.FC = () => {
  const [flowStep, setFlowStep] = useState<FlowStep>(FlowStep.Splash);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [interviewData, setInterviewData] = useState<Partial<InterviewData>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState<InsightCardData[] | null>(null);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (flowStep === FlowStep.Splash) {
      const timer = setTimeout(() => {
        setFlowStep(FlowStep.Introduction);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flowStep]);
  
  const handleNext = useCallback(() => {
    setFlowStep(prev => {
      if (prev === FlowStep.Dashboard) return FlowStep.Dashboard;
      return prev + 1;
    });
  }, []);

  const handleInterviewComplete = (data: InterviewData) => {
    setInterviewData(data);
    handleNext();
  };

  const handleObservationComplete = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const prompt = `
        You are an expert AI trading performance coach. Your goal is to analyze a trader's interview answers and their trade logs from a 5-day observation period. Based on this data, you will generate a concise, empathetic, and actionable baseline report and propose a 90-day challenge.

        The report must contain exactly 3 insight cards:
        1. An "Identified Pattern" (e.g., playbook drift, overtrading).
        2. A "Psychological Loop" (e.g., revenge trading, fear of missing out).
        3. A "Hidden Strength" (a specific setup or condition where the trader performs well).

        The challenge must be based on the "Hidden Strength".

        You must not give financial advice or trade signals. Your analysis must focus on behavior, discipline, and consistency. Your response must be in JSON format. Use emojis for icons.

        Here is the trader's data:

        **Interview Answers:**
        - Markets and experience: ${interviewData.story || 'Not provided.'}
        - Declared setups: ${interviewData.setups || 'Not provided.'}
        - #1 mistake described by them: ${interviewData.mistake || 'Not provided.'}
        - What an ideal day feels like: ${interviewData.idealDay || 'Not provided.'}

        **Logged Trades from 5-day observation (notes from user):**
        ${trades.length > 0 ? trades.map(t => `- "${t.reason}"`).join('\n') : 'No trades were logged.'}

        Now, generate the JSON output based on this data.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insightCards: {
                type: Type.ARRAY,
                description: "An array of exactly 3 insight cards.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    icon: { type: Type.STRING, description: "A single emoji." },
                  },
                  required: ['type', 'title', 'content', 'icon']
                }
              },
              challenge: {
                type: Type.OBJECT,
                properties: {
                  focusSetup: { type: Type.STRING },
                  mission: { type: Type.STRING }
                },
                required: ['focusSetup', 'mission']
              }
            },
            required: ['insightCards', 'challenge']
          },
        },
      });

      let jsonString = response.text.trim();
      const match = jsonString.match(/```json\n([\s\S]*)\n```/);
      if (match) {
        jsonString = match[1];
      }
      
      const result = JSON.parse(jsonString);

      setReportData(result.insightCards);
      setChallengeData(result.challenge);
      handleNext();
    } catch (error) {
      console.error("Error analyzing trades:", error);
      setAnalysisError("Sorry, the AI coach couldn't analyze your data right now. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const addTrade = (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    const newTrade: Trade = {
      ...trade,
      id: `trade_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTrades(prev => [...prev, newTrade]);
  };

  const renderContent = () => {
    if (isAnalyzing) {
      return <AnalyzingScreen />;
    }
    if (analysisError) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-3xl font-bold text-red-400">Analysis Failed</h1>
            <p className="mt-4 text-lg text-gray-300">{analysisError}</p>
            <button
                onClick={() => setFlowStep(FlowStep.DailyLogging)}
                className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-500 transition-colors"
            >
                Return to Logging
            </button>
          </div>
        );
    }

    switch (flowStep) {
      case FlowStep.Splash:
        return <SplashScreen />;
      case FlowStep.Introduction:
        return <IntroductionScreen onNext={handleNext} />;
      case FlowStep.Interview:
        return <InterviewScreen onComplete={handleInterviewComplete} />;
      case FlowStep.ObservationInstructions:
        return <ObservationInstructionsScreen onNext={handleNext} />;
      case FlowStep.DailyLogging:
        return <DailyLoggingHub trades={trades} addTrade={addTrade} onComplete={handleObservationComplete} />;
      case FlowStep.Report:
        return <BaselineReportScreen cards={reportData} onNext={handleNext} />;
      case FlowStep.Challenge:
        return <CustomChallengeScreen challenge={challengeData} onAccept={() => setFlowStep(FlowStep.Dashboard)} />;
      case FlowStep.Dashboard:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-green-400">Challenge Accepted!</h1>
            <p className="mt-4 text-lg text-gray-300">Welcome to your dashboard. Your journey to mastery begins now.</p>
            <p className="mt-2 text-sm text-gray-500">(Dashboard UI coming soon)</p>
          </div>
        );
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;