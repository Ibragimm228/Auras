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
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const generateAura = async () => {
    setIsGenerating(true);
    setResult({ aura: null, isRevealed: false });
    playSound('generate');
    
   
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAura = getRandomAura();
    setResult({ aura: newAura, isRevealed: true });
    setIsGenerating(false);
    
    if (newAura.chance <= 5) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#818CF8', '#C084FC', '#F472B6']
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
    <div className={`min-h-screen transition-colors duration-700 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 
                   'bg-gradient-to-br from-gray-100 via-white to-gray-100'
    } flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 animate-pulse-slow"></div>
      
    
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-3 rounded-full glass-effect
                   hover:scale-110 active:scale-95 transition-all duration-300
                   hover:shadow-glow"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-300 animate-glow" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600 animate-glow" />
        )}
      </button>

      
      <h1 className="text-5xl md:text-6xl font-bold mb-12 flex items-center gap-3
                    tracking-tight relative animate-float">
        <Sparkles className="w-10 h-10 md:w-12 md:h-12 animate-pulse text-indigo-500" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r 
                       from-indigo-500 via-purple-500 to-pink-500
                       hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
                       transition-all duration-500">
          Генератор Ауры
        </span>
      </h1>

      <div className="w-full max-w-md px-4 sm:px-0 relative z-10">
        <div className="flex gap-4 mb-8">
          <button
            onClick={generateAura}
            disabled={isGenerating}
            className={`flex-1 py-4 px-6 rounded-xl 
                     ${isGenerating ? 'animate-pulse opacity-75' : 'hover:scale-105'}
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     hover:from-indigo-500 hover:to-purple-500
                     text-white font-semibold text-lg transition-all
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                     shadow-lg hover:shadow-xl active:scale-98
                     disabled:cursor-not-allowed`}
          >
            {isGenerating ? 'Генерация...' : 'Раскрыть свою ауру'}
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="p-4 rounded-xl glass-button text-white"
            aria-label="Show history"
          >
            <History className="w-6 h-6" />
          </button>
        </div>

        
        <div className="mt-8 relative">
          {isGenerating && (
            <div className="p-6 rounded-lg glass-effect shimmer animate-pulse">
              <div className="h-8 w-3/4 bg-white/20 rounded mb-4"></div>
              <div className="h-20 w-full bg-white/20 rounded"></div>
            </div>
          )}
          
          {result.isRevealed && result.aura && (
            <div className="aura-card">
              <div
                className="p-6 rounded-lg shadow-xl transition-all duration-500
                         backdrop-blur-lg bg-opacity-90 relative
                         hover:shadow-glow-lg"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-lg max-h-[80vh] 
                        overflow-hidden flex flex-col backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up">
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