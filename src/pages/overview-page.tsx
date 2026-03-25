import { useState } from "react";
import { SectionCard } from "../components/section-card";
import {
  calendarEntries,
  contentDistribution,
  ideas,
  productionItems,
  weeklyWorkflow,
} from "../data/marketing-data";
import { hasFirebaseConfig } from "../firebase";
import { seedMarketingPlannerData } from "../services/seed-marketing-planner";

const kpis = [
  {
    label: "Content ideas",
    value: ideas.length.toString(),
    detail: "Loaded for the 4 content pillars",
  },
  {
    label: "Production pieces",
    value: productionItems.length.toString(),
    detail: "Initial pipeline already mapped",
  },
  {
    label: "Scheduled posts",
    value: calendarEntries.length.toString(),
    detail: "Base calendar for the first wave",
  },
];

export function OverviewPage() {
  const [seedStatus, setSeedStatus] = useState<string>("");
  const [isSeeding, setIsSeeding] = useState(false);

  async function handleSeed() {
    try {
      setIsSeeding(true);
      setSeedStatus("");
      const result = await seedMarketingPlannerData();
      setSeedStatus(
        `Firestore seeded: ${result.ideasCount} ideas, ${result.productionCount} production items, ${result.calendarCount} calendar entries.`,
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
            This app replaces the Notion setup with a custom dashboard for
            ideation, production, publishing, and weekly execution. The initial
            dataset is ready to push into Firestore in one shot.
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
            <li>3 main databases: Ideas, Production, and Calendar.</li>
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
              This writes `ideas`, `production`, and `calendar` collections with
              the starter dataset you defined.
            </p>
            <span>{seedStatus || "Ready when Firebase credentials are present."}</span>
          </div>
        </SectionCard>
      </div>

      <div className="content-grid">
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
