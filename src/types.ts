/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PENJAGA BUMI NUSANTARA — Game Edukasi 3D PAI Fase C (Kelas V & VI)
 * Pengembang: Bachtiar Imani, S.Pd. - SDN 2 Girimarto, Wonogiri (NPA PGRI: 33122211124)
 */

export type GradeLevel = '5' | '6';
export type AvatarId = 'rayyan' | 'aisyah';

export interface StudentProfile {
  name: string;
  grade: GradeLevel;
  avatar: AvatarId;
  highScore: number;
  totalScore: number;
  xp: number;
  ecoCoins: number;
  currentLevel: number; // 1 to 6
  completedLevels: number[];
  postTestScore?: number;
  projectCompleted?: boolean;
  certificateId?: string;
  lastPlayed: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'organik' | 'anorganik' | 'b3' | 'alat' | 'huruf' | 'solusi';
  description: string;
  iconName: string;
  count: number;
}

export interface InteractiveObjectInfo {
  id: string;
  name: string;
  promptText: string;
  category: string;
  distance: number;
}

export interface LevelObjective {
  id: string;
  text: string;
  required: number;
  current: number;
  completed: boolean;
}

export interface PedagogicalQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  quranReference?: string;
}

export interface PedagogicalSessionData {
  level: number;
  title: string;
  summary: string;
  quranVerse: {
    surah: string;
    verseNumber: string;
    arabic: string;
    translation: string;
  };
  reflectionPrompt: string;
  questions: PedagogicalQuestion[];
  actionRecommendation: string;
}

export interface RadarHotspot {
  id: string;
  locationName: string;
  title: string;
  publisher: string;
  publishDate: string;
  realUrl: string;
  coordinates: { x: number; z: number };
  summary: string;
  environmentalIssue: string;
  solutionAndFact: string;
  historicalVsCurrent: string;
  tabayyunQuestion: string;
  tabayyunOptions: string[];
  correctOptionIndex: number;
  verified: boolean;
}

export interface AccessibilitySettings {
  volume: number; // 0 to 1
  sfxMuted: boolean;
  bgmMuted: boolean;
  subtitles: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'khalifah';
  duration?: number;
}
