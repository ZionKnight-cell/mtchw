import { useEffect, useState, type ReactNode } from "react";
import { ActivityCard } from "./components/ActivityCard";
import { activities } from "./data/activities";
import type {
  Activity,
  ActivityCategory,
  ActivityHistoryItem,
  EnergyLevel,
  UserPreferences,
} from "./types/activity";
import {
  createHistoryItem,
  getSuggestedActivity,
} from "./utils/activitySuggestions";
import {
  clearHistory,
  clearSavedActivities,
  loadHistory,
  loadPreferences,
  loadSavedActivityIds,
  saveHistory,
  savePreferences,
  saveSavedActivityIds,
} from "./utils/storage";
import "./styles/app.css";

type Screen = "home" | "preferences" | "activity" | "saved" | "history";

const defaultPreferences: UserPreferences = {
  energy: "surprise",
  timeAvailable: "any",
  category: "random",
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const [history, setHistory] = useState<ActivityHistoryItem[]>(() =>
    loadHistory()
  );

  const [savedActivityIds, setSavedActivityIds] = useState<string[]>(() =>
    loadSavedActivityIds()
  );

  const [completionMessage, setCompletionMessage] = useState("");
  const [currentActivityDone, setCurrentActivityDone] = useState(false);

  const [selectedPreferences, setSelectedPreferences] =
    useState<UserPreferences>(() => loadPreferences(defaultPreferences));

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveSavedActivityIds(savedActivityIds);
  }, [savedActivityIds]);

  useEffect(() => {
    savePreferences(selectedPreferences);
  }, [selectedPreferences]);

  function showActivity(options?: {
    preferencesOverride?: UserPreferences;
    similarToActivityId?: string;
    historyOverride?: ActivityHistoryItem[];
  }) {
    const historyForSuggestion = options?.historyOverride ?? history;
    const preferencesForSuggestion =
      options?.preferencesOverride ?? selectedPreferences;

    const suggestedActivity = getSuggestedActivity({
      activities,
      preferences: preferencesForSuggestion,
      history: historyForSuggestion,
      similarToActivityId: options?.similarToActivityId,
    });

    if (!suggestedActivity) {
      return;
    }

    showSpecificActivity(suggestedActivity, historyForSuggestion);
  }

  function showSpecificActivity(
    activity: Activity,
    historyOverride?: ActivityHistoryItem[]
  ) {
    const historyForUpdate = historyOverride ?? history;
    const shownHistoryItem = createHistoryItem(activity.id, "shown");
    const nextHistory = [...historyForUpdate, shownHistoryItem];

    setCurrentActivity(activity);
    setHistory(nextHistory);
    setCompletionMessage("");
    setCurrentActivityDone(false);
    setCurrentScreen("activity");
  }

  function handlePreferenceSubmit(preferences: UserPreferences) {
    setSelectedPreferences(preferences);

    showActivity({
      preferencesOverride: preferences,
    });
  }

  function handleSurpriseMe() {
    setSelectedPreferences(defaultPreferences);

    showActivity({
      preferencesOverride: defaultPreferences,
    });
  }

  function handleDone() {
    if (!currentActivity || currentActivityDone) {
      return;
    }

    setHistory((currentHistory) => [
      ...currentHistory,
      createHistoryItem(currentActivity.id, "done"),
    ]);

    setCurrentActivityDone(true);
    setCompletionMessage("Nice. Tiny thing done.");
  }

  function handleSkip() {
    if (!currentActivity) {
      return;
    }

    const skippedHistoryItem = createHistoryItem(currentActivity.id, "skipped");
    const nextHistory = [...history, skippedHistoryItem];

    showActivity({
      historyOverride: nextHistory,
    });
  }

  function handleSave() {
    if (!currentActivity || savedActivityIds.includes(currentActivity.id)) {
      return;
    }

    setSavedActivityIds((currentSavedIds) => [
      ...currentSavedIds,
      currentActivity.id,
    ]);

    setHistory((currentHistory) => [
      ...currentHistory,
      createHistoryItem(currentActivity.id, "saved"),
    ]);
  }

  function handleMoreLikeThis() {
    if (!currentActivity) {
      return;
    }

    showActivity({
      similarToActivityId: currentActivity.id,
    });
  }

  function handleTrySavedActivity(activity: Activity) {
    showSpecificActivity(activity);
  }

  function handleRemoveSavedActivity(activityId: string) {
    setSavedActivityIds((currentSavedIds) =>
      currentSavedIds.filter((savedActivityId) => savedActivityId !== activityId)
    );
  }

  function handleClearSavedActivities() {
    setSavedActivityIds([]);
    clearSavedActivities();
  }

  function handleClearHistory() {
    setHistory([]);
    clearHistory();
  }

  const savedActivities = activities.filter((activity) =>
    savedActivityIds.includes(activity.id)
  );

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <header className="app-header">
          <h1>mtchw</h1>
          <p className="tagline">Tiny ideas for bored moments.</p>
        </header>

        <section className="screen-content">
          {currentScreen === "home" && (
            <HomeScreen
              onStart={() => setCurrentScreen("preferences")}
              onSurpriseMe={handleSurpriseMe}
            />
          )}

          {currentScreen === "preferences" && (
            <PreferenceScreen
              initialPreferences={selectedPreferences}
              onBack={() => setCurrentScreen("home")}
              onSubmit={handlePreferenceSubmit}
            />
          )}

          {currentScreen === "activity" && (
            <ActivityScreen
              activity={currentActivity}
              completionMessage={completionMessage}
              isSaved={
                currentActivity
                  ? savedActivityIds.includes(currentActivity.id)
                  : false
              }
              isDone={currentActivityDone}
              onDone={handleDone}
              onSkip={handleSkip}
              onSave={handleSave}
              onMoreLikeThis={handleMoreLikeThis}
              onGoHome={() => setCurrentScreen("home")}
              onTryAnother={() => showActivity()}
            />
          )}

          {currentScreen === "saved" && (
            <SavedScreen
              savedActivities={savedActivities}
              onTryActivity={handleTrySavedActivity}
              onRemoveActivity={handleRemoveSavedActivity}
              onClearSavedActivities={handleClearSavedActivities}
            />
          )}

          {currentScreen === "history" && (
            <HistoryScreen
              history={history}
              onClearHistory={handleClearHistory}
            />
          )}
        </section>

        <nav className="bottom-nav" aria-label="Main navigation">
          <button
            className={currentScreen === "home" ? "active" : ""}
            onClick={() => setCurrentScreen("home")}
          >
            Home
          </button>

          <button
            className={currentScreen === "saved" ? "active" : ""}
            onClick={() => setCurrentScreen("saved")}
          >
            Saved
          </button>

          <button
            className={currentScreen === "history" ? "active" : ""}
            onClick={() => setCurrentScreen("history")}
          >
            History
          </button>
        </nav>
      </section>
    </main>
  );
}

function HomeScreen({
  onStart,
  onSurpriseMe,
}: {
  onStart: () => void;
  onSurpriseMe: () => void;
}) {
  return (
    <div className="home-screen">
      <div className="hero-card">
        <h2>I’m bored.</h2>
        <p>
          Pick your energy, time, and mood for the moment. mtchw will give you
          one small thing to do.
        </p>

        <button className="primary-button" onClick={onStart}>
          I’m bored
        </button>

        <button className="secondary-button" onClick={onSurpriseMe}>
          Surprise me
        </button>
      </div>

      <div className="tiny-note">No feed. No pressure. Just one tiny thing.</div>
    </div>
  );
}

function PreferenceScreen({
  initialPreferences,
  onBack,
  onSubmit,
}: {
  initialPreferences: UserPreferences;
  onBack: () => void;
  onSubmit: (preferences: UserPreferences) => void;
}) {
  const [energy, setEnergy] = useState<UserPreferences["energy"]>(
    initialPreferences.energy
  );

  const [timeAvailable, setTimeAvailable] =
    useState<UserPreferences["timeAvailable"]>(initialPreferences.timeAvailable);

  const [category, setCategory] = useState<ActivityCategory>(
    initialPreferences.category
  );

  const energyOptions: { label: string; value: EnergyLevel | "surprise" }[] = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Surprise me", value: "surprise" },
  ];

  const timeOptions: { label: string; value: UserPreferences["timeAvailable"] }[] =
    [
      { label: "1 min", value: 1 },
      { label: "5 min", value: 5 },
      { label: "10 min", value: 10 },
      { label: "15+ min", value: 15 },
      { label: "Any", value: "any" },
    ];

  const categoryOptions: { label: string; value: ActivityCategory }[] = [
    { label: "Fun", value: "fun" },
    { label: "Useful", value: "useful" },
    { label: "Creative", value: "creative" },
    { label: "Calm", value: "calm" },
    { label: "Learn", value: "learn" },
    { label: "Social", value: "social" },
    { label: "Random", value: "random" },
  ];

  return (
    <div className="preference-screen">
      <div className="preference-header">
        <button className="text-button" onClick={onBack}>
          ← Back
        </button>

        <h2>What kind of thing?</h2>
        <p>Choose what fits right now. You can keep it random too.</p>
      </div>

      <PreferenceGroup title="Energy">
        {energyOptions.map((option) => (
          <button
            key={option.value}
            className={energy === option.value ? "chip selected" : "chip"}
            onClick={() => setEnergy(option.value)}
          >
            {option.label}
          </button>
        ))}
      </PreferenceGroup>

      <PreferenceGroup title="Time">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            className={timeAvailable === option.value ? "chip selected" : "chip"}
            onClick={() => setTimeAvailable(option.value)}
          >
            {option.label}
          </button>
        ))}
      </PreferenceGroup>

      <PreferenceGroup title="Category">
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            className={category === option.value ? "chip selected" : "chip"}
            onClick={() => setCategory(option.value)}
          >
            {option.label}
          </button>
        ))}
      </PreferenceGroup>

      <button
        className="primary-button"
        onClick={() =>
          onSubmit({
            energy,
            timeAvailable,
            category,
          })
        }
      >
        Give me a thing
      </button>
    </div>
  );
}

function PreferenceGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="preference-group">
      <h3>{title}</h3>
      <div className="chip-grid">{children}</div>
    </section>
  );
}

function ActivityScreen({
  activity,
  completionMessage,
  isSaved,
  isDone,
  onDone,
  onSkip,
  onSave,
  onMoreLikeThis,
  onGoHome,
  onTryAnother,
}: {
  activity: Activity | null;
  completionMessage: string;
  isSaved: boolean;
  isDone: boolean;
  onDone: () => void;
  onSkip: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  onGoHome: () => void;
  onTryAnother: () => void;
}) {
  if (!activity) {
    return (
      <div className="placeholder-screen">
        <h2>No activity yet</h2>
        <p>Go home and tap “I’m bored” to get one tiny thing to do.</p>
      </div>
    );
  }

  return (
    <div className="activity-screen">
      {completionMessage && (
        <div className="completion-message">
          <p>{completionMessage}</p>

          <div className="completion-actions">
            <button className="secondary-button compact" onClick={onGoHome}>
              Back home
            </button>

            <button className="secondary-button compact" onClick={onTryAnother}>
              Another thing
            </button>
          </div>
        </div>
      )}

      <ActivityCard
        activity={activity}
        onDone={onDone}
        onSkip={onSkip}
        onSave={onSave}
        onMoreLikeThis={onMoreLikeThis}
        isSaved={isSaved}
        isDone={isDone}
      />
    </div>
  );
}

function SavedScreen({
  savedActivities,
  onTryActivity,
  onRemoveActivity,
  onClearSavedActivities,
}: {
  savedActivities: Activity[];
  onTryActivity: (activity: Activity) => void;
  onRemoveActivity: (activityId: string) => void;
  onClearSavedActivities: () => void;
}) {
  if (savedActivities.length === 0) {
    return (
      <div className="placeholder-screen">
        <h2>Saved</h2>
        <p>Nothing saved yet. Save activities your future bored self might like.</p>
      </div>
    );
  }

  return (
    <div className="list-screen">
      <div className="list-header">
        <div>
          <h2>Saved</h2>
          <p>
            {savedActivities.length} saved thing
            {savedActivities.length === 1 ? "" : "s"}.
          </p>
        </div>

        <button className="text-danger-button" onClick={onClearSavedActivities}>
          Clear saved
        </button>
      </div>

      {savedActivities.map((activity) => (
        <article className="mini-card" key={activity.id}>
          <div className="mini-card-meta">
            <span>{activity.category}</span>
            <span>{activity.timeMinutes} min</span>
          </div>

          <h3>{activity.title}</h3>
          <p>{activity.instruction}</p>

          <div className="mini-card-actions">
            <button
              className="secondary-button compact"
              onClick={() => onTryActivity(activity)}
            >
              Try now
            </button>

            <button
              className="subtle-danger-button"
              onClick={() => onRemoveActivity(activity.id)}
            >
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function HistoryScreen({
  history,
  onClearHistory,
}: {
  history: ActivityHistoryItem[];
  onClearHistory: () => void;
}) {
  const visibleHistory = history.filter((item) => item.status !== "shown");

  if (visibleHistory.length === 0) {
    return (
      <div className="placeholder-screen">
        <h2>History</h2>
        <p>No completed, skipped, or saved activities yet.</p>
      </div>
    );
  }

  return (
    <div className="list-screen">
      <div className="list-header">
        <div>
          <h2>History</h2>
          <p>Your latest activity actions on this device.</p>
        </div>

        <button className="text-danger-button" onClick={onClearHistory}>
          Clear history
        </button>
      </div>

      {[...visibleHistory].reverse().slice(0, 25).map((item) => {
        const activity = activities.find(
          (activityItem) => activityItem.id === item.activityId
        );

        return (
          <article className="mini-card" key={item.id}>
            <div className="history-row">
              <span className={`status-pill status-${item.status}`}>
                {formatHistoryStatus(item.status)}
              </span>

              <span className="history-date">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>

            <h3>{activity?.title ?? "Unknown activity"}</h3>
            <p>{activity?.instruction ?? "This activity is no longer available."}</p>
          </article>
        );
      })}
    </div>
  );
}

function formatHistoryStatus(status: ActivityHistoryItem["status"]) {
  if (status === "done") {
    return "Done";
  }

  if (status === "skipped") {
    return "Skipped";
  }

  if (status === "saved") {
    return "Saved";
  }

  return "Shown";
}

export default App;