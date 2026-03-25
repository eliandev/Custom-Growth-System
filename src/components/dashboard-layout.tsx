import { NavLink, Outlet, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
  const currentPage =
    navigation.find((item) => item.to === location.pathname)?.label ?? "Overview";

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__badge" aria-hidden="true">
            <svg viewBox="0 0 29 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29 17L14.5 0L0 17H29Z" fill="currentColor" />
              <path d="M29 42L14.5 27L0 42H29Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p>Marketing Growth</p>
            <span>System</span>
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
          <p>Context</p>
          <span>{activeBusiness ? activeBusiness.name : "All businesses"}</span>
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
          <div className="sidebar-meta">
            <p>{activeProject ? activeProject.name : "All projects"}</p>
            <span>{user?.email ?? "No session"}</span>
          </div>
          <button className="subtle-button sidebar-button" onClick={() => void logout()} type="button">
            Logout
          </button>
        </section>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>{currentPage}</h1>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
