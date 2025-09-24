import React, { useState, useEffect, useRef } from 'react';
import { GeminiOrbIcon, SendIcon } from './icons';
import { InterviewData } from '../types';

interface InterviewScreenProps {
  onComplete: (data: InterviewData) => void;
}

const questions = [
  "Great. Let's start with your story. Briefly, what markets do you trade, and for how long have you been trading?",
  "Thank you. Now, let's talk about your playbook. What are the names of the primary setups you trade? (e.g., 'Opening Range Breakout', 'RSI Divergence'). Just list them out.",
  "Got it. This is a crucial question: What is the #1 mistake that you feel holds you back the most? (e.g., 'Revenge trading', 'Moving my stop-loss').",
  "I understand. That's a very common challenge. Finally, in a perfect world, what does a successful trading day feel like to you?",
];

interface Message {
    text: string;
    sender: 'ai' | 'user';
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ onComplete }) => {
    const [messages, setMessages] = useState<Message[]>([{text: questions[0], sender: 'ai'}]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [answers, setAnswers] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim() || isTyping) return;
        
        const newAnswers = [...answers, inputValue];
        setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
        setAnswers(newAnswers);
        setInputValue('');

        const nextIndex = currentQuestionIndex + 1;
        
        setIsTyping(true);
        setTimeout(() => {
            if (nextIndex < questions.length) {
                setMessages(prev => [...prev, { text: questions[nextIndex], sender: 'ai' }]);
                setCurrentQuestionIndex(nextIndex);
            } else {
                const finalData: InterviewData = {
                    story: newAnswers[0] || '',
                    setups: newAnswers[1] || '',
                    mistake: newAnswers[2] || '',
                    idealDay: newAnswers[3] || '',
                };
                onComplete(finalData);
            }
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 animate-fade-in">
            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        {msg.sender === 'ai' && <GeminiOrbIcon className="w-8 h-8 text-blue-400 flex-shrink-0" />}
                        <div className={`max-w-md md:max-w-lg p-4 rounded-2xl ${msg.sender === 'ai' ? 'bg-gray-700 text-gray-200 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-end gap-3 justify-start animate-fade-in">
                       <GeminiOrbIcon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                       <div className="p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                       </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-6 flex items-center bg-gray-800 rounded-xl p-2 border border-gray-700">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your response..."
                    className="flex-grow bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none px-3"
                    disabled={isTyping}
                />
                <button
                    onClick={handleSend}
                    disabled={isTyping || !inputValue.trim()}
                    className="bg-blue-600 p-3 rounded-lg text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default InterviewScreen;