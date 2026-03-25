import { FormEvent, useEffect, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  IdeaRecord,
  ProjectRecord,
  formatOptions,
  ideaObjectiveOptions,
  ideaStateOptions,
  pillarOptions,
  priorityOptions,
  viralityOptions,
} from "../data/marketing-data";
import {
  FirestoreItem,
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

function IdeaEditor({
  item,
  businesses,
  projects,
  onCancel,
}: {
  item: FirestoreItem<IdeaRecord>;
  businesses: Array<FirestoreItem<BusinessRecord>>;
  projects: Array<FirestoreItem<ProjectRecord>>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<IdeaRecord>({
    businessId: item.businessId ?? "",
    projectId: item.projectId ?? "",
    title: item.title,
    pillar: item.pillar,
    format: item.format,
    hook: item.hook,
    message: item.message,
    cta: item.cta,
    objective: item.objective,
    virality: item.virality,
    state: item.state,
    priority: item.priority,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateCollectionItem<IdeaRecord>("ideas", item.id, form);
      onCancel();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSave}>
      <label>
        <span>Idea / Titulo</span>
        <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
      </label>
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
        <span>Hook</span>
        <textarea value={form.hook} onChange={(event) => setForm({ ...form, hook: event.target.value })} required />
      </label>
      <label>
        <span>Mensaje</span>
        <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required />
      </label>
      <label>
        <span>CTA</span>
        <input value={form.cta} onChange={(event) => setForm({ ...form, cta: event.target.value })} required />
      </label>
      <div className="form-grid">
        <label>
          <span>Pilar</span>
          <select value={form.pillar} onChange={(event) => setForm({ ...form, pillar: event.target.value as IdeaRecord["pillar"] })}>
            {pillarOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Formato</span>
          <select value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value as IdeaRecord["format"] })}>
            {formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Objetivo</span>
          <select value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value as IdeaRecord["objective"] })}>
            {ideaObjectiveOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Viralidad</span>
          <select value={form.virality} onChange={(event) => setForm({ ...form, virality: event.target.value as IdeaRecord["virality"] })}>
            {viralityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Estado</span>
          <select value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value as IdeaRecord["state"] })}>
            {ideaStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Prioridad</span>
          <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as IdeaRecord["priority"] })}>
            {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <div className="action-row">
        <button className="ghost-button" disabled={saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>
        <button className="subtle-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export function IdeasPage() {
  const { items, loading, error } = useFirestoreCollection<IdeaRecord>("ideas");
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items: projects } = useFirestoreCollection<ProjectRecord>("projects");
  const { activeBusinessId, activeProjectId } = useBusinessContext();
  const [form, setForm] = useState<IdeaRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [pillarFilter, setPillarFilter] = useState<string>("Todos");
  const [stateFilter, setStateFilter] = useState<string>("Todos");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      businessId: current.businessId || activeBusinessId,
      projectId: current.projectId || activeProjectId,
    }));
  }, [activeBusinessId, activeProjectId]);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (!activeBusinessId || item.businessId === activeBusinessId) &&
          (!activeProjectId || item.projectId === activeProjectId) &&
          (pillarFilter === "Todos" || item.pillar === pillarFilter) &&
          (stateFilter === "Todos" || item.state === stateFilter),
      ),
    [items, activeBusinessId, activeProjectId, pillarFilter, stateFilter],
  );

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
        <SectionCard title="New idea" description="Capture new content ideas directly into Firestore.">
          <form className="entry-form" onSubmit={handleSubmit}>
            <label><span>Idea / Titulo</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
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
            <label><span>Hook</span><textarea value={form.hook} onChange={(event) => setForm({ ...form, hook: event.target.value })} required /></label>
            <label><span>Mensaje</span><textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required /></label>
            <label><span>CTA</span><input value={form.cta} onChange={(event) => setForm({ ...form, cta: event.target.value })} required /></label>
            <div className="form-grid">
              <label><span>Pilar</span><select value={form.pillar} onChange={(event) => setForm({ ...form, pillar: event.target.value as IdeaRecord["pillar"] })}>{pillarOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Formato</span><select value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value as IdeaRecord["format"] })}>{formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Objetivo</span><select value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value as IdeaRecord["objective"] })}>{ideaObjectiveOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Viralidad</span><select value={form.virality} onChange={(event) => setForm({ ...form, virality: event.target.value as IdeaRecord["virality"] })}>{viralityOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Estado</span><select value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value as IdeaRecord["state"] })}>{ideaStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Prioridad</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as IdeaRecord["priority"] })}>{priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            </div>
            <button className="ghost-button" disabled={submitting} type="submit">{submitting ? "Saving..." : "Save idea"}</button>
          </form>
        </SectionCard>

        <SectionCard
          title="Ideas database"
          description="Live Firestore list with filters and full editing."
          action={
            <div className="toolbar">
              <select value={pillarFilter} onChange={(event) => setPillarFilter(event.target.value)}>
                <option value="Todos">All pillars</option>
                {pillarOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
                <option value="Todos">All states</option>
                {ideaStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          }
        >
          {loading ? <p className="status-text">Loading ideas...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {filteredItems.map((idea) => (
              <article key={idea.id} className="record-card">
                {editingId === idea.id ? (
                  <IdeaEditor item={idea} businesses={businesses} projects={projects} onCancel={() => setEditingId(null)} />
                ) : (
                  <>
                    <div className="record-card__header">
                      <div>
                        <strong>{idea.title}</strong>
                        <p>{idea.hook}</p>
                      </div>
                      <div className="mini-actions">
                        <button className="subtle-button" onClick={() => setEditingId(idea.id)} type="button">Edit</button>
                        <button className="danger-button" onClick={() => deleteCollectionItem("ideas", idea.id)} type="button">Delete</button>
                      </div>
                    </div>
                    <p>{idea.message}</p>
                    <div className="pill-row">
                      <span className="pill">{idea.pillar}</span>
                      <span className="pill">{idea.format}</span>
                      <span className="pill">{idea.objective}</span>
                      <span className="pill">{idea.priority}</span>
                      <span className="pill">{businesses.find((item) => item.id === idea.businessId)?.name ?? "No business"}</span>
                      <span className="pill">{projects.find((item) => item.id === idea.projectId)?.name ?? "No project"}</span>
                    </div>
                    <div className="inline-actions">
                      <label>
                        <span>Estado</span>
                        <select value={idea.state} onChange={(event) => updateCollectionItem<IdeaRecord>("ideas", idea.id, { state: event.target.value as IdeaRecord["state"] })}>
                          {ideaStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <label>
                        <span>Prioridad</span>
                        <select value={idea.priority} onChange={(event) => updateCollectionItem<IdeaRecord>("ideas", idea.id, { priority: event.target.value as IdeaRecord["priority"] })}>
                          {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
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
