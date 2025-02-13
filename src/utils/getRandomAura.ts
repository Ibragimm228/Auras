import { Aura } from '../types';
import { auras } from '../data/auras';

export function getRandomAura(): Aura {
  const totalChance = auras.reduce((sum, aura) => sum + aura.chance, 0);
  const normalizedAuras = auras.map(aura => ({
    ...aura,
    normalizedChance: (aura.chance / totalChance) * 100
  }));
  
  const random = Math.random() * 100;
  let cumulativeChance = 0;
  
  for (const aura of normalizedAuras) {
    cumulativeChance += aura.normalizedChance;
    if (random <= cumulativeChance) {
      return aura;
    }
  }
  
  
  return normalizedAuras[normalizedAuras.length - 1];
}