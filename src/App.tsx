import React, { useState, useEffect } from 'react';
import { Sparkles, History, X, Trash2, Gift, Award, BookOpen, Star, Repeat, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuraResult, AuraHistory, Achievement, Collection, DailyReward, Aura } from './types';
import { getRandomAura, generateMultipleAuras as generateMultiple, getAuraByName, getUncollectedAuraByRarity } from './utils/getRandomAura';
import { 
  saveAuraToHistory, 
  getAuraHistory, 
  clearAuraHistory, 
  getCollection, 
  addAuraToCollection,
  getAchievements,
  getUserStats,
  incrementTotalAuras,
  getDailyRewards,
  claimDailyReward,
  resetAllProgress,
  removeAurasFromCollection,
  getUnlockedGenerationOptions,
  saveUnlockedGenerationOptions
} from './utils/localStorage';
import { playSound } from './utils/sound';
import { getRarityBadge, getRarityColor } from './utils/rarity';

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique' | 'mythical';

interface RecipeInput {
  [key: string]: number | undefined;
}

function App() {
  const [result, setResult] = useState<AuraResult>({
    aura: null,
    isRevealed: false
  });
  const [multipleResults, setMultipleResults] = useState<Array<{aura: Aura, isRevealed: boolean}>>([]);
  const [currentAuraIndex, setCurrentAuraIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showCrafting, setShowCrafting] = useState(false);
  const [history, setHistory] = useState<AuraHistory[]>(getAuraHistory());
  const [collection, setCollection] = useState<Collection>(getCollection());
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements());
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>(getDailyRewards());
  const [isGenerating, setIsGenerating] = useState(false);
  const [multipleGenerationCount, setMultipleGenerationCount] = useState(1);
  const [luckyBoost, setLuckyBoost] = useState(0);
  const [stats, setStats] = useState(getUserStats());
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState<Achievement | null>(null);
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [sequenceTotal, setSequenceTotal] = useState(0);
  const [unlockedGenerationOptions, setUnlockedGenerationOptions] = useState<{
    double: boolean;
    triple: boolean;
    quad: boolean;
    quint: boolean;
  }>({
    double: false,
    triple: false,
    quad: false,
    quint: false
  });
  const [selectedAurasForCrafting, setSelectedAurasForCrafting] = useState<Array<{ aura: Aura; count: number }>>([]);
  const [unlockedFromDailyRewards, setUnlockedFromDailyRewards] = useState({
    double: false,
    triple: false,
    quad: false,
    quint: false,
  });

  useEffect(() => {
    setUnlockedFromDailyRewards(getUnlockedGenerationOptions());
  }, []);

  const craftingRecipes = [
    { input: { common: 3 } as RecipeInput, outputRarity: 'uncommon' as Rarity, description: '3 Обычные ауры → 1 Случайная Необычная' },
    { input: { common: 5 } as RecipeInput, outputRarity: 'rare' as Rarity, description: '5 Обычных аур → 1 Случайная Редкая' },
    { input: { uncommon: 3 } as RecipeInput, outputRarity: 'rare' as Rarity, description: '3 Необычные ауры → 1 Случайная Редкая' },
    { input: { uncommon: 5 } as RecipeInput, outputRarity: 'epic' as Rarity, description: '5 Необычных аур → 1 Случайная Эпическая' },
    { input: { rare: 3 } as RecipeInput, outputRarity: 'epic' as Rarity, description: '3 Редкие ауры → 1 Случайная Эпическая' },
    { input: { rare: 5 } as RecipeInput, outputRarity: 'legendary' as Rarity, description: '5 Редких аур → 1 Случайная Легендарная' },
    { input: { epic: 2 } as RecipeInput, outputRarity: 'legendary' as Rarity, description: '2 Эпические ауры → 1 Случайная Легендарная' },
    { input: { epic: 3 } as RecipeInput, outputRarity: 'unique' as Rarity, description: '3 Эпические ауры → 1 Случайная Уникальная' },
    { input: { legendary: 2 } as RecipeInput, outputRarity: 'unique' as Rarity, description: '2 Легендарные ауры → 1 Случайная Уникальная' },
    { input: { legendary: 3 } as RecipeInput, outputRarity: 'mythical' as Rarity, description: '3 Легендарные ауры → 1 Случайная Мифическая' },

   
    { input: { uncommon: 7 } as RecipeInput, outputType: 'uncollected', outputRarity: 'rare' as Rarity, description: '7 Необычных аур → 1 Несобранная Редкая' },
    { input: { rare: 5 } as RecipeInput, outputType: 'uncollected', outputRarity: 'epic' as Rarity, description: '5 Редких аур → 1 Несобранная Эпическая' },
    { input: { epic: 4 } as RecipeInput, outputType: 'uncollected', outputRarity: 'legendary' as Rarity, description: '4 Эпические ауры → 1 Несобранная Легендарная' },

   
    { input: { "Аура Огня": 1, "Аура Земли": 1 } as RecipeInput, outputName: "Аура Вулкана", outputRarity: 'epic' as Rarity, description: 'Аура Огня + Аура Земли → Аура Вулкана' },
    { input: { "Аура Воды": 1, "Аура Воздуха": 1 } as RecipeInput, outputName: "Аура Тумана", outputRarity: 'uncommon' as Rarity, description: 'Аура Воды + Аура Воздуха → Аура Тумана' },
    { input: { "Аура Света": 1, "Аура Тьмы": 1 } as RecipeInput, outputName: "Аура Равновесия", outputRarity: 'legendary' as Rarity, description: 'Аура Света + Аура Тьмы → Аура Равновесия' },
    { input: { "Аура Леса": 2, common: 3 } as RecipeInput, outputName: "Древесная Аура", outputRarity: 'rare' as Rarity, description: '2 Ауры Леса + 3 Обычные ауры → Древесная Аура' },
  ];

  useEffect(() => {
    const checkDailyRewardAvailability = () => {
      const today = new Date().setHours(0, 0, 0, 0);
      const lastReward = stats.lastDailyReward;
      
      if (lastReward !== today) {
        const dailyRewardBtn = document.getElementById('daily-reward-btn');
        if (dailyRewardBtn) {
          dailyRewardBtn.classList.remove('animate-bounce');
        }
      }
    };
    
    checkDailyRewardAvailability();
    if (luckyBoost > 0) {
      const boostTimeout = setTimeout(() => {
        setLuckyBoost(0);
      }, 24 * 60 * 60 * 1000); 
      
      return () => clearTimeout(boostTimeout);
    }
  }, [stats.lastDailyReward, luckyBoost]);


  useEffect(() => {
    const checkForNewAchievements = () => {
      const latestAchievements = getAchievements();
      
   
      const newlyCompletedAchievement = latestAchievements.find(
        achievement => achievement.completed && 
        !achievements.find(a => a.id === achievement.id)?.completed
      );
      
      if (newlyCompletedAchievement) {
        setNewAchievementUnlocked(newlyCompletedAchievement);
        

        setTimeout(() => setNewAchievementUnlocked(null), 5000);
      }
      
   
      setAchievements(latestAchievements);
    };
    
    checkForNewAchievements();
    

    const achievementCheckInterval = setInterval(checkForNewAchievements, 2000);
    
    return () => clearInterval(achievementCheckInterval);
  }, [collection.completionPercentage, stats.rareAurasFound, stats.streak, achievements]);

  useEffect(() => {
    const updateUnlockedOptions = () => {
      const cyclesCompleted = stats.monthlyCyclesCompleted || 0;
      
      setUnlockedGenerationOptions({
        double: unlockedFromDailyRewards.double || cyclesCompleted >= 1,
        triple: unlockedFromDailyRewards.triple || cyclesCompleted >= 1,
        quad: unlockedFromDailyRewards.quad || cyclesCompleted >= 2,
        quint: unlockedFromDailyRewards.quint || cyclesCompleted >= 3
      });
    };
    
    updateUnlockedOptions();
  }, [stats, unlockedFromDailyRewards]);

  const generateAura = async (options = {}) => {
    setIsGenerating(true);
    setResult({ aura: null, isRevealed: false });
    setMultipleResults([]);
    playSound('generate');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAura = getRandomAura({ luckyBoost, ...options });
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
    addAuraToCollection(newAura);
    incrementTotalAuras();
    

    setHistory(getAuraHistory());
    setCollection(getCollection());
    setStats(() => {
      const newStats = getUserStats();
      newStats.totalAuras++;
      if (newAura.chance <= 5) {
        newStats.rareAurasFound++;
      }
      return newStats;
    });
    

    setAchievements(getAchievements());
  };

  const handleGenerateMultipleAuras = async (count: number) => {
    if ((count === 2 && !unlockedGenerationOptions.double) || 
        (count === 3 && !unlockedGenerationOptions.triple) ||
        (count === 4 && !unlockedGenerationOptions.quad) ||
        (count === 5 && !unlockedGenerationOptions.quint)) {
      alert("Эта функция еще не разблокирована. Получите её, завершая месячные циклы ежедневных наград!");
      return;
    }
    

    setIsGenerating(true);
    setIsGeneratingSequence(true);
    setSequenceProgress(0);
    setSequenceTotal(count);
    setResult({ aura: null, isRevealed: false });
    setMultipleResults([]);
    setCurrentAuraIndex(0);
    playSound('generate');
    

    const newAuras = generateMultiple(count, { luckyBoost });
    let hasRareAura = false;
    const generatedResults = [];
    

    for (let i = 0; i < newAuras.length; i++) {
      const aura = newAuras[i];
      
    
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (aura.chance <= 5) hasRareAura = true;
      
 
      const auraHistory: AuraHistory = {
        aura,
        timestamp: Date.now()
      };
      
      saveAuraToHistory(auraHistory);
      addAuraToCollection(aura);
      incrementTotalAuras();
      generatedResults.push({ aura, isRevealed: true });
      setMultipleResults([...generatedResults]);
      setSequenceProgress(i + 1);
      if (aura.chance <= 5) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#818CF8', '#C084FC', '#F472B6']
        });
        playSound('rare');
      } else {
        playSound('reveal');
      }
    }
    

    if (hasRareAura) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#818CF8', '#C084FC', '#F472B6']
      });
    }
    

    setHistory(getAuraHistory());
    setCollection(getCollection());
    setStats(() => {
      const newStats = getUserStats();
      newStats.totalAuras += count;
      if (hasRareAura) {
        newStats.rareAurasFound += count;
      }
      return newStats;
    });
    setAchievements(getAchievements());
    
  
    setIsGenerating(false);
    setIsGeneratingSequence(false);
  };

  const navigateAuras = (direction: 'next' | 'prev') => {
    if (multipleResults.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentAuraIndex((prev) => (prev + 1) % multipleResults.length);
    } else {
      setCurrentAuraIndex((prev) => (prev - 1 + multipleResults.length) % multipleResults.length);
    }
  };

  const handleDailyRewardClaim = (day: number) => {
    const success = claimDailyReward(day);
    
    if (success) {
      const reward = dailyRewards.find(r => r.day === day);
      
      if (reward) {
        setStats(() => {
          const newStats = getUserStats();
          let updatedUnlockedOptions = { ...unlockedFromDailyRewards };
          
          switch (day) {
            case 1:
              setLuckyBoost(10);
              break;
            case 2:
              updatedUnlockedOptions = { ...updatedUnlockedOptions, double: true };
              setMultipleGenerationCount(2);
              break;
            case 3:
              setLuckyBoost(20);
              break;
            case 5:
              updatedUnlockedOptions = { ...updatedUnlockedOptions, triple: true };
              setMultipleGenerationCount(3);
              break;
            case 7:
              generateAura({ guaranteedRarity: 'epic' });
              break;
            case 8:
              setLuckyBoost(15);
              break;
            case 11:
              setLuckyBoost(25);
              break;
            case 12:
              handleGenerateMultipleAuras(5);
              break;
            case 14:
              generateAura({ guaranteedRarity: 'legendary' });
              break;
            case 16:
              setLuckyBoost(30);
              break;
            case 17:
              handleGenerateMultipleAuras(3);
              break;
            case 20:
              alert("Доступ к специальным аурам активирован!");
              break;
            case 21:
              generateAura({ guaranteedRarity: 'unique' });
              break;
            case 23:
              setLuckyBoost(40);
              break;
            case 24:
              alert("Вы получили 10 генераций ауры! Теперь можете использовать их в любое время.");
              break;
            case 26:
              setLuckyBoost(50);
              break;
            case 28:
              alert("Вы получили 7 гарантированных редких аур! Используйте их в любое время.");
              break;
            case 30:
              handleGenerateMultipleAuras(5);
              break;
            case 31:
              generateAura({ guaranteedRarity: 'mythical', chance: 0.1 });
              break;
            default:
              alert(`Награда за день ${day} получена!`);
              break;
          }
          
          saveUnlockedGenerationOptions(updatedUnlockedOptions);
          setUnlockedFromDailyRewards(updatedUnlockedOptions);
          
          return newStats;
        });
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF8C00']
        });
        
        playSound('reveal');
        setDailyRewards(getDailyRewards());
      }
    }
  };

  const handleClearHistory = () => {
    clearAuraHistory();
    setHistory([]);
  };

  const handleResetProgress = () => {
    resetAllProgress();
    setHistory([]);
    setCollection(getCollection());
    setAchievements(getAchievements());
    setDailyRewards(getDailyRewards());
    setStats(getUserStats());
    setResult({ aura: null, isRevealed: false });
    setShowResetConfirm(false);
    alert('Прогресс полностью сброшен. Игра начнется заново.');
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

  const handleAuraSelectForCrafting = (aura: Aura) => {
    const existing = selectedAurasForCrafting.find(item => item.aura.name === aura.name);
    const collectedItem = collection.auras.find(item => item.aura.name === aura.name);
    const collectedCount = collectedItem ? collectedItem.count : 0;

    if (collectedCount === 0) {
      alert("У вас нет этой ауры в коллекции.");
      return;
    }

    if (existing) {
      if (existing.count < collectedCount) {
        setSelectedAurasForCrafting(prev => prev.map(item =>
          item.aura.name === aura.name ? { ...item, count: item.count + 1 } : item
        ));
      } else {
        alert(`У вас всего ${collectedCount} ${aura.name}. Выбрано максимальное количество.`);
      }
    } else {
      if (1 <= collectedCount) {
        setSelectedAurasForCrafting(prev => [...prev, { aura, count: 1 }]);
      } else {
        alert("Недостаточно аур в коллекции.");
      }
    }
  };

  const handleRemoveAuraFromCrafting = (aura: Aura) => {
    setSelectedAurasForCrafting(prev => prev.filter(item => item.aura.name !== aura.name));
  };

  const handleCraftAuras = () => {
    const selectedAuras = selectedAurasForCrafting.reduce((acc, item) => {
      acc[item.aura.name] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const selectedAurasArray = selectedAurasForCrafting.flatMap(item => Array(item.count).fill(item.aura));

    const matchesRecipe = (recipeInput: RecipeInput) => {
      const countsByRarity = selectedAurasArray.reduce((acc, aura) => {
        const rarity = getAuraRarity(aura.chance);
        acc[rarity] = (acc[rarity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      for (const requiredKey in recipeInput) {
        const requiredCount = recipeInput[requiredKey] || 0;
        let userCount = 0;
 
        if (requiredKey === 'common' || requiredKey === 'uncommon' || requiredKey === 'rare' || requiredKey === 'epic' || requiredKey === 'legendary' || requiredKey === 'unique' || requiredKey === 'mythical') {
           userCount = countsByRarity[requiredKey] || 0;
        } else { 
           userCount = selectedAuras[requiredKey] || 0; 
        }
 
        if (userCount < requiredCount) return false;
      }

      return true;
    };
    const getAuraRarity = (chance: number): Rarity => {
       if (chance <= 0.1) return 'mythical';
       if (chance <= 0.5) return 'unique';
       if (chance <= 1) return 'legendary';
       if (chance <= 5) return 'epic';
       if (chance <= 10) return 'rare';
       if (chance <= 20) return 'uncommon';
       return 'common';
    };


    let resultAura: Aura | null = null;
    let craftedSuccessfully = false;

    for (const recipe of craftingRecipes) {
      if (matchesRecipe(recipe.input)) {
        removeAurasFromCollection(selectedAurasForCrafting);

        if (recipe.outputType === 'uncollected') {
          const uncollectedAura = getUncollectedAuraByRarity(recipe.outputRarity);
          if (uncollectedAura) {
            resultAura = uncollectedAura;
          } else {
            console.warn(`No uncollected auras of rarity "${recipe.outputRarity}" found. Generating random aura of this rarity.`);
            resultAura = getRandomAura({ guaranteedRarity: recipe.outputRarity, luckyBoost: luckyBoost });
          }
        } else {
          if (recipe.outputName) {
            const specificAura = getAuraByName(recipe.outputName);
            if (specificAura) {
              resultAura = specificAura;
            } else {
               console.warn(`Specific aura "${recipe.outputName}" not found. Generating random aura of rarity ${recipe.outputRarity}`);
               resultAura = getRandomAura({ guaranteedRarity: recipe.outputRarity, luckyBoost: luckyBoost });
            }
          } else {
             resultAura = getRandomAura({ guaranteedRarity: recipe.outputRarity, luckyBoost: luckyBoost });
          }
        }

        craftedSuccessfully = true;
        break;
      }
    }

    if (!craftedSuccessfully) {
      alert("Выбранная комбинация аур не соответствует ни одному рецепту крафта.");
    } else if (resultAura) {
      const craftedAura: Aura = resultAura;

      addAuraToCollection(craftedAura);
      saveAuraToHistory({ aura: craftedAura, timestamp: Date.now() });
      setCollection(getCollection());
      setHistory(getAuraHistory());
      setStats(getUserStats());
      setAchievements(getAchievements());
      setResult({ aura: craftedAura, isRevealed: true });
      setMultipleResults([]);
      setCurrentAuraIndex(0);
      setSelectedAurasForCrafting([]);
      if (craftedAura.chance <= 5) {
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
      alert(`Успешный крафт! Вы получили: ${craftedAura.name}`);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    } flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 animate-pulse-slow"></div>
      <button
        onClick={() => setShowResetConfirm(true)}
        className="absolute top-4 left-4 p-3 rounded-full glass-effect
                   text-red-400 hover:text-red-300 transition-colors
                   hover:scale-110 active:scale-95"
        aria-label="Reset progress"
        title="Сбросить прогресс"
      >
        <RefreshCw className="w-6 h-6" />
      </button>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center gap-3
                    tracking-tight relative animate-float">
        <Sparkles className="w-10 h-10 md:w-12 md:h-12 animate-pulse text-indigo-500" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r 
                       from-indigo-500 via-purple-500 to-pink-500
                       hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
                       transition-all duration-500">
          Генератор Ауры
        </span>
      </h1>
      <div className="text-gray-400 mb-8 flex gap-4 items-center justify-center text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{stats.totalAuras} аур найдено</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{stats.rareAurasFound} редких</span>
        </div>
        <div className="flex items-center gap-1">
          <Repeat className="w-4 h-4 text-green-400" />
          <span>Коллекция {collection.completionPercentage}%</span>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <button
          id="daily-reward-btn"
          onClick={() => setShowDailyRewards(true)}
          className="p-3 rounded-full glass-button text-yellow-400 hover:text-yellow-300 relative"
          aria-label="Daily rewards"
        >
          <Gift className="w-6 h-6" />
          {stats.lastDailyReward !== new Date().setHours(0, 0, 0, 0) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </button>
        
        <button
          onClick={() => setShowCollection(true)}
          className="p-3 rounded-full glass-button text-emerald-400 hover:text-emerald-300"
          aria-label="Collection"
        >
          <BookOpen className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setShowAchievements(true)}
          className="p-3 rounded-full glass-button text-amber-400 hover:text-amber-300"
          aria-label="Achievements"
        >
          <Award className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setShowHistory(true)}
          className="p-3 rounded-full glass-button text-blue-400 hover:text-blue-300"
          aria-label="History"
        >
          <History className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowRecipes(true)}
          className="p-3 rounded-full glass-button text-cyan-400 hover:text-cyan-300"
          aria-label="Crafting Recipes"
          title="Рецепты крафта"
        >
          <BookOpen className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowCrafting(true)}
          className="p-3 rounded-full glass-button text-purple-400 hover:text-purple-300"
          aria-label="Crafting"
          title="Крафт аур"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-md px-4 sm:px-0 relative z-10">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => multipleGenerationCount > 1 ? 
              handleGenerateMultipleAuras(multipleGenerationCount) : 
              generateAura()}
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
            {isGenerating ? (
              isGeneratingSequence ? 
              `Генерация ${sequenceProgress}/${sequenceTotal}...` : 
              'Генерация...'
            ) : (
              multipleGenerationCount > 1 ? 
              `Раскрыть ${multipleGenerationCount} ауры` : 
              'Раскрыть свою ауру'
            )}
          </button>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setMultipleGenerationCount(1)}
            className={`px-3 py-1.5 rounded-full transition-all ${
              multipleGenerationCount === 1 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            x1
          </button>
          <button
            onClick={() => unlockedGenerationOptions.double ? setMultipleGenerationCount(2) : setMultipleGenerationCount(1)}
            disabled={!unlockedGenerationOptions.double}
            className={`px-3 py-1.5 rounded-full transition-all ${
              multipleGenerationCount === 2 && unlockedGenerationOptions.double
              ? 'bg-purple-600 text-white' 
              : unlockedGenerationOptions.double 
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
            title={unlockedGenerationOptions.double ? "Двойная генерация" : "Разблокируется после завершения 1-го месячного цикла ежедневных наград"}
          >
            {unlockedGenerationOptions.double ? 'x2' : <span><i className="lock">🔒</i> x2</span>}
          </button>
          <button
            onClick={() => unlockedGenerationOptions.triple ? setMultipleGenerationCount(3) : setMultipleGenerationCount(1)}
            disabled={!unlockedGenerationOptions.triple}
            className={`px-3 py-1.5 rounded-full transition-all ${
              multipleGenerationCount === 3 && unlockedGenerationOptions.triple
              ? 'bg-pink-600 text-white' 
              : unlockedGenerationOptions.triple 
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
            title={unlockedGenerationOptions.triple ? "Тройная генерация" : "Разблокируется после завершения 1-го месячного цикла ежедневных наград"}
          >
            {unlockedGenerationOptions.triple ? 'x3' : <span><i className="lock">🔒</i> x3</span>}
          </button>
          <button
            onClick={() => unlockedGenerationOptions.quad ? setMultipleGenerationCount(4) : setMultipleGenerationCount(1)}
            disabled={!unlockedGenerationOptions.quad}
            className={`px-3 py-1.5 rounded-full transition-all ${
              multipleGenerationCount === 4 && unlockedGenerationOptions.quad
              ? 'bg-green-600 text-white'
              : unlockedGenerationOptions.quad 
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
            title={unlockedGenerationOptions.quad ? "Четверная генерация" : "Разблокируется после завершения 2-х месячных циклов ежедневных наград"}
          >
            {unlockedGenerationOptions.quad ? 'x4' : <span><i className="lock">🔒</i> x4</span>}
          </button>
          <button
            onClick={() => unlockedGenerationOptions.quint ? setMultipleGenerationCount(5) : setMultipleGenerationCount(1)}
            disabled={!unlockedGenerationOptions.quint}
            className={`px-3 py-1.5 rounded-full transition-all ${
              multipleGenerationCount === 5 && unlockedGenerationOptions.quint
              ? 'bg-red-600 text-white'
              : unlockedGenerationOptions.quint 
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
            title={unlockedGenerationOptions.quint ? "Пятерная генерация" : "Разблокируется после завершения 3-х месячных циклов ежедневных наград"}
          >
            {unlockedGenerationOptions.quint ? 'x5' : <span><i className="lock">🔒</i> x5</span>}
          </button>
        </div>
        {luckyBoost > 0 && (
          <div className="mb-4 text-center">
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
              <Star className="w-4 h-4 inline mr-1" />
              Бустер удачи активен +{luckyBoost}%
            </span>
          </div>
        )}
        <div className="mt-8 relative">
          {isGenerating && !isGeneratingSequence && (
            <div className="p-6 rounded-lg glass-effect shimmer animate-pulse">
              <div className="h-8 w-3/4 bg-white/20 rounded mb-4"></div>
              <div className="h-20 w-full bg-white/20 rounded"></div>
            </div>
          )}
          
          {isGeneratingSequence && (
            <div className="relative">
              <div className="p-6 rounded-lg glass-effect shimmer animate-pulse">
                <div className="h-8 w-3/4 bg-white/20 rounded mb-4"></div>
                <div className="h-20 w-full bg-white/20 rounded"></div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <div className="bg-white/20 rounded-full px-3 py-1 text-sm text-white backdrop-blur-md">
                  {sequenceProgress}/{sequenceTotal}
                </div>
              </div>
            </div>
          )}
          
          {result.isRevealed && result.aura && multipleResults.length === 0 && (
            <div className="aura-card">
              <div
                className="p-6 rounded-lg shadow-xl transition-all duration-500
                         backdrop-blur-lg bg-opacity-90 relative"
                style={{
                  backgroundColor: result.aura.color,
                  color: ['#ECF0F1', '#FFD700'].includes(result.aura.color) ? '#2C3E50' : 'white'
                }}
              >
                <div className="absolute -top-2 -right-2">
                  {getRarityBadge(result.aura.chance)}
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {result.aura.name}
                </h2>
                <p className="text-lg opacity-90">
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
          
          {multipleResults.length > 0 && (
            <div className="aura-card">
              <div
                className="p-6 rounded-lg shadow-xl transition-all duration-500
                         backdrop-blur-lg bg-opacity-90 relative"
                style={{
                  backgroundColor: multipleResults[currentAuraIndex].aura.color,
                  color: ['#ECF0F1', '#FFD700'].includes(multipleResults[currentAuraIndex].aura.color) ? '#2C3E50' : 'white'
                }}
              >
                {multipleResults.length > 1 && (
                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
                    <button
                      onClick={() => navigateAuras('prev')}
                      className="bg-white/20 backdrop-blur-md p-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>
                )}
                
                {multipleResults.length > 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <button
                      onClick={() => navigateAuras('next')}
                      className="bg-white/20 backdrop-blur-md p-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
                
                <div className="absolute -top-2 -right-2">
                  {getRarityBadge(multipleResults[currentAuraIndex].aura.chance)}
                </div>
                
                {multipleResults.length > 1 && (
                  <div className="absolute -top-2 -left-2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full">
                    {currentAuraIndex + 1} / {multipleResults.length}
                  </div>
                )}
                
                <h2 className="text-2xl font-bold mb-2">
                  {multipleResults[currentAuraIndex].aura.name}
                </h2>
                <p className="text-lg opacity-90">
                  {multipleResults[currentAuraIndex].aura.description}
                </p>
                <div className="mt-4 text-sm opacity-75 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded ${getRarityColor(multipleResults[currentAuraIndex].aura.chance)}`}>
                    Шанс: {multipleResults[currentAuraIndex].aura.chance}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {newAchievementUnlocked && (
        <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-yellow-900
                      max-w-xs animate-slide-up shadow-lg z-50">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-100" />
            <div>
              <h4 className="font-bold text-yellow-100">{newAchievementUnlocked.name}</h4>
              <p className="text-sm text-yellow-100 opacity-90">{newAchievementUnlocked.description}</p>
              <p className="text-xs mt-1 text-yellow-100 font-semibold">Награда: {newAchievementUnlocked.reward}</p>
            </div>
          </div>
        </div>
      )}
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
      {showCollection && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-lg max-h-[80vh] 
                        overflow-hidden flex flex-col backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Коллекция аур ({collection.completionPercentage}%)
              </h2>
              <button
                onClick={() => setShowCollection(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {collection.auras.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  Коллекция пуста
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-4">
                  {collection.auras
                    .sort((a, b) => a.aura.chance - b.aura.chance)
                    .map((item, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg relative overflow-hidden shadow-md"
                      style={{ 
                        backgroundColor: item.aura.color,
                        color: ['#ECF0F1', '#FFD700'].includes(item.aura.color) ? '#2C3E50' : 'white' 
                      }}
                    >
                      <div className="absolute top-1 right-1 text-xs font-bold opacity-80">
                        x{item.count}
                      </div>
                      <h3 className="font-semibold text-sm">{item.aura.name}</h3>
                      <div className="mt-1 text-xs opacity-80 flex items-center">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getRarityColor(item.aura.chance)}`}>
                          {item.aura.chance}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-lg max-h-[80vh] 
                        overflow-hidden flex flex-col backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Достижения
              </h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-700/50">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-5 hover:bg-gray-700/20 transition-colors ${achievement.completed ? 'bg-gradient-to-r from-green-900/10 to-green-900/30' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          {achievement.name}
                          {achievement.completed && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              Выполнено
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">{achievement.description}</p>
                      </div>
                      <div className="min-w-[3rem] h-12 flex items-center justify-center">
                        {achievement.completed ? (
                          <span className="rounded-full p-2 bg-green-500/20 text-green-400">
                            <Award className="w-6 h-6" />
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-gray-400">
                            {Math.round((achievement.progress / achievement.target) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-700 ${
                            achievement.completed 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                          }`}
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span className="font-semibold">{achievement.progress} / {achievement.target}</span>
                        <span className="font-medium bg-gray-700/40 px-2 py-0.5 rounded text-yellow-400 flex items-center gap-1">
                          <Gift className="w-3 h-3" /> {achievement.reward}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showDailyRewards && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-6xl max-h-[85vh] 
                        overflow-hidden flex flex-col backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                Ежедневные награды (31 день)
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-sm">
                  Серия: {stats.streak} {stats.streak === 1 ? 'день' : stats.streak > 1 && stats.streak < 5 ? 'дня' : 'дней'}
                </span>
                <button
                  onClick={() => setShowDailyRewards(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="mb-4 flex justify-between items-center px-2">
                <h3 className="text-lg font-semibold text-yellow-500">Календарь награждений (31 день)</h3>
                <span className="text-sm text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                  Получайте награду каждый день для увеличения серии
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3 auto-rows-min">
                {dailyRewards.map((reward, index) => {
                  const canClaim = index === 0 || dailyRewards[index - 1].claimed;
                  const today = new Date().setHours(0, 0, 0, 0);
                  const alreadyClaimed = stats.lastDailyReward === today && reward.claimed;
                  const isUpcoming = !reward.claimed && !canClaim;
                  const weekNum = Math.floor((index) / 7) + 1;
                  const isFirstInWeek = index % 7 === 0;
                  
                  return (
                    <React.Fragment key={index}>
                      {isFirstInWeek && index > 0 && (
                        <div className="col-span-full h-px bg-gray-700/30 my-2"></div>
                      )}
                      
                      <div 
                        className={`p-4 rounded-lg border flex flex-col items-center justify-between
                                 min-h-[140px] text-center
                                 ${reward.claimed 
                                   ? 'bg-yellow-900/30 border-yellow-700' 
                                   : isUpcoming
                                     ? 'border-gray-700/50 bg-gray-800/30 opacity-60'
                                     : canClaim && !alreadyClaimed 
                                       ? 'hover:border-yellow-500 cursor-pointer hover:bg-yellow-900/10 border-gray-700'
                                       : 'border-gray-700 cursor-default'}
                                 transition-colors duration-300`}
                        onClick={() => canClaim && !alreadyClaimed && !reward.claimed && handleDailyRewardClaim(reward.day)}
                      >
                        <div className="text-lg font-bold text-yellow-500 mb-2">
                          День {reward.day}
                          {isFirstInWeek && <span className="ml-1 text-xs text-yellow-400/60">Неделя {weekNum}</span>}
                        </div>
                        <div className="text-sm text-gray-300 flex-1 flex items-center justify-center">
                          {reward.reward}
                        </div>
                        {reward.claimed ? (
                          <div className="mt-2 text-xs bg-yellow-700 text-yellow-200 px-3 py-1 rounded-full">
                            Получено
                          </div>
                        ) : (
                          <div className={`mt-2 text-xs px-3 py-1 rounded-full ${
                            canClaim && !alreadyClaimed 
                              ? 'bg-yellow-600/30 text-yellow-300 animate-pulse' 
                              : isUpcoming
                                ? 'bg-gray-700/30 text-gray-500'
                                : 'bg-gray-700/50 text-gray-400'
                          }`}>
                            {canClaim && !alreadyClaimed 
                              ? 'Доступно' 
                              : isUpcoming
                                ? 'Скоро'
                                : 'Недоступно'}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              
              <div className="mt-6 text-gray-400 text-sm border-t border-gray-700/30 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-500">Ежедневные награды</span>
                </div>
                Посещайте игру каждый день, чтобы получать награды. При серии в 31 день награды обновятся и станут доступны снова.
              </div>
            </div>
          </div>
        </div>
      )}
      {showRecipes && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-lg max-h-[80vh] 
                        overflow-hidden flex flex-col backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Рецепты Крафта
              </h2>
              <button
                onClick={() => setShowRecipes(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {craftingRecipes.length === 0 ? (
                <div className="text-center text-gray-400">Рецепты крафта пока не добавлены.</div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {craftingRecipes.map((recipe, index) => (
                    <div key={index} className="py-4">
                      <p className="text-white font-semibold mb-1">{recipe.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showCrafting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-lg max-h-[80vh] 
                        overflow-hidden flex flex-col backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Крафт аур
              </h2>
              <button
                onClick={() => setShowCrafting(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Выберите ауры из коллекции для крафта:</h3>
              <div className="grid grid-cols-2 gap-3">
                {collection.auras.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-400">Ваша коллекция пуста</div>
                ) : (
                  collection.auras
                    .sort((a, b) => a.aura.chance - b.aura.chance)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg relative overflow-hidden shadow-md
                                     ${selectedAurasForCrafting.some(s => s.aura.name === item.aura.name) ? 'border-2 border-purple-500' : 'border border-transparent'}
                                     ${item.count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] transition-transform'}`}
                        style={{
                          backgroundColor: item.aura.color,
                          color: ['#ECF0F1', '#FFD700'].includes(item.aura.color) ? '#2C3E50' : 'white'
                        }}
                        onClick={() => item.count > 0 && handleAuraSelectForCrafting(item.aura)}
                      >
                        <div className="absolute top-1 right-1 text-xs font-bold opacity-80">
                          x{item.count}
                        </div>
                        <h3 className="font-semibold text-sm">{item.aura.name}</h3>
                        <div className="mt-1 text-xs opacity-80 flex items-center">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${getRarityColor(item.aura.chance)}`}>
                            {item.aura.chance}%
                          </span>
                        </div>
                        {selectedAurasForCrafting.some(s => s.aura.name === item.aura.name) && (
                          <div className="absolute bottom-1 left-1 text-xs font-bold bg-purple-600/80 px-1 py-0.5 rounded text-white">
                            Выбрано: {selectedAurasForCrafting.find(s => s.aura.name === item.aura.name)?.count}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
              {selectedAurasForCrafting.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Выбрано для крафта:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAurasForCrafting.map((item, index) => (
                      <span key={index} className="bg-purple-600/70 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                        {item.aura.name} x{item.count}
                        <button onClick={() => handleRemoveAuraFromCrafting(item.aura)} className="text-purple-200 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handleCraftAuras}
                    disabled={selectedAurasForCrafting.reduce((sum, item) => sum + item.count, 0) < 2}
                    className={`mt-4 w-full py-3 rounded-xl font-semibold text-white
                               ${selectedAurasForCrafting.reduce((sum, item) => sum + item.count, 0) < 2
                                  ? 'bg-gray-600 cursor-not-allowed opacity-75'
                                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all'}
                               `}
                  >
                    Создать ауру ({selectedAurasForCrafting.reduce((sum, item) => sum + item.count, 0)} выбрано)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md 
                      flex items-center justify-center p-4 z-50
                      animate-fade-in">
          <div className="bg-gray-800/90 rounded-2xl w-full max-w-md
                        overflow-hidden backdrop-blur-xl
                        border border-gray-700/50 shadow-2xl
                        animate-slide-up p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-16 h-16" />
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Сбросить весь прогресс?
            </h2>
            
            <p className="text-gray-300 text-center mb-8">
              Это действие удалит всю историю, коллекцию, достижения и ежедневные награды. 
              Восстановить данные будет невозможно.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-700 
                         text-white font-medium hover:bg-gray-600
                         transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleResetProgress}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 
                         text-white font-medium hover:bg-red-700
                         transition-colors"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;