import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useBusinessContext } from "../context/business-context";
import type { BusinessRecord, ProjectRecord } from "../data/marketing-data";
import { useFirestoreCollection } from "../lib/firestore-helpers";

const navigation = [
  { to: "/overview", label: "Overview" },
  { to: "/businesses", label: "Businesses" },
  { to: "/projects", label: "Projects" },
  { to: "/ideas", label: "Ideas" },
  { to: "/production", label: "Production" },
  { to: "/calendar", label: "Calendar" },
  { to: "/playbook", label: "Playbook" },
  { to: "/settings", label: "Settings" },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { activeBusinessId, setActiveBusinessId, activeProjectId, setActiveProjectId } =
    useBusinessContext();
  const { items: businesses } = useFirestoreCollection<BusinessRecord>("businesses");
  const { items: projects } = useFirestoreCollection<ProjectRecord>("projects");
  const activeBusiness = businesses.find((item) => item.id === activeBusinessId);
  const visibleProjects = projects.filter(
    (item) => !activeBusinessId || item.businessId === activeBusinessId,
  );
  const activeProject = visibleProjects.find((item) => item.id === activeProjectId);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__badge">MB</div>
          <div>
            <p>Marketing Boost</p>
            <span>Planner</span>
          </div>
        </div>

        <nav className="nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <section className="sidebar-card">
          <p>Portfolio planner</p>
          <span>Businesses, projects, execution systems, and Firebase data.</span>
          <label className="business-switcher">
            <span>Active business</span>
            <select
              value={activeBusinessId}
              onChange={(event) => setActiveBusinessId(event.target.value)}
            >
              <option value="">All businesses</option>
              {businesses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="business-switcher">
            <span>Active project</span>
            <select
              value={activeProjectId}
              onChange={(event) => setActiveProjectId(event.target.value)}
            >
              <option value="">All projects</option>
              {visibleProjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </section>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Custom Growth System</p>
            <h1>Operate multiple businesses and multiple projects from one planner.</h1>
            <p className="active-business-label">
              {activeBusiness ? `Working on: ${activeBusiness.name}` : "Working on: all businesses"}
            </p>
            <p className="active-business-label">
              {activeProject ? `Project: ${activeProject.name}` : "Project: all projects"}
            </p>
            <p className="active-business-label">
              {user?.email ? `Signed in as: ${user.email}` : "Signed in"}
            </p>
          </div>
          <div className="topbar-actions">
            <div className="topbar__status">
              <span className="dot" />
              Firestore seed ready
            </div>
            <button className="subtle-button" onClick={() => void logout()} type="button">
              Logout
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
