import { useMemo, useState } from "react";
import { SectionCard } from "../components/section-card";
import { useBusinessContext } from "../context/business-context";
import {
  BusinessRecord,
  CalendarRecord,
  ProjectRecord,
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

  const scopedData = useMemo(() => {
    const ideas = liveIdeas.filter(
      (item) =>
        (!activeBusinessId || item.businessId === activeBusinessId) &&
        (!activeProjectId || item.projectId === activeProjectId),
    );
    const production = liveProduction.filter(
      (item) =>
        (!activeBusinessId || item.businessId === activeBusinessId) &&
        (!activeProjectId || item.projectId === activeProjectId),
    );
    const calendar = liveCalendar.filter(
      (item) =>
        (!activeBusinessId || item.businessId === activeBusinessId) &&
        (!activeProjectId || item.projectId === activeProjectId),
    );

    return { ideas, production, calendar };
  }, [liveIdeas, liveProduction, liveCalendar, activeBusinessId, activeProjectId]);

  const dashboardStats = useMemo(() => {
    const ideasReady = scopedData.ideas.filter((item) => item.state === "Seleccionado").length;
    const ideasInProduction = scopedData.ideas.filter(
      (item) => item.state === "En producción",
    ).length;
    const scheduledPosts = scopedData.calendar.filter(
      (item) => item.state === "Planificado" || item.state === "Programado",
    ).length;
    const publishedPosts = scopedData.calendar.filter(
      (item) => item.state === "Publicado",
    ).length;
    const conversionContent = scopedData.ideas.filter(
      (item) => item.objective === "Conversión",
    ).length;
    const guardadosContent = scopedData.ideas.filter(
      (item) => item.objective === "Guardados",
    ).length;

    return [
      {
        label: "Ideas ready",
        value: ideasReady.toString(),
        detail: "Selected for execution",
      },
      {
        label: "In production",
        value: ideasInProduction.toString(),
        detail: "Content moving right now",
      },
      {
        label: "Scheduled",
        value: scheduledPosts.toString(),
        detail: "Posts queued to publish",
      },
      {
        label: "Published",
        value: publishedPosts.toString(),
        detail: "Already shipped",
      },
      {
        label: "Conversion pieces",
        value: conversionContent.toString(),
        detail: "Offer-facing content",
      },
      {
        label: "Save-focused",
        value: guardadosContent.toString(),
        detail: "Retention-heavy content",
      },
    ];
  }, [scopedData]);

  const productionBreakdown = useMemo(
    () => [
      { label: "Guion", count: scopedData.production.filter((item) => item.productionState === "Guion").length },
      { label: "Diseño", count: scopedData.production.filter((item) => item.productionState === "Diseño").length },
      { label: "Grabación", count: scopedData.production.filter((item) => item.productionState === "Grabación").length },
      { label: "Edición", count: scopedData.production.filter((item) => item.productionState === "Edición").length },
      { label: "Programado", count: scopedData.production.filter((item) => item.productionState === "Programado").length },
      { label: "Publicado", count: scopedData.production.filter((item) => item.productionState === "Publicado").length },
    ],
    [scopedData.production],
  );

  const upcomingCalendar = useMemo(
    () =>
      [...scopedData.calendar]
        .sort((left, right) => left.publicationDate.localeCompare(right.publicationDate))
        .slice(0, 5),
    [scopedData.calendar],
  );

  const topIdeaBuckets = useMemo(
    () => [
      {
        label: "Alcance",
        count: scopedData.ideas.filter((item) => item.objective === "Alcance").length,
      },
      {
        label: "Engagement",
        count: scopedData.ideas.filter((item) => item.objective === "Engagement").length,
      },
      {
        label: "Comunidad",
        count: scopedData.ideas.filter((item) => item.objective === "Comunidad").length,
      },
      {
        label: "Conversión",
        count: scopedData.ideas.filter((item) => item.objective === "Conversión").length,
      },
    ],
    [scopedData.ideas],
  );

  async function handleSeed() {
    try {
      setIsSeeding(true);
      setSeedStatus("");
      const result = await seedMarketingPlannerData();
      setSeedStatus(
        `Seeded ${result.businessesCount} business, ${result.projectsCount} project, ${result.ideasCount} ideas, ${result.productionCount} production items, ${result.calendarCount} calendar entries.`,
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
      <div className="dashboard-banner">
        <div className="dashboard-banner__copy">
          <p className="eyebrow">Dashboard</p>
          <h2>{activeProject?.name ?? activeBusiness?.name ?? "Portfolio view"}</h2>
          <p>
            {activeProject
              ? activeProject.objective
              : activeBusiness
                ? activeBusiness.objective
                : "Select a business or project to focus the dashboard."}
          </p>
        </div>
        <div className="dashboard-banner__meta">
          <span className="pill">{activeBusiness?.name ?? "All businesses"}</span>
          <span className="pill">{activeProject?.name ?? "All projects"}</span>
          <span className="pill">
            {hasFirebaseConfig() ? "Firebase connected" : "Firebase missing env"}
          </span>
        </div>
      </div>

      <div className="kpi-grid">
        {dashboardStats.map((item) => (
          <article key={item.label} className="metric metric--compact">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="content-grid dashboard-grid">
        <SectionCard title="Production pipeline" description="Current execution load by stage.">
          <div className="stack-list">
            {productionBreakdown.map((item) => (
              <div key={item.label} className="stack-item">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming posts" description="Next items in the publishing queue.">
          {upcomingCalendar.length > 0 ? (
            <div className="stack-list">
              {upcomingCalendar.map((entry) => (
                <div key={entry.id} className="stack-item stack-item--detail">
                  <div>
                    <strong>{entry.publication}</strong>
                    <p>{entry.publicationDate || "No date"}</p>
                  </div>
                  <span className="pill">{entry.state}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="status-text">No calendar items in this scope yet.</p>
          )}
        </SectionCard>

        <SectionCard title="Idea mix" description="How your current backlog is distributed by objective.">
          <div className="stack-list">
            {topIdeaBuckets.map((item) => (
              <div key={item.label} className="stack-item">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Seed data"
          description="Recreate the default Leveling Academy business and project."
          action={
            <button
              className="ghost-button"
              disabled={!hasFirebaseConfig() || isSeeding}
              onClick={handleSeed}
            >
              {isSeeding ? "Seeding..." : "Run seed"}
            </button>
          }
        >
          <p className="status-text">
            {seedStatus || "Use only when you want to restore the default starter records."}
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
