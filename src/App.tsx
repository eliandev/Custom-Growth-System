import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/dashboard-layout";
import { ProtectedRoute } from "./components/protected-route";
import { BusinessesPage } from "./pages/businesses-page";
import { CalendarPage } from "./pages/calendar-page";
import { IdeasPage } from "./pages/ideas-page";
import { LoginPage } from "./pages/login-page";
import { OverviewPage } from "./pages/overview-page";
import { PlaybookPage } from "./pages/playbook-page";
import { ProjectsPage } from "./pages/projects-page";
import { ProductionPage } from "./pages/production-page";
import { SettingsPage } from "./pages/settings-page";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/playbook" element={<PlaybookPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
