export interface Character {
  name: string;
  class: string;
  description: string;
  imageUrl: string;
  backstory?: string;
  health: number;
  strength: number;
  mana: number;
  agility: number;
}