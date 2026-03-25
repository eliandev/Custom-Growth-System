import { FormEvent, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import {
  CalendarRecord,
  IdeaRecord,
  ProductionRecord,
  calendarStateOptions,
  formatOptions,
  ideaObjectiveOptions,
  pillarOptions,
  resultOptions,
} from "../data/marketing-data";
import {
  createCollectionItem,
  deleteCollectionItem,
  updateCollectionItem,
  useFirestoreCollection,
} from "../lib/firestore-helpers";

const initialForm: CalendarRecord = {
  publication: "",
  publicationDate: "",
  platform: "Instagram",
  type: "Reel",
  pillar: "Disciplina",
  objective: "Alcance",
  state: "Planificado",
  copyFinal: "",
  ctaFinal: "",
  result: "Pendiente",
};

export function CalendarPage() {
  const { items, loading, error } = useFirestoreCollection<CalendarRecord>("calendar");
  const { items: ideas } = useFirestoreCollection<IdeaRecord>("ideas");
  const { items: production } = useFirestoreCollection<ProductionRecord>("production");
  const [form, setForm] = useState<CalendarRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const suggestions = useMemo(() => {
    const titles = [...ideas.map((idea) => idea.title), ...production.map((item) => item.piece)];
    return [...new Set(titles)].sort((left, right) => left.localeCompare(right));
  }, [ideas, production]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createCollectionItem("calendar", form);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="content-grid form-layout">
        <SectionCard
          title="Calendarize content"
          description="Schedule new publications and keep the publishing queue current."
        >
          <form className="entry-form" onSubmit={handleSubmit}>
            <label>
              <span>Publicacion</span>
              <input
                list="calendar-suggestions"
                value={form.publication}
                onChange={(event) => setForm({ ...form, publication: event.target.value })}
                required
              />
              <datalist id="calendar-suggestions">
                {suggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>
            <div className="form-grid">
              <label>
                <span>Fecha publicacion</span>
                <input
                  type="datetime-local"
                  value={form.publicationDate}
                  onChange={(event) =>
                    setForm({ ...form, publicationDate: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Tipo</span>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value as CalendarRecord["type"] })
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
                <span>Pilar</span>
                <select
                  value={form.pillar}
                  onChange={(event) =>
                    setForm({ ...form, pillar: event.target.value as CalendarRecord["pillar"] })
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
                <span>Objetivo</span>
                <select
                  value={form.objective}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      objective: event.target.value as CalendarRecord["objective"],
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
            </div>
            <label>
              <span>Copy final</span>
              <textarea
                value={form.copyFinal}
                onChange={(event) => setForm({ ...form, copyFinal: event.target.value })}
              />
            </label>
            <label>
              <span>CTA final</span>
              <input
                value={form.ctaFinal}
                onChange={(event) => setForm({ ...form, ctaFinal: event.target.value })}
                required
              />
            </label>
            <button className="ghost-button" disabled={submitting} type="submit">
              {submitting ? "Saving..." : "Save calendar item"}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Publishing calendar"
          description="Live publication queue with scheduling and result tracking."
        >
          {loading ? <p className="status-text">Loading calendar...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {items.map((entry) => (
              <article key={entry.id} className="record-card">
                <div className="record-card__header">
                  <div>
                    <strong>{entry.publication}</strong>
                    <p>{entry.publicationDate || "No date yet"}</p>
                  </div>
                  <button
                    className="danger-button"
                    onClick={() => deleteCollectionItem("calendar", entry.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
                <div className="pill-row">
                  <span className="pill">{entry.type}</span>
                  <span className="pill">{entry.pillar}</span>
                  <span className="pill">{entry.objective}</span>
                </div>
                <p>{entry.ctaFinal}</p>
                <div className="inline-actions">
                  <label>
                    <span>Estado</span>
                    <select
                      value={entry.state}
                      onChange={(event) =>
                        updateCollectionItem<CalendarRecord>("calendar", entry.id, {
                          state: event.target.value as CalendarRecord["state"],
                        })
                      }
                    >
                      {calendarStateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Resultado</span>
                    <select
                      value={entry.result}
                      onChange={(event) =>
                        updateCollectionItem<CalendarRecord>("calendar", entry.id, {
                          result: event.target.value as CalendarRecord["result"],
                        })
                      }
                    >
                      {resultOptions.map((option) => (
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
