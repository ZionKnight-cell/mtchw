import type { Activity } from "../types/activity";

type ActivityCardProps = {
  activity: Activity;
  onDone: () => void;
  onSkip: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  isSaved: boolean;
  isDone: boolean;
};

export function ActivityCard({
  activity,
  onDone,
  onSkip,
  onSave,
  onMoreLikeThis,
  isSaved,
  isDone,
}: ActivityCardProps) {
  return (
    <article className="activity-card">
      <div className="activity-meta">
        <span>{activity.category}</span>
        <span>{activity.energy} energy</span>
        <span>{activity.timeMinutes} min</span>
      </div>

      <h2>{activity.title}</h2>

      <p>{activity.instruction}</p>

      <div className="activity-actions">
        <button
          className="primary-button"
          onClick={onDone}
          disabled={isDone}
        >
          {isDone ? "Done ✓" : "Done"}
        </button>

        <div className="secondary-action-grid">
          <button className="secondary-button compact" onClick={onSkip}>
            Skip
          </button>

          <button
            className="secondary-button compact"
            onClick={onSave}
            disabled={isSaved}
          >
            {isSaved ? "Saved ✓" : "Save"}
          </button>
        </div>

        <button className="ghost-button" onClick={onMoreLikeThis}>
          More Like This
        </button>
      </div>
    </article>
  );
}