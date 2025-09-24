import React, { useState, useCallback } from 'react';
import { FlowStep, InterviewData, Trade, InsightCardData, ChallengeData } from './types';
import SplashScreen from './components/SplashScreen';
import IntroductionScreen from './components/IntroductionScreen';
import InterviewScreen from './components/InterviewScreen';
import ObservationInstructionsScreen from './components/ObservationInstructionsScreen';
import DailyLoggingHub from './components/DailyLoggingHub';
import BaselineReportScreen from './components/BaselineReportScreen';
import CustomChallengeScreen from './components/CustomChallengeScreen';

const App: React.FC = () => {
  const [flowStep, setFlowStep] = useState<FlowStep>(FlowStep.Splash);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [reportData, setReportData] = useState<InsightCardData[] | null>(null);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);

  const handleNext = useCallback(() => {
    if (flowStep === FlowStep.Dashboard) return;
    setFlowStep(prev => prev + 1);
  }, [flowStep]);
  
  const goToStep = useCallback((step: FlowStep) => {
      setFlowStep(step);
  }, []);

  const handleInterviewComplete = (data: InterviewData) => {
    setInterviewData(data);
    handleNext();
  };

  const handleObservationComplete = (loggedTrades: Trade[]) => {
    if(loggedTrades.length > 0){
        setTrades(loggedTrades);
        handleNext();
    }
  };

  const handleReportComplete = (insights: InsightCardData[]) => {
    setReportData(insights);
    handleNext();
  }

  const handleChallengeComplete = (challenge: ChallengeData) => {
    setChallengeData(challenge);
    handleNext();
  }

  const renderCurrentStep = () => {
    switch (flowStep) {
      case FlowStep.Splash:
        return <SplashScreen onComplete={handleNext} />;
      case FlowStep.Introduction:
        return <IntroductionScreen onNext={handleNext} />;
      case FlowStep.Interview:
        return <InterviewScreen onComplete={handleInterviewComplete} />;
      case FlowStep.ObservationInstructions:
        return <ObservationInstructionsScreen onNext={handleNext} />;
      case FlowStep.DailyLogging:
        return <DailyLoggingHub onComplete={handleObservationComplete} />;
      case FlowStep.Report:
        if (!interviewData || trades.length === 0) {
            return <div className="flex-grow flex items-center justify-center">Missing data to generate report. <button onClick={() => goToStep(FlowStep.Introduction)} className="ml-2 text-teal-400 hover:underline">Restart</button></div>
        }
        return <BaselineReportScreen interviewData={interviewData} trades={trades} onComplete={handleReportComplete} />;
      case FlowStep.Challenge:
        if (!reportData) {
             return <div className="flex-grow flex items-center justify-center">Missing report data. <button onClick={() => goToStep(FlowStep.Report)} className="ml-2 text-teal-400 hover:underline">Go Back</button></div>
        }
        return <CustomChallengeScreen reportData={reportData} onComplete={handleChallengeComplete} />;
      case FlowStep.Dashboard:
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
                <p className="text-lg text-gray-400 mb-10 max-w-2xl">
                    Here you can track your progress on your challenge and continue logging trades.
                </p>
                {challengeData && (
                    <div className="bg-gray-800 p-8 rounded-lg max-w-3xl w-full border border-gray-700 space-y-8 mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-teal-400 mb-2 tracking-widest uppercase">Current Challenge: Focus Setup</h2>
                            <p className="text-2xl text-white">{challengeData.focusSetup}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-teal-400 mb-2 tracking-widest uppercase">Current Challenge: Mission</h2>
                            <p className="text-2xl text-white">{challengeData.mission}</p>
                        </div>
                    </div>
                )}
                 <button
                    onClick={() => goToStep(FlowStep.Splash)}
                    className="mt-12 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full text-lg transition"
                >
                    Restart Journey
                </button>
            </div>
        );
      default:
        return <SplashScreen onComplete={handleNext} />;
    }
  };

  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen flex flex-col antialiased">
      {renderCurrentStep()}
    </main>
  );
};

export default App;
