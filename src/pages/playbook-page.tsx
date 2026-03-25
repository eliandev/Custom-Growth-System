import { SectionCard } from "../components/section-card";
import { funnelStages, systemRules } from "../data/marketing-data";

export function PlaybookPage() {
  return (
    <div className="page">
      <div className="content-grid">
        <SectionCard
          title="System rules"
          description="Guardrails so the machine actually performs."
        >
          <ul className="feed">
            {systemRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Content funnel"
          description="How the audience should move from discovery to app demand."
        >
          <div className="table">
            <div className="table__row table__row--head">
              <span>Etapa</span>
              <span>Contenido</span>
              <span>Objetivo</span>
            </div>
            {funnelStages.map((item) => (
              <div key={item.stage} className="table__row">
                <span>{item.stage}</span>
                <span>{item.content}</span>
                <span>{item.objective}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
