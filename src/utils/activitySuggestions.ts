import type {
  Activity,
  ActivityCategory,
  ActivityHistoryItem,
  EnergyLevel,
  UserPreferences,
} from "../types/activity";

type SuggestionOptions = {
  activities: Activity[];
  preferences: UserPreferences;
  history: ActivityHistoryItem[];
  similarToActivityId?: string;
};

const RECENT_ACTIVITY_LIMIT = 8;

export function getSuggestedActivity({
  activities,
  preferences,
  history,
  similarToActivityId,
}: SuggestionOptions): Activity | null {
  if (activities.length === 0) {
    return null;
  }

  const similarToActivity = similarToActivityId
    ? activities.find((activity) => activity.id === similarToActivityId)
    : undefined;

  const recentlyShownIds = getRecentlyShownActivityIds(history);

  const availableActivities = activities.filter(
    (activity) => activity.id !== similarToActivityId
  );

  let matchingActivities = availableActivities.filter((activity) =>
    activityMatchesPreferences(activity, preferences)
  );

  matchingActivities = removeRecentlyShownActivities(
    matchingActivities,
    recentlyShownIds
  );

  if (similarToActivity) {
    matchingActivities = sortBySimilarity(matchingActivities, similarToActivity);
  }

  if (matchingActivities.length > 0) {
  if (similarToActivity) {
    return pickRandomActivityFromTopResults(matchingActivities);
  }

  return pickRandomActivity(matchingActivities);
}
  const relaxedMatches = getRelaxedMatches({
    activities: availableActivities,
    preferences,
    recentlyShownIds,
  });

  if (similarToActivity && relaxedMatches.length > 0) {
  return pickRandomActivityFromTopResults(
    sortBySimilarity(relaxedMatches, similarToActivity)
  );
}

  if (relaxedMatches.length > 0) {
    return pickRandomActivity(relaxedMatches);
  }

  return pickRandomActivity(availableActivities.length > 0 ? availableActivities : activities);
}

export function activityMatchesPreferences(
  activity: Activity,
  preferences: UserPreferences
): boolean {
  const categoryMatches =
    preferences.category === "random" || activity.category === preferences.category;

  const energyMatches =
    preferences.energy === "surprise" || activity.energy === preferences.energy;

  const timeMatches =
    preferences.timeAvailable === "any" ||
    activity.timeMinutes <= preferences.timeAvailable;

  return categoryMatches && energyMatches && timeMatches;
}

export function getRecentlyShownActivityIds(
  history: ActivityHistoryItem[]
): string[] {
  return history
    .filter(
      (item) =>
        item.status === "shown" ||
        item.status === "done" ||
        item.status === "skipped"
    )
    .slice(-RECENT_ACTIVITY_LIMIT)
    .map((item) => item.activityId);
}

export function removeRecentlyShownActivities(
  activities: Activity[],
  recentlyShownIds: string[]
): Activity[] {
  const filteredActivities = activities.filter(
    (activity) => !recentlyShownIds.includes(activity.id)
  );

  return filteredActivities.length > 0 ? filteredActivities : activities;
}

export function createHistoryItem(
  activityId: string,
  status: ActivityHistoryItem["status"]
): ActivityHistoryItem {
  return {
    id: `${activityId}-${status}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    activityId,
    status,
    createdAt: new Date().toISOString(),
  };
}

function getRelaxedMatches({
  activities,
  preferences,
  recentlyShownIds,
}: {
  activities: Activity[];
  preferences: UserPreferences;
  recentlyShownIds: string[];
}): Activity[] {
  const withoutRecent = removeRecentlyShownActivities(
    activities,
    recentlyShownIds
  );

  const categoryMatches = filterByCategory(withoutRecent, preferences.category);

  if (categoryMatches.length > 0) {
    return categoryMatches;
  }

  const energyMatches = filterByEnergy(withoutRecent, preferences.energy);

  if (energyMatches.length > 0) {
    return energyMatches;
  }

  const timeMatches = filterByTime(withoutRecent, preferences.timeAvailable);

  if (timeMatches.length > 0) {
    return timeMatches;
  }

  return withoutRecent;
}

function filterByCategory(
  activities: Activity[],
  category: ActivityCategory
): Activity[] {
  if (category === "random") {
    return activities;
  }

  return activities.filter((activity) => activity.category === category);
}

function filterByEnergy(
  activities: Activity[],
  energy: EnergyLevel | "surprise"
): Activity[] {
  if (energy === "surprise") {
    return activities;
  }

  return activities.filter((activity) => activity.energy === energy);
}

function filterByTime(
  activities: Activity[],
  timeAvailable: UserPreferences["timeAvailable"]
): Activity[] {
  if (timeAvailable === "any") {
    return activities;
  }

  return activities.filter((activity) => activity.timeMinutes <= timeAvailable);
}

function sortBySimilarity(
  activities: Activity[],
  targetActivity: Activity
): Activity[] {
  return [...activities].sort((activityA, activityB) => {
    const scoreA = getSimilarityScore(activityA, targetActivity);
    const scoreB = getSimilarityScore(activityB, targetActivity);

    return scoreB - scoreA;
  });
}

function getSimilarityScore(activity: Activity, targetActivity: Activity): number {
  let score = 0;

  if (activity.category === targetActivity.category) {
    score += 4;
  }

  if (activity.energy === targetActivity.energy) {
    score += 2;
  }

  if (Math.abs(activity.timeMinutes - targetActivity.timeMinutes) <= 2) {
    score += 1;
  }

  for (const tag of activity.tags) {
    if (targetActivity.tags.includes(tag)) {
      score += 2;
    }
  }

  for (const moodTag of activity.moodTags) {
    if (targetActivity.moodTags.includes(moodTag)) {
      score += 1;
    }
  }

  return score;
}

function pickRandomActivityFromTopResults(activities: Activity[]): Activity {
  const topResults = activities.slice(0, Math.min(5, activities.length));
  const randomIndex = Math.floor(Math.random() * topResults.length);

  return topResults[randomIndex];
}

function pickRandomActivity(activities: Activity[]): Activity {
  const randomIndex = Math.floor(Math.random() * activities.length);

  return activities[randomIndex];
}