import { SectionCard } from "../components/section-card";
import { hasFirebaseConfig } from "../firebase";

export function SettingsPage() {
  return (
    <div className="page">
      <SectionCard
        title="Project settings"
        description="Environment health for the custom planner."
      >
        <div className="settings-grid">
          <article className="settings-item">
            <span>Firebase status</span>
            <strong>{hasFirebaseConfig() ? "Connected config" : "Missing env values"}</strong>
          </article>
          <article className="settings-item">
            <span>Next step</span>
            <strong>Copy `.env.example` to `.env`, paste Firebase keys, then run the seed.</strong>
          </article>
        </div>
      </SectionCard>
    </div>
  );
}
