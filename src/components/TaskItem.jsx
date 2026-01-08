import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import WysiwygEditor, { sanitizeHtml } from "./WysiwygEditor.jsx";

const TaskItem = ({
  task,
  onStatusChange,
  onTimeAdd,
  onTimeEntryUpdate,
  onDescriptionChange,
  onItemAdd,
  onItemUpdate,
  onItemDelete,
  canEditDescription,
  canEditTimeEntries,
  canDelete,
  onDelete,
  className = "",
}) => {
  const [timeValue, setTimeValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState(
    task.description ?? ""
  );
  const [itemValue, setItemValue] = useState("");
  const [entryEdits, setEntryEdits] = useState({});
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  useEffect(() => {
    setDescriptionValue(task.description ?? "");
  }, [task.description]);

  const items = Array.isArray(task.items) ? task.items : [];
  const timeEntries = Array.isArray(task.time_entries)
    ? task.time_entries
    : [];

  useEffect(() => {
    const next = {};
    timeEntries.forEach((entry) => {
      next[entry.id] = entry.minutes;
    });
    setEntryEdits(next);
  }, [timeEntries]);

  const formatDate = (value) => {
    if (!value) {
      return "Unknown date";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleString();
  };

  return (
    <div className={`task-item${className ? ` ${className}` : ""}`}>
      <div className="task-item__main">
        <div className="task-item__header">
          <div>
            <h4>{task.title}</h4>
          </div>
          <div className="task-item__badges">
            <span className={`task-item__status status-${task.status}`}>
              {task.status.replace("_", " ")}
            </span>
            <span className="task-item__pill">
              {task.time_spent_minutes ?? 0} min
            </span>
          </div>
        </div>

        <div className="task-item__description">
          <div className="task-item__description-header">
            <div>
              <h5>Description</h5>
              {sanitizeHtml(task.description || "") ? (
                <div
                  className="task-item__description-text"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(task.description || ""),
                  }}
                />
              ) : (
                <p className="task-item__description-text">
                  No description yet.
                </p>
              )}
            </div>
            {canEditDescription ? (
              <Button
                variant="ghost"
                onClick={() => setIsDescriptionOpen(true)}
              >
                Edit
              </Button>
            ) : null}
          </div>
          {!canEditDescription ? (
            <p className="task-item__hint">
              Only the creator or admin can update the description.
            </p>
          ) : null}
        </div>

        <div className="task-item__checklist">
          <label>
            <span>Checklist</span>
            <div className="task-item__checklist-input">
              <input
                type="text"
                value={itemValue}
                onChange={(event) => setItemValue(event.target.value)}
                placeholder="Add item"
              />
              <Button
                variant="ghost"
                className="w-[200px]"
                onClick={() => {
                  if (!itemValue.trim()) {
                    return;
                  }
                  onItemAdd(task.id, itemValue);
                  setItemValue("");
                }}
              >
                Add
              </Button>
            </div>
          </label>
          <div className="task-item__checklist-items">
            {items.length ? (
              items.map((item) => (
                <div key={item.id} className="task-item__checklist-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!item.is_done}
                      onChange={(event) =>
                        onItemUpdate(item.id, {
                          isDone: event.target.checked,
                          content: item.content,
                        })
                      }
                    />
                    <span>{item.content}</span>
                  </label>
                  <Button variant="ghost" onClick={() => onItemDelete(item.id)}>
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p className="panel__muted">No checklist items.</p>
            )}
          </div>
        </div>

        <div className="task-item__time-entries">
          <div className="task-item__time-header">
            <h5>Time entries</h5>
            <Button
              variant="ghost"
              onClick={() => setIsTimeOpen((prev) => !prev)}
            >
              {isTimeOpen ? "Hide" : "Show"} ({timeEntries.length})
            </Button>
          </div>
          {isTimeOpen ? (
            timeEntries.length ? (
              timeEntries.map((entry) => (
                <div key={entry.id} className="task-item__time-entry">
                  <div>
                    <strong>{entry.minutes} min</strong>
                    <span>{formatDate(entry.created_at)}</span>
                    <small>
                      {entry.user_name || entry.user_email || "Unknown user"}
                    </small>
                  </div>
                  {canEditTimeEntries ? (
                    <div className="task-item__time-edit">
                      <input
                        type="number"
                        min="0"
                        value={entryEdits[entry.id] ?? entry.minutes}
                        onChange={(event) =>
                          setEntryEdits((prev) => ({
                            ...prev,
                            [entry.id]: event.target.value,
                          }))
                        }
                      />
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const nextValue = entryEdits[entry.id];
                          if (nextValue === "" || nextValue === undefined) {
                            return;
                          }
                          onTimeEntryUpdate(entry.id, nextValue);
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="panel__muted">No time entries yet.</p>
            )
          ) : null}
        </div>
      </div>

      <div className="task-item__actions">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <div className="task-item__time">
          <input
            type="number"
            min="0"
            value={timeValue}
            onChange={(event) => setTimeValue(event.target.value)}
          />
          <Button
            variant="ghost"
            onClick={async () => {
              if (!timeValue || Number(timeValue) <= 0) {
                return;
              }
              await onTimeAdd(task.id, timeValue);
              setTimeValue("");
            }}
          >
            Add time
          </Button>
        </div>
        {canDelete ? (
          <Button variant="ghost" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        ) : null}
      </div>

      {isDescriptionOpen ? (
        <div className="modal task-item__inline-modal modal--wide" role="dialog" aria-modal="true">
          <div
            className="modal__backdrop"
            onClick={() => setIsDescriptionOpen(false)}
          />
          <div className="modal__card">
            <header className="modal__header">
              <h3>Edit description</h3>
              <button
                className="modal__close"
                type="button"
                onClick={() => setIsDescriptionOpen(false)}
              >
                X
              </button>
            </header>
            <div className="modal__body">
              <label className="input-field" htmlFor={`desc-${task.id}`}>
                <span>Description</span>
                <WysiwygEditor
                  value={descriptionValue}
                  onChange={setDescriptionValue}
                  placeholder="Add details or notes..."
                />
              </label>
            </div>
            <div className="modal__footer">
              <div className="modal__actions">
                <Button
                  variant="ghost"
                  onClick={() => setIsDescriptionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    onDescriptionChange(task.id, sanitizeHtml(descriptionValue));
                    setIsDescriptionOpen(false);
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TaskItem;
