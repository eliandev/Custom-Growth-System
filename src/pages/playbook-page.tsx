import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  ProjectRecord,
  funnelStages,
  systemRules,
} from "../data/marketing-data";
import { useFirestoreCollection } from "../lib/firestore-helpers";

export function PlaybookPage() {
  const { activeBusinessId, activeProjectId } = useBusinessContext();
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items: projects } = useFirestoreCollection<ProjectRecord>("projects");
  const activeBusiness = businesses.find((item) => item.id === activeBusinessId);
  const activeProject = projects.find((item) => item.id === activeProjectId);

  return (
    <div className="page">
      <div className="content-grid">
        <SectionCard
          title="Business strategy"
          description="The current acquisition and conversion logic for the selected business."
        >
          {activeBusiness ? (
            <div className="detail-grid">
              <div>
                <span className="detail-label">Acquisition</span>
                <p>{activeBusiness.acquisitionPlan}</p>
              </div>
              <div>
                <span className="detail-label">Conversion</span>
                <p>{activeBusiness.conversionPlan}</p>
              </div>
              <div>
                <span className="detail-label">Channels</span>
                <p>{activeBusiness.channels}</p>
              </div>
            </div>
          ) : (
            <p className="status-text">Select a business to see its strategy here.</p>
          )}
        </SectionCard>

        <SectionCard
          title="Project strategy"
          description="The active project's execution frame and communication angle."
        >
          {activeProject ? (
            <div className="detail-grid">
              <div>
                <span className="detail-label">Project</span>
                <p>{activeProject.name}</p>
              </div>
              <div>
                <span className="detail-label">Objective</span>
                <p>{activeProject.objective}</p>
              </div>
              <div>
                <span className="detail-label">Audience</span>
                <p>{activeProject.audience}</p>
              </div>
              <div>
                <span className="detail-label">Offer</span>
                <p>{activeProject.offer}</p>
              </div>
            </div>
          ) : (
            <p className="status-text">Select a project to see its strategy here.</p>
          )}
        </SectionCard>

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
