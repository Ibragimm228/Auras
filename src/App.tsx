import React, { useState, useEffect } from 'react';
import { Sparkles, History, X, Trash2, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuraResult, AuraHistory } from './types';
import { getRandomAura } from './utils/getRandomAura';
import { saveAuraToHistory, getAuraHistory, clearAuraHistory } from './utils/localStorage';
import { playSound } from './utils/sound';
import { getRarityBadge, getRarityColor } from './utils/rarity';

function App() {
  const [result, setResult] = useState<AuraResult>({
    aura: null,
    isRevealed: false
  });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AuraHistory[]>(getAuraHistory());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const generateAura = () => {
    setResult({ aura: null, isRevealed: false });
    playSound('generate');
    
    setTimeout(() => {
      const newAura = getRandomAura();
      setResult({ aura: newAura, isRevealed: true });
      
      // Trigger confetti for rare auras
      if (newAura.chance <= 5) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        playSound('rare');
      } else {
        playSound('reveal');
      }
      
      const auraHistory: AuraHistory = {
        aura: newAura,
        timestamp: Date.now()
      };
      
      saveAuraToHistory(auraHistory);
      setHistory(getAuraHistory());
    }, 500);
  };

  const handleClearHistory = () => {
    clearAuraHistory();
    setHistory([]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    } flex flex-col items-center justify-center p-4 relative`}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-opacity-20 backdrop-blur-sm
                 hover:bg-opacity-30 transition-all"
        style={{ background: isDarkMode ? '#ffffff20' : '#00000020' }}
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <h1 className={`text-4xl md:text-5xl font-bold mb-8 flex items-center gap-2
                    ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
        Генератор Ауры
      </h1>
      <div className="w-full max-w-md px-4 sm:px-0">
        <div className="flex gap-4 mb-8">
          <button
            onClick={generateAura}
            className="flex-1 py-4 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                     text-white font-semibold text-base sm:text-lg transition-all transform hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Раскрыть свою ауру
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="p-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white
                     transition-all transform hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <History className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-8 relative">
          {result.isRevealed && result.aura && (
            <div className="relative">
              <div
                className="p-6 rounded-lg shadow-xl transition-all duration-500 animate-fade-in
                         backdrop-blur-sm bg-opacity-90 transform hover:scale-105"
                style={{
                  backgroundColor: result.aura.color,
                  color: ['#ECF0F1', '#FFD700'].includes(result.aura.color) ? '#2C3E50' : 'white'
                }}
              >
                <div className="absolute -top-2 -right-2">
                  {getRarityBadge(result.aura.chance)}
                </div>
                
                <h2 className="text-2xl font-bold mb-2 filter drop-shadow-md">
                  {result.aura.name}
                </h2>
                <p className="text-lg opacity-90 filter drop-shadow-sm">
                  {result.aura.description}
                </p>
                <div className="mt-4 text-sm opacity-75 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded ${getRarityColor(result.aura.chance)}`}>
                    Шанс: {result.aura.chance}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                История аур
              </h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Очистить историю"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  История пуста
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {history.map((item, index) => (
                    <div key={index} className="p-4 flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.aura.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold">{item.aura.name}</h3>
                        <p className="text-sm text-gray-400 truncate">
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.aura.chance}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;