import type { ActivityHistoryItem, UserPreferences } from "../types/activity";

const STORAGE_KEYS = {
  savedActivityIds: "mtchw:savedActivityIds",
  history: "mtchw:history",
  preferences: "mtchw:preferences",
} as const;

export function loadSavedActivityIds(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.savedActivityIds, []);
}

export function saveSavedActivityIds(savedActivityIds: string[]) {
  saveToStorage(STORAGE_KEYS.savedActivityIds, savedActivityIds);
}

export function loadHistory(): ActivityHistoryItem[] {
  return loadFromStorage<ActivityHistoryItem[]>(STORAGE_KEYS.history, []);
}

export function saveHistory(history: ActivityHistoryItem[]) {
  saveToStorage(STORAGE_KEYS.history, history);
}

export function loadPreferences(
  fallbackPreferences: UserPreferences
): UserPreferences {
  return loadFromStorage<UserPreferences>(
    STORAGE_KEYS.preferences,
    fallbackPreferences
  );
}

export function savePreferences(preferences: UserPreferences) {
  saveToStorage(STORAGE_KEYS.preferences, preferences);
}

export function clearSavedActivities() {
  localStorage.removeItem(STORAGE_KEYS.savedActivityIds);
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.history);
}

export function clearPreferences() {
  localStorage.removeItem(STORAGE_KEYS.preferences);
}

export function clearAllMtchwData() {
  clearSavedActivities();
  clearHistory();
  clearPreferences();
}

function loadFromStorage<T>(key: string, fallbackValue: T): T {
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.warn(`Could not load ${key} from localStorage`, error);
    return fallbackValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key} to localStorage`, error);
  }
}