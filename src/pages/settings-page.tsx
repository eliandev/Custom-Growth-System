import { useAuth } from "../context/auth-context";
import { SectionCard } from "../components/section-card";
import { hasFirebaseConfig } from "../firebase";

export function SettingsPage() {
  const { user } = useAuth();

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
            <strong>Create admin users in Firebase Auth and protect Firestore with auth-based rules.</strong>
          </article>
          <article className="settings-item">
            <span>Signed user</span>
            <strong>{user?.email ?? "No active session"}</strong>
          </article>
        </div>
      </SectionCard>
    </div>
  );
}
