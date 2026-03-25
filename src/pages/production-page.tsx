import { FormEvent, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import {
  IdeaRecord,
  ProductionRecord,
  formatOptions,
  productionStateOptions,
} from "../data/marketing-data";
import {
  createCollectionItem,
  deleteCollectionItem,
  updateCollectionItem,
  useFirestoreCollection,
} from "../lib/firestore-helpers";

const initialForm: ProductionRecord = {
  piece: "",
  ideaTitle: "",
  targetDate: "",
  format: "Reel",
  productionState: "Guion",
  owner: "Marketing Boost",
  notes: "",
};

export function ProductionPage() {
  const { items, loading, error } = useFirestoreCollection<ProductionRecord>("production");
  const { items: ideas } = useFirestoreCollection<IdeaRecord>("ideas");
  const [form, setForm] = useState<ProductionRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const sortedIdeas = useMemo(
    () => [...ideas].sort((left, right) => left.title.localeCompare(right.title)),
    [ideas],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createCollectionItem("production", form);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="content-grid form-layout">
        <SectionCard
          title="New production item"
          description="Create execution tasks and attach them to an existing idea."
        >
          <form className="entry-form" onSubmit={handleSubmit}>
            <label>
              <span>Pieza</span>
              <input
                value={form.piece}
                onChange={(event) => setForm({ ...form, piece: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Idea relacionada</span>
              <select
                value={form.ideaTitle}
                onChange={(event) => setForm({ ...form, ideaTitle: event.target.value })}
                required
              >
                <option value="">Select an idea</option>
                {sortedIdeas.map((idea) => (
                  <option key={idea.id} value={idea.title}>
                    {idea.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                <span>Fecha objetivo</span>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(event) => setForm({ ...form, targetDate: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Formato</span>
                <select
                  value={form.format}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      format: event.target.value as ProductionRecord["format"],
                    })
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
                <span>Estado</span>
                <select
                  value={form.productionState}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      productionState: event.target.value as ProductionRecord["productionState"],
                    })
                  }
                >
                  {productionStateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Responsable</span>
                <input
                  value={form.owner}
                  onChange={(event) => setForm({ ...form, owner: event.target.value })}
                  required
                />
              </label>
            </div>
            <label>
              <span>Observaciones</span>
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </label>
            <button className="ghost-button" disabled={submitting} type="submit">
              {submitting ? "Saving..." : "Save production item"}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Production pipeline"
          description="Live production queue with state management."
        >
          {loading ? <p className="status-text">Loading production...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {items.map((item) => (
              <article key={item.id} className="record-card">
                <div className="record-card__header">
                  <div>
                    <strong>{item.piece}</strong>
                    <p>{item.ideaTitle || "No linked idea"}</p>
                  </div>
                  <button
                    className="danger-button"
                    onClick={() => deleteCollectionItem("production", item.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
                <div className="pill-row">
                  <span className="pill">{item.format}</span>
                  <span className="pill">{item.targetDate}</span>
                  <span className="pill">{item.owner}</span>
                </div>
                <p>{item.notes}</p>
                <div className="inline-actions">
                  <label>
                    <span>Estado</span>
                    <select
                      value={item.productionState}
                      onChange={(event) =>
                        updateCollectionItem<ProductionRecord>("production", item.id, {
                          productionState:
                            event.target.value as ProductionRecord["productionState"],
                        })
                      }
                    >
                      {productionStateOptions.map((option) => (
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
