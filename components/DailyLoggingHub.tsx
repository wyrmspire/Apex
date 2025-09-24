import React, { useState, useRef } from 'react';
import { Trade } from '../types';
import { PlusIcon, UploadIcon, CloseIcon } from './icons';

interface DailyLoggingHubProps {
  onComplete: (trades: Trade[]) => void;
}

const DailyLoggingHub: React.FC<DailyLoggingHubProps> = ({ onComplete }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTradeReason, setNewTradeReason] = useState('');
  const [newTradeScreenshot, setNewTradeScreenshot] = useState<string | null>(null);
  const [newTradeScreenshotName, setNewTradeScreenshotName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTradeScreenshot(e.target?.result as string);
        setNewTradeScreenshotName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTrade = () => {
    if (newTradeReason && newTradeScreenshot) {
      const newTrade: Trade = {
        id: new Date().toISOString(),
        reason: newTradeReason,
        screenshot: newTradeScreenshot,
        screenshotName: newTradeScreenshotName,
        timestamp: new Date().toLocaleString(),
      };
      setTrades([...trades, newTrade]);
      setShowModal(false);
      setNewTradeReason('');
      setNewTradeScreenshot(null);
      setNewTradeScreenshotName('');
    }
  };

  return (
    <div className="flex-grow flex flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Daily Trade Log</h1>
        <button
          onClick={() => onComplete(trades)}
          disabled={trades.length < 3}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Generate Baseline Report
        </button>
      </div>
      <p className="text-gray-400 mb-6">Log at least 3 trades to generate your initial performance report.</p>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trades.map((trade) => (
          <div key={trade.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img src={trade.screenshot} alt="Trade screenshot" className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-gray-300 text-sm mb-2">{trade.reason}</p>
              <p className="text-gray-500 text-xs">{trade.timestamp}</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition min-h-[250px]"
        >
          <PlusIcon className="w-12 h-12 mb-2" />
          <span>Log New Trade</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg m-4 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <CloseIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Log a New Trade</h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Reason for Entry</label>
              <textarea
                value={newTradeReason}
                onChange={(e) => setNewTradeReason(e.target.value)}
                placeholder="e.g., Break and retest of daily support, 5min RSI divergence..."
                className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Trade Screenshot</label>
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-md text-gray-400 hover:border-teal-500 hover:text-teal-500 transition"
              >
                <UploadIcon className="w-8 h-8 mb-2" />
                <span>{newTradeScreenshotName || 'Click to upload'}</span>
              </button>
            </div>

            <button
              onClick={handleAddTrade}
              disabled={!newTradeReason || !newTradeScreenshot}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-full transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Add Trade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyLoggingHub;
