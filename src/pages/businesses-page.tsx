import { FormEvent, useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  businessStatusOptions,
} from "../data/marketing-data";
import {
  FirestoreItem,
  createCollectionItem,
  deleteCollectionItem,
  updateCollectionItem,
  useFirestoreCollection,
} from "../lib/firestore-helpers";

const initialForm: BusinessRecord = {
  name: "",
  niche: "",
  objective: "",
  audience: "",
  offer: "",
  acquisitionPlan: "",
  conversionPlan: "",
  channels: "",
  status: "Planeacion",
  notes: "",
};

function BusinessEditor({
  item,
  onCancel,
}: {
  item: FirestoreItem<BusinessRecord>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BusinessRecord>({
    name: item.name,
    niche: item.niche,
    objective: item.objective,
    audience: item.audience,
    offer: item.offer,
    acquisitionPlan: item.acquisitionPlan,
    conversionPlan: item.conversionPlan,
    channels: item.channels,
    status: item.status,
    notes: item.notes,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateCollectionItem<BusinessRecord>("businesses", item.id, form);
      onCancel();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSave}>
      <label><span>Business name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
      <label><span>Niche</span><input value={form.niche} onChange={(event) => setForm({ ...form, niche: event.target.value })} required /></label>
      <label><span>Objective</span><textarea value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })} required /></label>
      <label><span>Audience</span><textarea value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} required /></label>
      <label><span>Offer</span><textarea value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })} required /></label>
      <label><span>Acquisition plan</span><textarea value={form.acquisitionPlan} onChange={(event) => setForm({ ...form, acquisitionPlan: event.target.value })} required /></label>
      <label><span>Conversion plan</span><textarea value={form.conversionPlan} onChange={(event) => setForm({ ...form, conversionPlan: event.target.value })} required /></label>
      <label><span>Channels</span><input value={form.channels} onChange={(event) => setForm({ ...form, channels: event.target.value })} required /></label>
      <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BusinessRecord["status"] })}>{businessStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      <label><span>Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
      <div className="action-row">
        <button className="ghost-button" disabled={saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>
        <button className="subtle-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export function BusinessesPage() {
  const { items, loading, error } = useFirestoreCollection<BusinessRecord>("businesses");
  const { activeBusinessId, setActiveBusinessId } = useBusinessContext();
  const [form, setForm] = useState<BusinessRecord>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeBusiness = useMemo(
    () => items.find((item) => item.id === activeBusinessId),
    [items, activeBusinessId],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createCollectionItem("businesses", form);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="content-grid form-layout">
        <SectionCard title="New business" description="Create a new business and define the full growth plan for it.">
          <form className="entry-form" onSubmit={handleSubmit}>
            <label><span>Business name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label><span>Niche</span><input value={form.niche} onChange={(event) => setForm({ ...form, niche: event.target.value })} required /></label>
            <label><span>Objective</span><textarea value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })} required /></label>
            <label><span>Audience</span><textarea value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} required /></label>
            <label><span>Offer</span><textarea value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })} required /></label>
            <label><span>Acquisition plan</span><textarea value={form.acquisitionPlan} onChange={(event) => setForm({ ...form, acquisitionPlan: event.target.value })} required /></label>
            <label><span>Conversion plan</span><textarea value={form.conversionPlan} onChange={(event) => setForm({ ...form, conversionPlan: event.target.value })} required /></label>
            <div className="form-grid">
              <label><span>Channels</span><input value={form.channels} onChange={(event) => setForm({ ...form, channels: event.target.value })} required /></label>
              <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BusinessRecord["status"] })}>{businessStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            </div>
            <label><span>Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            <button className="ghost-button" disabled={submitting} type="submit">{submitting ? "Saving..." : "Save business"}</button>
          </form>
        </SectionCard>

        <SectionCard
          title="Business plans"
          description="Each business keeps its own strategy, audience, offer, and execution plan."
        >
          {loading ? <p className="status-text">Loading businesses...</p> : null}
          {error ? <p className="status-text">{error}</p> : null}
          {activeBusiness ? <p className="status-text">Active business: {activeBusiness.name}</p> : null}
          <div className="record-list">
            {items.map((item) => (
              <article key={item.id} className="record-card">
                {editingId === item.id ? (
                  <BusinessEditor item={item} onCancel={() => setEditingId(null)} />
                ) : (
                  <>
                    <div className="record-card__header">
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.niche}</p>
                      </div>
                      <div className="mini-actions">
                        <button className="subtle-button" onClick={() => setActiveBusinessId(item.id)} type="button">
                          {activeBusinessId === item.id ? "Selected" : "Select"}
                        </button>
                        <button className="subtle-button" onClick={() => setEditingId(item.id)} type="button">Edit</button>
                        <button className="danger-button" onClick={() => deleteCollectionItem("businesses", item.id)} type="button">Delete</button>
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
                        <span className="detail-label">Acquisition</span>
                        <p>{item.acquisitionPlan}</p>
                      </div>
                      <div>
                        <span className="detail-label">Conversion</span>
                        <p>{item.conversionPlan}</p>
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
