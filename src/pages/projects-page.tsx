import { FormEvent, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  ProjectRecord,
  businessStatusOptions,
} from "../data/marketing-data";
import {
  FirestoreItem,
  createCollectionItem,
  deleteCollectionItem,
  updateCollectionItem,
  useFirestoreCollection,
} from "../lib/firestore-helpers";

const initialForm: ProjectRecord = {
  businessId: "",
  name: "",
  objective: "",
  offer: "",
  audience: "",
  channels: "",
  status: "Planeacion",
  notes: "",
};

function ProjectEditor({
  item,
  businesses,
  onCancel,
}: {
  item: FirestoreItem<ProjectRecord>;
  businesses: Array<FirestoreItem<BusinessRecord>>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProjectRecord>({
    businessId: item.businessId,
    name: item.name,
    objective: item.objective,
    offer: item.offer,
    audience: item.audience,
    channels: item.channels,
    status: item.status,
    notes: item.notes,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateCollectionItem<ProjectRecord>("projects", item.id, form);
      onCancel();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSave}>
      <label>
        <span>Business</span>
        <select
          value={form.businessId}
          onChange={(event) => setForm({ ...form, businessId: event.target.value })}
          required
        >
          <option value="">Select a business</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
            </option>
          ))}
        </select>
      </label>
      <label><span>Project name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
      <label><span>Objective</span><textarea value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })} required /></label>
      <label><span>Offer</span><textarea value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })} required /></label>
      <label><span>Audience</span><textarea value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} required /></label>
      <div className="form-grid">
        <label><span>Channels</span><input value={form.channels} onChange={(event) => setForm({ ...form, channels: event.target.value })} required /></label>
        <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectRecord["status"] })}>{businessStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      </div>
      <label><span>Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
      <div className="action-row">
        <button className="ghost-button" disabled={saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>
        <button className="subtle-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export function ProjectsPage() {
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items, loading, error } = useFirestoreCollection<ProjectRecord>("projects");
  const { activeBusinessId, activeProjectId, setActiveProjectId } = useBusinessContext();
  const [form, setForm] = useState<ProjectRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () => items.filter((item) => !activeBusinessId || item.businessId === activeBusinessId),
    [items, activeBusinessId],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createCollectionItem("projects", {
        ...form,
        businessId: form.businessId || activeBusinessId,
      });
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="content-grid form-layout">
        <SectionCard title="New project" description="Create campaigns or projects inside a business.">
          <form className="entry-form" onSubmit={handleSubmit}>
            <label>
              <span>Business</span>
              <select
                value={form.businessId || activeBusinessId}
                onChange={(event) => setForm({ ...form, businessId: event.target.value })}
                required
              >
                <option value="">Select a business</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </label>
            <label><span>Project name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label><span>Objective</span><textarea value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })} required /></label>
            <label><span>Offer</span><textarea value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })} required /></label>
            <label><span>Audience</span><textarea value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} required /></label>
            <div className="form-grid">
              <label><span>Channels</span><input value={form.channels} onChange={(event) => setForm({ ...form, channels: event.target.value })} required /></label>
              <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectRecord["status"] })}>{businessStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            </div>
            <label><span>Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            <button className="ghost-button" disabled={submitting} type="submit">{submitting ? "Saving..." : "Save project"}</button>
          </form>
        </SectionCard>

        <SectionCard title="Projects" description="Projects live inside businesses and hold their own execution plan.">
          {loading ? <p className="status-text">Loading projects...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          <div className="record-list">
            {visibleProjects.map((item) => (
              <article key={item.id} className="record-card">
                {editingId === item.id ? (
                  <ProjectEditor item={item} businesses={businesses} onCancel={() => setEditingId(null)} />
                ) : (
                  <>
                    <div className="record-card__header">
                      <div>
                        <strong>{item.name}</strong>
                        <p>{businesses.find((business) => business.id === item.businessId)?.name ?? "Unknown business"}</p>
                      </div>
                      <div className="mini-actions">
                        <button className="subtle-button" onClick={() => setActiveProjectId(item.id)} type="button">
                          {activeProjectId === item.id ? "Selected" : "Select"}
                        </button>
                        <button className="subtle-button" onClick={() => setEditingId(item.id)} type="button">Edit</button>
                        <button className="danger-button" onClick={() => deleteCollectionItem("projects", item.id)} type="button">Delete</button>
                      </div>
                    </div>
                    <div className="pill-row">
                      <span className="pill">{item.status}</span>
                      <span className="pill">{item.channels}</span>
                    </div>
                    <div className="detail-grid">
                      <div>
                        <span className="detail-label">Objective</span>
                        <p>{item.objective}</p>
                      </div>
                      <div>
                        <span className="detail-label">Audience</span>
                        <p>{item.audience}</p>
                      </div>
                      <div>
                        <span className="detail-label">Offer</span>
                        <p>{item.offer}</p>
                      </div>
                      <div>
                        <span className="detail-label">Notes</span>
                        <p>{item.notes || "No notes yet."}</p>
                      </div>
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
