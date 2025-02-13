export interface Aura {
  name: string;
  color: string;
  chance: number;
  description: string;
}

export interface AuraResult {
  aura: Aura | null;
  isRevealed: boolean;
}

export interface AuraHistory {
  aura: Aura;
  timestamp: number;
}