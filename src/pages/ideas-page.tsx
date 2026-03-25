import { FormEvent, useState } from "react";
import { SectionCard } from "../components/section-card";
import {
  IdeaRecord,
  formatOptions,
  ideaObjectiveOptions,
  ideaStateOptions,
  pillarOptions,
  priorityOptions,
  viralityOptions,
} from "../data/marketing-data";
import {
  createCollectionItem,
  deleteCollectionItem,
  updateCollectionItem,
  useFirestoreCollection,
} from "../lib/firestore-helpers";

const initialForm: IdeaRecord = {
  title: "",
  pillar: "Disciplina",
  format: "Reel",
  hook: "",
  message: "",
  cta: "",
  objective: "Alcance",
  virality: "Alto",
  state: "Idea",
  priority: "Alta",
};

export function IdeasPage() {
  const { items, loading, error } = useFirestoreCollection<IdeaRecord>("ideas");
  const [form, setForm] = useState<IdeaRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createCollectionItem("ideas", form);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="content-grid form-layout">
        <SectionCard
          title="New idea"
          description="Capture new content ideas directly into Firestore."
        >
          <form className="entry-form" onSubmit={handleSubmit}>
            <label>
              <span>Idea / Titulo</span>
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Hook</span>
              <textarea
                value={form.hook}
                onChange={(event) => setForm({ ...form, hook: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Mensaje</span>
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                required
              />
            </label>
            <label>
              <span>CTA</span>
              <input
                value={form.cta}
                onChange={(event) => setForm({ ...form, cta: event.target.value })}
                required
              />
            </label>
            <div className="form-grid">
              <label>
                <span>Pilar</span>
                <select
                  value={form.pillar}
                  onChange={(event) =>
                    setForm({ ...form, pillar: event.target.value as IdeaRecord["pillar"] })
                  }
                >
                  {pillarOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Formato</span>
                <select
                  value={form.format}
                  onChange={(event) =>
                    setForm({ ...form, format: event.target.value as IdeaRecord["format"] })
                  }
                >
                  {formatOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Objetivo</span>
                <select
                  value={form.objective}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      objective: event.target.value as IdeaRecord["objective"],
                    })
                  }
                >
                  {ideaObjectiveOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Viralidad</span>
                <select
                  value={form.virality}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      virality: event.target.value as IdeaRecord["virality"],
                    })
                  }
                >
                  {viralityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Estado</span>
                <select
                  value={form.state}
                  onChange={(event) =>
                    setForm({ ...form, state: event.target.value as IdeaRecord["state"] })
                  }
                >
                  {ideaStateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Prioridad</span>
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority: event.target.value as IdeaRecord["priority"],
                    })
                  }
                >
                  {priorityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="ghost-button" disabled={submitting} type="submit">
              {submitting ? "Saving..." : "Save idea"}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Ideas database"
          description="Live Firestore list with quick status updates."
        >
          {loading ? <p className="status-text">Loading ideas...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {items.map((idea) => (
              <article key={idea.id} className="record-card">
                <div className="record-card__header">
                  <div>
                    <strong>{idea.title}</strong>
                    <p>{idea.hook}</p>
                  </div>
                  <button
                    className="danger-button"
                    onClick={() => deleteCollectionItem("ideas", idea.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
                <p>{idea.message}</p>
                <div className="pill-row">
                  <span className="pill">{idea.pillar}</span>
                  <span className="pill">{idea.format}</span>
                  <span className="pill">{idea.objective}</span>
                </div>
                <div className="inline-actions">
                  <label>
                    <span>Estado</span>
                    <select
                      value={idea.state}
                      onChange={(event) =>
                        updateCollectionItem<IdeaRecord>("ideas", idea.id, {
                          state: event.target.value as IdeaRecord["state"],
                        })
                      }
                    >
                      {ideaStateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Prioridad</span>
                    <select
                      value={idea.priority}
                      onChange={(event) =>
                        updateCollectionItem<IdeaRecord>("ideas", idea.id, {
                          priority: event.target.value as IdeaRecord["priority"],
                        })
                      }
                    >
                      {priorityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
