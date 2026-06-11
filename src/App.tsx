import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Debts from '@/pages/Debts';
import Capitals from '@/pages/Capitals';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import LoginPage from '@/pages/LoginPage';
import { useAppData } from '@/hooks/useAppData';
import { AppDataContext } from '@/lib/context';
import { getSession, logoutUser } from '@/lib/auth';

export default function App() {
  const appData = useAppData();
  const [session, setSession] = useState(() => getSession());

  const handleLogin = () => setSession(getSession());
  const handleLogout = () => {
    logoutUser();
    setSession(null);
  };

  if (!session) {
    return (
      <AppDataContext.Provider value={appData}>
        <LoginPage onLogin={handleLogin} />
      </AppDataContext.Provider>
    );
  }

  return (
    <AppDataContext.Provider value={appData}>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} currentUser={session.username} />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="debts" element={<Debts />} />
          <Route path="capitals" element={<Capitals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppDataContext.Provider>
  );
}
