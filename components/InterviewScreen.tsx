import React, { useState, useEffect, useRef } from 'react';
import { InterviewData } from '../types';
import { GeminiOrbIcon, SendIcon } from './icons';

interface InterviewScreenProps {
  onComplete: (data: InterviewData) => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStage, setInterviewStage] = useState(0);
  const [interviewData, setInterviewData] = useState<Partial<InterviewData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "To start, tell me a bit about your trading story. How did you get started, and what has your journey been like so far?",
    "What are the top 2-3 specific trade setups you primarily focus on? Describe them briefly.",
    "What's the single biggest, most painful mistake you find yourself repeating in your trading?",
    "Describe your ideal trading day. What does it look and feel like from start to finish?"
  ];

  useEffect(() => {
    setMessages([{ role: 'model', text: questions[0] }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage = { role: 'user' as const, text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    const currentStage = interviewStage;
    const newInterviewData = { ...interviewData };
    if (currentStage === 0) newInterviewData.story = userInput;
    if (currentStage === 1) newInterviewData.setups = userInput;
    if (currentStage === 2) newInterviewData.mistake = userInput;
    if (currentStage === 3) newInterviewData.idealDay = userInput;
    setInterviewData(newInterviewData);

    setTimeout(() => {
      const modelResponse = "Thanks for sharing. That's really insightful.";
      const nextStage = currentStage + 1;

      if (nextStage < questions.length) {
        setMessages(prev => [...prev, { role: 'model', text: `${modelResponse} Now, ${questions[nextStage].toLowerCase()}` }]);
        setInterviewStage(nextStage);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Thank you for sharing all of that. I have what I need to get started. Let's move on to the next step." }]);
        setTimeout(() => onComplete(newInterviewData as InterviewData), 2000);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh)] p-4">
      <div className="flex-grow overflow-y-auto mb-4 p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <GeminiOrbIcon className="w-8 h-8 text-teal-400 flex-shrink-0" />}
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'model' ? 'bg-gray-800 text-gray-200' : 'bg-teal-600 text-white'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <GeminiOrbIcon className="w-8 h-8 text-teal-400 flex-shrink-0 animate-pulse" />
            <div className="max-w-xl p-3 rounded-lg bg-gray-800 text-gray-200">
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-shrink-0 p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center bg-gray-800 rounded-full p-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder="Type your response..."
            className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none px-4"
            rows={1}
            disabled={isLoading || interviewStage >= questions.length}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim() || interviewStage >= questions.length}
            className="bg-teal-500 rounded-full p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-teal-600 transition"
          >
            <SendIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;
