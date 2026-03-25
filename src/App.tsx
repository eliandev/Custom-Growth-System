import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/dashboard-layout";
import { CalendarPage } from "./pages/calendar-page";
import { IdeasPage } from "./pages/ideas-page";
import { OverviewPage } from "./pages/overview-page";
import { PlaybookPage } from "./pages/playbook-page";
import { ProductionPage } from "./pages/production-page";
import { SettingsPage } from "./pages/settings-page";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/playbook" element={<PlaybookPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
