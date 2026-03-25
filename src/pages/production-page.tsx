import { FormEvent, useEffect, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  IdeaRecord,
  ProjectRecord,
  ProductionRecord,
  formatOptions,
  productionStateOptions,
} from "../data/marketing-data";
import {
  FirestoreItem,
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

function ProductionEditor({
  item,
  businesses,
  projects,
  ideas,
  onCancel,
}: {
  item: FirestoreItem<ProductionRecord>;
  businesses: Array<FirestoreItem<BusinessRecord>>;
  projects: Array<FirestoreItem<ProjectRecord>>;
  ideas: Array<FirestoreItem<IdeaRecord>>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductionRecord>({
    businessId: item.businessId ?? "",
    projectId: item.projectId ?? "",
    piece: item.piece,
    ideaTitle: item.ideaTitle,
    targetDate: item.targetDate,
    format: item.format,
    productionState: item.productionState,
    owner: item.owner,
    notes: item.notes,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateCollectionItem<ProductionRecord>("production", item.id, form);
      onCancel();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSave}>
      <label><span>Pieza</span><input value={form.piece} onChange={(event) => setForm({ ...form, piece: event.target.value })} required /></label>
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
        <span>Idea relacionada</span>
        <select value={form.ideaTitle} onChange={(event) => setForm({ ...form, ideaTitle: event.target.value })} required>
          <option value="">Select an idea</option>
          {ideas.filter((idea) => !form.projectId || idea.projectId === form.projectId).map((idea) => <option key={idea.id} value={idea.title}>{idea.title}</option>)}
        </select>
      </label>
      <div className="form-grid">
        <label><span>Fecha objetivo</span><input type="date" value={form.targetDate} onChange={(event) => setForm({ ...form, targetDate: event.target.value })} required /></label>
        <label><span>Formato</span><select value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value as ProductionRecord["format"] })}>{formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label><span>Estado</span><select value={form.productionState} onChange={(event) => setForm({ ...form, productionState: event.target.value as ProductionRecord["productionState"] })}>{productionStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label><span>Responsable</span><input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} required /></label>
      </div>
      <label><span>Observaciones</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
      <div className="action-row">
        <button className="ghost-button" disabled={saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>
        <button className="subtle-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export function ProductionPage() {
  const { items, loading, error } = useFirestoreCollection<ProductionRecord>("production");
  const { items: ideas } = useFirestoreCollection<IdeaRecord>("ideas");
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items: projects } = useFirestoreCollection<ProjectRecord>("projects");
  const { activeBusinessId, activeProjectId } = useBusinessContext();
  const [form, setForm] = useState<ProductionRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [stateFilter, setStateFilter] = useState<string>("Todos");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      businessId: current.businessId || activeBusinessId,
      projectId: current.projectId || activeProjectId,
    }));
  }, [activeBusinessId, activeProjectId]);

  const sortedIdeas = useMemo(
    () =>
      [...ideas]
        .filter((item) => !activeBusinessId || item.businessId === activeBusinessId)
        .filter((item) => !activeProjectId || item.projectId === activeProjectId)
        .sort((left, right) => left.title.localeCompare(right.title)),
    [ideas, activeBusinessId, activeProjectId],
  );

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (!activeBusinessId || item.businessId === activeBusinessId) &&
          (!activeProjectId || item.projectId === activeProjectId) &&
          (stateFilter === "Todos" || item.productionState === stateFilter),
      ),
    [items, activeBusinessId, activeProjectId, stateFilter],
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
        <SectionCard title="New production item" description="Create execution tasks and attach them to an existing idea.">
          <form className="entry-form" onSubmit={handleSubmit}>
            <label><span>Pieza</span><input value={form.piece} onChange={(event) => setForm({ ...form, piece: event.target.value })} required /></label>
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
              <span>Idea relacionada</span>
              <select value={form.ideaTitle} onChange={(event) => setForm({ ...form, ideaTitle: event.target.value })} required>
                <option value="">Select an idea</option>
                {sortedIdeas.map((idea) => <option key={idea.id} value={idea.title}>{idea.title}</option>)}
              </select>
            </label>
            <div className="form-grid">
              <label><span>Fecha objetivo</span><input type="date" value={form.targetDate} onChange={(event) => setForm({ ...form, targetDate: event.target.value })} required /></label>
              <label><span>Formato</span><select value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value as ProductionRecord["format"] })}>{formatOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Estado</span><select value={form.productionState} onChange={(event) => setForm({ ...form, productionState: event.target.value as ProductionRecord["productionState"] })}>{productionStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label><span>Responsable</span><input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} required /></label>
            </div>
            <label><span>Observaciones</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            <button className="ghost-button" disabled={submitting} type="submit">{submitting ? "Saving..." : "Save production item"}</button>
          </form>
        </SectionCard>

        <SectionCard
          title="Production pipeline"
          description="Live production queue with state management and editing."
          action={
            <div className="toolbar">
              <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
                <option value="Todos">All states</option>
                {productionStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          }
        >
          {loading ? <p className="status-text">Loading production...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {filteredItems.map((item) => (
              <article key={item.id} className="record-card">
                {editingId === item.id ? (
                  <ProductionEditor item={item} businesses={businesses} projects={projects} ideas={sortedIdeas} onCancel={() => setEditingId(null)} />
                ) : (
                  <>
                    <div className="record-card__header">
                      <div>
                        <strong>{item.piece}</strong>
                        <p>{item.ideaTitle || "No linked idea"}</p>
                      </div>
                      <div className="mini-actions">
                        <button className="subtle-button" onClick={() => setEditingId(item.id)} type="button">Edit</button>
                        <button className="danger-button" onClick={() => deleteCollectionItem("production", item.id)} type="button">Delete</button>
                      </div>
                    </div>
                    <div className="pill-row">
                      <span className="pill">{item.format}</span>
                      <span className="pill">{item.targetDate}</span>
                      <span className="pill">{item.owner}</span>
                      <span className="pill">{businesses.find((business) => business.id === item.businessId)?.name ?? "No business"}</span>
                      <span className="pill">{projects.find((project) => project.id === item.projectId)?.name ?? "No project"}</span>
                    </div>
                    <p>{item.notes}</p>
                    <div className="inline-actions single-column">
                      <label>
                        <span>Estado</span>
                        <select value={item.productionState} onChange={(event) => updateCollectionItem<ProductionRecord>("production", item.id, { productionState: event.target.value as ProductionRecord["productionState"] })}>
                          {productionStateOptions.map((option) => <option key={option} value={option}>{option}</option>)}
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
