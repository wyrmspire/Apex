import React, { useState, useCallback, ChangeEvent } from 'react';
import { Trade } from '../types';
import { PlusIcon, UploadIcon, ChartIcon, CloseIcon } from './icons';

interface DailyLoggingHubProps {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  onComplete: () => Promise<void>;
}

interface LogTradeModalProps {
    onClose: () => void; 
    onSave: (trade: Omit<Trade, 'id' | 'timestamp'>) => void
}

const LogTradeModal: React.FC<LogTradeModalProps> = ({ onClose, onSave }) => {
    const [reason, setReason] = useState('');
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [screenshotName, setScreenshotName] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result as string);
                setScreenshotName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = () => {
        if (!screenshot) {
            setError('Please upload a screenshot.');
            return;
        }
        if (!reason.trim()) {
            setError('Please provide a reason for the trade.');
            return;
        }
        onSave({ screenshot, screenshotName, reason });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-gray-700 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">Log New Trade</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Upload a Screenshot</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {screenshot ? (
                                <img src={screenshot} alt="Trade screenshot" className="max-h-40 mx-auto rounded-md" />
                            ) : (
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                            )}
                            <div className="flex text-sm text-gray-500">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none p-1">
                                    <span>{screenshot ? 'Change file' : 'Upload a file'}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-600">{screenshotName || 'PNG, JPG, GIF up to 10MB'}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-400 mb-2">In one sentence, why did you take this trade?</label>
                    <textarea
                        id="reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                        placeholder="e.g., 'Support/Resistance Flip setup on the 5-min chart.'"
                    />
                </div>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button onClick={handleSave} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                    Save Trade
                </button>
            </div>
        </div>
    );
};

const DailyLoggingHub: React.FC<DailyLoggingHubProps> = ({ trades, addTrade, onComplete }) => {
    const [day, setDay] = useState(1);
    const [showModal, setShowModal] = useState(false);
    
    const completeDay = () => {
        if(day < 5) {
            setDay(d => d + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 animate-fade-in">
            {showModal && <LogTradeModal onClose={() => setShowModal(false)} onSave={addTrade} />}
            <header className="max-w-4xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-white">Observation Period</h1>
                    <span className="text-lg font-semibold text-blue-400">Day {day} of 5</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(day / 5) * 100}%` }}></div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-8">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-3 bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                    >
                        <PlusIcon className="w-6 h-6"/>
                        Log a New Trade
                    </button>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-300">Today's Logged Trades</h2>
                    {trades.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <ChartIcon className="w-12 h-12 mx-auto mb-2"/>
                            <p>No trades logged for today yet.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {trades.map(trade => (
                                <li key={trade.id} className="bg-gray-700 p-4 rounded-lg flex items-start gap-4">
                                    <img src={trade.screenshot} alt="trade" className="w-24 h-16 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="text-gray-200">{trade.reason}</p>
                                        <p className="text-xs text-gray-400 mt-1">{trade.screenshotName}</p>
                                    </div>
                                    <span className="text-sm text-gray-500 flex-shrink-0">{trade.timestamp}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={completeDay}
                        className={`${day < 5 ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'} text-gray-200 font-semibold py-2 px-6 rounded-lg transition-colors`}
                    >
                        {day < 5 ? `End Day ${day}` : 'Finish 5-Day Observation'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default DailyLoggingHub;