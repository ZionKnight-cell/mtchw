import { useState } from "react";
import { ActivityCard } from "./components/ActivityCard";
import { activities } from "./data/activities";
import type { Activity, ActivityHistoryItem, UserPreferences } from "./types/activity";
import {
  createHistoryItem,
  getSuggestedActivity,
} from "./utils/activitySuggestions";
import "./styles/app.css";

type Screen = "home" | "activity" | "saved" | "history" | "settings";

const defaultPreferences: UserPreferences = {
  energy: "surprise",
  timeAvailable: "any",
  category: "random",
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [history, setHistory] = useState<ActivityHistoryItem[]>([]);
  const [savedActivityIds, setSavedActivityIds] = useState<string[]>([]);
  const [completionMessage, setCompletionMessage] = useState("");

  function showActivity(similarToActivityId?: string) {
    const suggestedActivity = getSuggestedActivity({
      activities,
      preferences: defaultPreferences,
      history,
      similarToActivityId,
    });

    if (!suggestedActivity) {
      return;
    }

    setCurrentActivity(suggestedActivity);
    setHistory((currentHistory) => [
      ...currentHistory,
      createHistoryItem(suggestedActivity.id, "shown"),
    ]);
    setCompletionMessage("");
    setCurrentScreen("activity");
  }

  function handleDone() {
    if (!currentActivity) {
      return;
    }

    setHistory((currentHistory) => [
      ...currentHistory,
      createHistoryItem(currentActivity.id, "done"),
    ]);

    setCompletionMessage("Nice. Tiny thing done.");
  }

  function handleSkip() {
    if (!currentActivity) {
      return;
    }

    setHistory((currentHistory) => [
      ...currentHistory,
      createHistoryItem(currentActivity.id, "skipped"),
    ]);

    showActivity();
  }

  function handleSave() {
    if (!currentActivity) {
      return;
    }

    setSavedActivityIds((currentSavedIds) => {
      if (currentSavedIds.includes(currentActivity.id)) {
        return currentSavedIds;
      }

      return [...currentSavedIds, currentActivity.id];
    });

    setHistory((currentHistory) => [
      ...currentHistory,
      createHistoryItem(currentActivity.id, "saved"),
    ]);
  }

  function handleMoreLikeThis() {
    if (!currentActivity) {
      return;
    }

    showActivity(currentActivity.id);
  }

  const savedActivities = activities.filter((activity) =>
    savedActivityIds.includes(activity.id)
  );

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <header className="app-header">
          <p className="eyebrow">boredom button</p>
          <h1>mtchw</h1>
          <p className="tagline">One tiny thing to do when you’re bored.</p>
        </header>

        <section className="screen-content">
          {currentScreen === "home" && <HomeScreen onStart={() => showActivity()} />}

          {currentScreen === "activity" && (
            <ActivityScreen
              activity={currentActivity}
              completionMessage={completionMessage}
              isSaved={
                currentActivity
                  ? savedActivityIds.includes(currentActivity.id)
                  : false
              }
              onDone={handleDone}
              onSkip={handleSkip}
              onSave={handleSave}
              onMoreLikeThis={handleMoreLikeThis}
            />
          )}

          {currentScreen === "saved" && (
            <SavedScreen savedActivities={savedActivities} />
          )}

          {currentScreen === "history" && <HistoryScreen history={history} />}

          {currentScreen === "settings" && <PlaceholderScreen title="Settings" />}
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

          <button
            className={currentScreen === "settings" ? "active" : ""}
            onClick={() => setCurrentScreen("settings")}
          >
            Settings
          </button>
        </nav>
      </section>
    </main>
  );
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="home-screen">
      <div className="hero-card">
        <h2>I’m bored.</h2>
        <p>
          Tap the button and mtchw will give you one small thing to do. No feed,
          no pressure, no productivity guilt.
        </p>

        <button className="primary-button" onClick={onStart}>
          I’m bored
        </button>

        <button className="secondary-button" onClick={onStart}>
          Surprise me
        </button>
      </div>

      <div className="tiny-note">
        MVP status: real activity suggestions are now connected.
      </div>
    </div>
  );
}

function ActivityScreen({
  activity,
  completionMessage,
  isSaved,
  onDone,
  onSkip,
  onSave,
  onMoreLikeThis,
}: {
  activity: Activity | null;
  completionMessage: string;
  isSaved: boolean;
  onDone: () => void;
  onSkip: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
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
        <div className="completion-message">{completionMessage}</div>
      )}

      <ActivityCard
        activity={activity}
        onDone={onDone}
        onSkip={onSkip}
        onSave={onSave}
        onMoreLikeThis={onMoreLikeThis}
        isSaved={isSaved}
      />
    </div>
  );
}

function SavedScreen({ savedActivities }: { savedActivities: Activity[] }) {
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
      <h2>Saved</h2>

      {savedActivities.map((activity) => (
        <article className="mini-card" key={activity.id}>
          <h3>{activity.title}</h3>
          <p>{activity.instruction}</p>
          <span>
            {activity.category} • {activity.timeMinutes} min
          </span>
        </article>
      ))}
    </div>
  );
}

function HistoryScreen({ history }: { history: ActivityHistoryItem[] }) {
  if (history.length === 0) {
    return (
      <div className="placeholder-screen">
        <h2>History</h2>
        <p>No history yet. Tap “I’m bored” and try your first thing.</p>
      </div>
    );
  }

  return (
    <div className="list-screen">
      <h2>History</h2>

      {[...history].reverse().slice(0, 20).map((item) => {
        const activity = activities.find(
          (activityItem) => activityItem.id === item.activityId
        );

        return (
          <article className="mini-card" key={item.id}>
            <h3>{activity?.title ?? "Unknown activity"}</h3>
            <p>Status: {item.status}</p>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </article>
        );
      })}
    </div>
  );
}

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="placeholder-screen">
      <h2>{title}</h2>
      <p>This screen will be built in a later step.</p>
    </div>
  );
}

export default App;