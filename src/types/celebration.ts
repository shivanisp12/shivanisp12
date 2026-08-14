export type OccasionType =
  | 'birthday'
  | 'proposal'
  | 'wedding'
  | 'anniversary'
  | 'friendship'
  | 'graduation'
  | 'custom';

export type ThemeId =
  | 'dreamy-pink'
  | 'sakura'
  | 'aurora'
  | 'galaxy'
  | 'luxury-gold'
  | 'midnight-romance'
  | 'royal-emerald';

export type ModuleType =
  | 'welcome'
  | 'gift'
  | 'letter'
  | 'memories'
  | 'game'
  | 'proposal'
  | 'invitation'
  | 'finale';

export interface BaseModuleConfig {
  id: string;
  type: ModuleType;
  title: string;
  enabled: boolean;
}

export interface WelcomeModuleConfig extends BaseModuleConfig {
  type: 'welcome';
  recipientName: string;
  headline: string;
  subheadline: string;
  coverImageUrl?: string;
  callToActionText: string;
}

export interface GiftModuleConfig extends BaseModuleConfig {
  type: 'gift';
  giftStyle: 'luxury-box' | 'crystal-box' | 'treasure-chest' | 'music-box';
  boxColor: string;
  ribbonColor: string;
  revealTitle: string;
  revealMessage: string;
  surpriseMediaUrl?: string;
}

export interface LetterModuleConfig extends BaseModuleConfig {
  type: 'letter';
  senderName: string;
  waxSealSymbol: string;
  pages: string[];
  audioVoiceNoteUrl?: string;
}

export interface MemoryItem {
  id: string;
  url: string;
  type: 'photo' | 'video';
  caption: string;
  date?: string;
  location?: string;
}

export interface MemoriesModuleConfig extends BaseModuleConfig {
  type: 'memories';
  layoutStyle: 'polaroid' | 'scrapbook' | 'timeline' | 'grid';
  memories: MemoryItem[];
}

export interface GameModuleConfig extends BaseModuleConfig {
  type: 'game';
  gameType: 'scratch-card' | 'balloon-pop' | 'memory-match';
  targetScore: number;
  hiddenRewardMessage: string;
  hiddenRewardImage?: string;
}

export interface ProposalModuleConfig extends BaseModuleConfig {
  type: 'proposal';
  question: string;
  acceptButtonText: string;
  declineButtonText: string;
  acceptedTitle: string;
  acceptedMessage: string;
  acceptedMediaUrl?: string;
}

export interface InvitationModuleConfig extends BaseModuleConfig {
  type: 'invitation';
  eventTitle: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  dressCode?: string;
  enableRSVP: boolean;
}

export interface FinaleModuleConfig extends BaseModuleConfig {
  type: 'finale';
  effectType: 'fireworks' | 'confetti' | 'lanterns' | 'flower-rain';
  closingMessage: string;
  subMessage: string;
}

export type CelebrationModule =
  | WelcomeModuleConfig
  | GiftModuleConfig
  | LetterModuleConfig
  | MemoriesModuleConfig
  | GameModuleConfig
  | ProposalModuleConfig
  | InvitationModuleConfig
  | FinaleModuleConfig;

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  background: string; // Tailwind background or CSS gradient
  cardBackground: string;
  primaryAccent: string;
  secondaryAccent: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: string;
  glowColor: string;
}

export interface CelebrationProject {
  id: string;
  title: string;
  occasion: OccasionType;
  themeId: ThemeId;
  backgroundAudioUrl?: string;
  modules: CelebrationModule[];
  createdAt: string;
  updatedAt: string;
  isPasswordProtected?: boolean;
  password?: string;
}
