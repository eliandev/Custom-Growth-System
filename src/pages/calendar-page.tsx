import { FormEvent, useEffect, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  CalendarRecord,
  IdeaRecord,
  ProjectRecord,
  ProductionRecord,
  calendarStateOptions,
  formatOptions,
  ideaObjectiveOptions,
  pillarOptions,
  resultOptions,
} from "../data/marketing-data";
import {
  FirestoreItem,
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
  metrics: "",
  learning: "",
};

function CalendarEditor({
  item,
  businesses,
  projects,
  suggestions,
  onCancel,
}: {
  item: FirestoreItem<CalendarRecord>;
  businesses: Array<FirestoreItem<BusinessRecord>>;
  projects: Array<FirestoreItem<ProjectRecord>>;
  suggestions: string[];
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CalendarRecord>({
    businessId: item.businessId ?? "",
    projectId: item.projectId ?? "",
    publication: item.publication,
    publicationDate: item.publicationDate,
    platform: item.platform,
    type: item.type,
    pillar: item.pillar,
    objective: item.objective,
    state: item.state,
    copyFinal: item.copyFinal,
    ctaFinal: item.ctaFinal,
    result: item.result,
    metrics: item.metrics ?? "",
    learning: item.learning ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateCollectionItem<CalendarRecord>("calendar", item.id, form);
      onCancel();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSave}>
      <label>
        <span>Business</span>
        <select value={form.businessId ?? ""} onChange={(event) => setForm({ ...form, businessId: event.target.value })} required>
          <option value="">Select a business</option>
          {businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
        </select>
      </label>
      <label>
        <span>Project</span>
        <select value={form.projectId ?? ""} onChange={(event) => setForm({ ...form, projectId: event.target.value })} required>
          <option value="">Select a project</option>
          {projects.filter((project) => project.businessId === form.businessId).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
      </label>
      <label>
        <span>Publicacion</span>
        <input list="calendar-edit-suggestions" value={form.publication} onChange={(event) => setForm({ ...form, publication: event.target.value })} required />
        <datalist id="calendar-edit-suggestions">
          {suggestions.map((value) => <option key={value} value={value} />)}
        </datalist>
      </label>
      <div className="form-grid">
        <label><span>Fecha publicacion</span><input type="datetime-local" value={form.publicationDate} onChange={(event) => setForm({ ...form, publicationDate: event.target.value })} required /></label>
        <label><span>Tipo</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CalendarRecord["type"] })}>{formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label><span>Pilar</span><select value={form.pillar} onChange={(event) => setForm({ ...form, pillar: event.target.value as CalendarRecord["pillar"] })}>{pillarOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label><span>Objetivo</span><select value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value as CalendarRecord["objective"] })}>{ideaObjectiveOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label><span>Estado</span><select value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value as CalendarRecord["state"] })}>{calendarStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label><span>Resultado</span><select value={form.result} onChange={(event) => setForm({ ...form, result: event.target.value as CalendarRecord["result"] })}>{resultOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      </div>
      <label><span>Copy final</span><textarea value={form.copyFinal} onChange={(event) => setForm({ ...form, copyFinal: event.target.value })} /></label>
      <label><span>CTA final</span><input value={form.ctaFinal} onChange={(event) => setForm({ ...form, ctaFinal: event.target.value })} required /></label>
      <label><span>Metricas</span><textarea value={form.metrics} onChange={(event) => setForm({ ...form, metrics: event.target.value })} /></label>
      <label><span>Aprendizaje</span><textarea value={form.learning} onChange={(event) => setForm({ ...form, learning: event.target.value })} /></label>
      <div className="action-row">
        <button className="ghost-button" disabled={saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>
        <button className="subtle-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export function CalendarPage() {
  const { items, loading, error } = useFirestoreCollection<CalendarRecord>("calendar");
  const { items: ideas } = useFirestoreCollection<IdeaRecord>("ideas");
  const { items: production } = useFirestoreCollection<ProductionRecord>("production");
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items: projects } = useFirestoreCollection<ProjectRecord>("projects");
  const { activeBusinessId, activeProjectId } = useBusinessContext();
  const [form, setForm] = useState<CalendarRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [stateFilter, setStateFilter] = useState<string>("Todos");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      businessId: current.businessId || activeBusinessId,
      projectId: current.projectId || activeProjectId,
    }));
  }, [activeBusinessId, activeProjectId]);

  const suggestions = useMemo(() => {
    const filteredIdeas = ideas.filter((item) => (!activeBusinessId || item.businessId === activeBusinessId) && (!activeProjectId || item.projectId === activeProjectId));
    const filteredProduction = production.filter((item) => (!activeBusinessId || item.businessId === activeBusinessId) && (!activeProjectId || item.projectId === activeProjectId));
    const titles = [...filteredIdeas.map((idea) => idea.title), ...filteredProduction.map((item) => item.piece)];
    return [...new Set(titles)].sort((left, right) => left.localeCompare(right));
  }, [ideas, production, activeBusinessId, activeProjectId]);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (!activeBusinessId || item.businessId === activeBusinessId) &&
          (!activeProjectId || item.projectId === activeProjectId) &&
          (stateFilter === "Todos" || item.state === stateFilter) &&
          (typeFilter === "Todos" || item.type === typeFilter),
      ),
    [items, activeBusinessId, activeProjectId, stateFilter, typeFilter],
  );

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
        <SectionCard title="Calendarize content" description="Schedule new publications and keep the publishing queue current.">
          <form className="entry-form" onSubmit={handleSubmit}>
            <label>
              <span>Business</span>
              <select value={form.businessId ?? ""} onChange={(event) => setForm({ ...form, businessId: event.target.value })} required>
                <option value="">Select a business</option>
                {businesses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label>
              <span>Project</span>
              <select value={form.projectId ?? ""} onChange={(event) => setForm({ ...form, projectId: event.target.value })} required>
                <option value="">Select a project</option>
                {projects.filter((item) => item.businessId === (form.businessId || activeBusinessId)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label>
              <span>Publicacion</span>
              <input list="calendar-suggestions" value={form.publication} onChange={(event) => setForm({ ...form, publication: event.target.value })} required />
              <datalist id="calendar-suggestions">
                {suggestions.map((item) => <option key={item} value={item} />)}
              </datalist>
            </label>
            <div className="form-grid">
              <label><span>Fecha publicacion</span><input type="datetime-local" value={form.publicationDate} onChange={(event) => setForm({ ...form, publicationDate: event.target.value })} required /></label>
              <label><span>Tipo</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CalendarRecord["type"] })}>{formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Pilar</span><select value={form.pillar} onChange={(event) => setForm({ ...form, pillar: event.target.value as CalendarRecord["pillar"] })}>{pillarOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Objetivo</span><select value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value as CalendarRecord["objective"] })}>{ideaObjectiveOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            </div>
            <label><span>Copy final</span><textarea value={form.copyFinal} onChange={(event) => setForm({ ...form, copyFinal: event.target.value })} /></label>
            <label><span>CTA final</span><input value={form.ctaFinal} onChange={(event) => setForm({ ...form, ctaFinal: event.target.value })} required /></label>
            <label><span>Metricas</span><textarea value={form.metrics} onChange={(event) => setForm({ ...form, metrics: event.target.value })} /></label>
            <label><span>Aprendizaje</span><textarea value={form.learning} onChange={(event) => setForm({ ...form, learning: event.target.value })} /></label>
            <button className="ghost-button" disabled={submitting} type="submit">{submitting ? "Saving..." : "Save calendar item"}</button>
          </form>
        </SectionCard>

        <SectionCard
          title="Publishing calendar"
          description="Live publication queue with scheduling, metrics, and learnings."
          action={
            <div className="toolbar">
              <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
                <option value="Todos">All states</option>
                {calendarStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="Todos">All types</option>
                {formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          }
        >
          {loading ? <p className="status-text">Loading calendar...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {filteredItems.map((entry) => (
              <article key={entry.id} className="record-card">
                {editingId === entry.id ? (
                  <CalendarEditor item={entry} businesses={businesses} projects={projects} suggestions={suggestions} onCancel={() => setEditingId(null)} />
                ) : (
                  <>
                    <div className="record-card__header">
                      <div>
                        <strong>{entry.publication}</strong>
                        <p>{entry.publicationDate || "No date yet"}</p>
                      </div>
                      <div className="mini-actions">
                        <button className="subtle-button" onClick={() => setEditingId(entry.id)} type="button">Edit</button>
                        <button className="danger-button" onClick={() => deleteCollectionItem("calendar", entry.id)} type="button">Delete</button>
                      </div>
                    </div>
                    <div className="pill-row">
                      <span className="pill">{entry.type}</span>
                      <span className="pill">{entry.pillar}</span>
                      <span className="pill">{entry.objective}</span>
                      <span className="pill">{entry.result}</span>
                      <span className="pill">{businesses.find((business) => business.id === entry.businessId)?.name ?? "No business"}</span>
                      <span className="pill">{projects.find((project) => project.id === entry.projectId)?.name ?? "No project"}</span>
                    </div>
                    <p>{entry.ctaFinal}</p>
                    <div className="detail-grid">
                      <div>
                        <span className="detail-label">Copy</span>
                        <p>{entry.copyFinal || "No copy yet."}</p>
                      </div>
                      <div>
                        <span className="detail-label">Metrics</span>
                        <p>{entry.metrics || "No metrics yet."}</p>
                      </div>
                      <div>
                        <span className="detail-label">Learning</span>
                        <p>{entry.learning || "No learning yet."}</p>
                      </div>
                    </div>
                    <div className="inline-actions">
                      <label>
                        <span>Estado</span>
                        <select value={entry.state} onChange={(event) => updateCollectionItem<CalendarRecord>("calendar", entry.id, { state: event.target.value as CalendarRecord["state"] })}>
                          {calendarStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <label>
                        <span>Resultado</span>
                        <select value={entry.result} onChange={(event) => updateCollectionItem<CalendarRecord>("calendar", entry.id, { result: event.target.value as CalendarRecord["result"] })}>
                          {resultOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
