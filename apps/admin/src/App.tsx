import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppState } from './data/AppContext';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import PickupsPage from './pages/PickupsPage';
import UsersPage from './pages/UsersPage';
import ESGReportsPage from './pages/ESGReportsPage';

function Gate() {
  const { isAuthenticated } = useAppState();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/pickups" element={<PickupsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ESGReportsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Gate />
      </BrowserRouter>
    </AppProvider>
  );
}
