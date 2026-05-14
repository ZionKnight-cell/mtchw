export type EnergyLevel = "low" | "medium" | "high";

export type ActivityCategory =
  | "fun"
  | "useful"
  | "creative"
  | "calm"
  | "learn"
  | "social"
  | "random";

export type MoodTag =
  | "bored"
  | "restless"
  | "tired"
  | "curious"
  | "stuck"
  | "overwhelmed"
  | "playful"
  | "quiet";

export type Activity = {
  id: string;
  title: string;
  instruction: string;
  category: ActivityCategory;
  energy: EnergyLevel;
  timeMinutes: number;
  tags: string[];
  moodTags: MoodTag[];
  repeatable: boolean;
};

export type UserPreferences = {
  energy: EnergyLevel | "surprise";
  timeAvailable: 1 | 5 | 10 | 15 | "any";
  category: ActivityCategory;
};

export type ActivityHistoryStatus = "shown" | "done" | "skipped" | "saved";

export type ActivityHistoryItem = {
  id: string;
  activityId: string;
  status: ActivityHistoryStatus;
  createdAt: string;
};

export type AppSettings = {
  reduceMotion: boolean;
  avoidRecentlyShown: boolean;
};