import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/overview", label: "Overview" },
  { to: "/ideas", label: "Ideas" },
  { to: "/production", label: "Production" },
  { to: "/calendar", label: "Calendar" },
  { to: "/playbook", label: "Playbook" },
  { to: "/settings", label: "Settings" },
];

export function DashboardLayout() {
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
          <p>Growth engine</p>
          <span>Ideas, production, calendar, workflow, and Firebase seed.</span>
        </section>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Custom Growth System</p>
            <h1>Build audience first, then convert to the RPG fitness app.</h1>
          </div>
          <div className="topbar__status">
            <span className="dot" />
            Firestore seed ready
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
