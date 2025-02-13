import { AuraHistory } from '../types';

const HISTORY_KEY = 'aura_history';

export function saveAuraToHistory(auraHistory: AuraHistory): void {
  const history = getAuraHistory();
  history.unshift(auraHistory);
  
  
  const limitedHistory = history.slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
}

export function getAuraHistory(): AuraHistory[] {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function clearAuraHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}