export enum FlowStep {
  Splash,
  Introduction,
  Interview,
  ObservationInstructions,
  DailyLogging,
  Report,
  Challenge,
  Dashboard,
}

export interface Trade {
  id: string;
  screenshot: string; // Will store image data URL
  screenshotName: string;
  reason: string;
  timestamp: string;
}

export interface InterviewData {
  story: string;
  setups: string;
  mistake: string;
  idealDay: string;
}

export interface InsightCardData {
  type: string;
  title: string;
  content: string;
  icon: string;
}

export interface ChallengeData {
  focusSetup: string;
  mission: string;
}