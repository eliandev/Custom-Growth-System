import { useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  CalendarRecord,
  ProjectRecord,
  contentDistribution,
  weeklyWorkflow,
} from "../data/marketing-data";
import { hasFirebaseConfig } from "../firebase";
import { useFirestoreCollection } from "../lib/firestore-helpers";
import type { IdeaRecord, ProductionRecord } from "../data/marketing-data";
import { seedMarketingPlannerData } from "../services/seed-marketing-planner";

export function OverviewPage() {
  const { activeBusinessId, activeProjectId } = useBusinessContext();
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items: projects } = useFirestoreCollection<ProjectRecord>("projects");
  const { items: liveIdeas } = useFirestoreCollection<IdeaRecord>("ideas");
  const { items: liveProduction } = useFirestoreCollection<ProductionRecord>("production");
  const { items: liveCalendar } = useFirestoreCollection<CalendarRecord>("calendar");
  const [seedStatus, setSeedStatus] = useState<string>("");
  const [isSeeding, setIsSeeding] = useState(false);

  const activeBusiness = businesses.find((item) => item.id === activeBusinessId);
  const activeProject = projects.find((item) => item.id === activeProjectId);

  const kpis = useMemo(() => {
    const visibleIdeas = liveIdeas.filter((item) => (!activeBusinessId || item.businessId === activeBusinessId) && (!activeProjectId || item.projectId === activeProjectId));
    const visibleProduction = liveProduction.filter((item) => (!activeBusinessId || item.businessId === activeBusinessId) && (!activeProjectId || item.projectId === activeProjectId));
    const visibleCalendar = liveCalendar.filter((item) => (!activeBusinessId || item.businessId === activeBusinessId) && (!activeProjectId || item.projectId === activeProjectId));

    return [
      {
        label: "Content ideas",
        value: visibleIdeas.length.toString(),
        detail: activeProject ? activeProject.name : activeBusiness ? activeBusiness.name : "Across all businesses",
      },
      {
        label: "Production pieces",
        value: visibleProduction.length.toString(),
        detail: "Live Firestore pipeline",
      },
      {
        label: "Scheduled posts",
        value: visibleCalendar.length.toString(),
        detail: "Calendarized content",
      },
    ];
  }, [liveIdeas, liveProduction, liveCalendar, activeBusinessId, activeProjectId, activeBusiness, activeProject]);

  async function handleSeed() {
    try {
      setIsSeeding(true);
      setSeedStatus("");
      const result = await seedMarketingPlannerData();
      setSeedStatus(
        `Firestore seeded: ${result.businessesCount} business, ${result.projectsCount} project, ${result.ideasCount} ideas, ${result.productionCount} production items, ${result.calendarCount} calendar entries.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSeedStatus(`Seed failed: ${message}`);
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Marketing Boost Planner</p>
          <h2>The custom operating system for content, consistency, and app conversion.</h2>
          <p className="hero__text">
            This app now supports multiple businesses and multiple projects
            inside each business. Each project keeps its own content plan,
            production queue, publishing calendar, and execution logic.
          </p>
        </div>
        <div className="hero__badge">
          <span>Firestore</span>
          <strong>{hasFirebaseConfig() ? "Config detected" : "Env missing"}</strong>
        </div>
      </section>

      <div className="stats-grid">
        {kpis.map((item) => (
          <article key={item.label} className="metric">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="content-grid">
        <SectionCard
          title="System snapshot"
          description="The core structure requested for the growth engine."
        >
          <ul className="list">
            <li>Businesses collection with strategy and offer plan per account.</li>
            <li>Projects collection nested operationally under each business.</li>
            <li>3 main operational databases: Ideas, Production, and Calendar.</li>
            <li>Weekly workflow, rules, distribution, and funnel playbook.</li>
            <li>One-click Firestore seeding from the custom dashboard.</li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Seed control"
          description="Push the initial system data into Firebase when your env is configured."
          action={
            <button
              className="ghost-button"
              disabled={!hasFirebaseConfig() || isSeeding}
              onClick={handleSeed}
            >
              {isSeeding ? "Seeding..." : "Seed Firestore"}
            </button>
          }
        >
          <div className="seed-box">
            <p>
              This writes the seeded business, project, ideas, production, and
              calendar records for the default Leveling Academy setup.
            </p>
            <span>{seedStatus || "Ready when Firebase credentials are present."}</span>
          </div>
        </SectionCard>
      </div>

      <div className="content-grid">
        <SectionCard
          title="Business plan"
          description="Strategic summary for the active business."
        >
          {activeBusiness ? (
            <div className="detail-grid">
              <div>
                <span className="detail-label">Business</span>
                <p>{activeBusiness.name}</p>
              </div>
              <div>
                <span className="detail-label">Objective</span>
                <p>{activeBusiness.objective}</p>
              </div>
              <div>
                <span className="detail-label">Audience</span>
                <p>{activeBusiness.audience}</p>
              </div>
              <div>
                <span className="detail-label">Offer</span>
                <p>{activeBusiness.offer}</p>
              </div>
            </div>
          ) : (
            <p className="status-text">Select a business to see its plan summary here.</p>
          )}
        </SectionCard>

        <SectionCard title="Project plan" description="Execution summary for the active project.">
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
            <p className="status-text">Select a project to see its plan summary here.</p>
          )}
        </SectionCard>

        <SectionCard
          title="Weekly flow"
          description="Designed to keep consistency without overload."
        >
          <div className="table">
            <div className="table__row table__row--head">
              <span>Day</span>
              <span>Action</span>
              <span>Result</span>
            </div>
            {weeklyWorkflow.map((step) => (
              <div key={step.day} className="table__row">
                <span>{step.day}</span>
                <span>{step.action}</span>
                <span>{step.outcome}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recommended mix"
          description="Distribution to grow from zero before the app launch."
        >
          <ul className="feed">
            {contentDistribution.map((item) => (
              <li key={item.type}>
                {item.type}: {item.percentage}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
