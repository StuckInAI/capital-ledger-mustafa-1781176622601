import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Debts from '@/pages/Debts';
import Capitals from '@/pages/Capitals';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import { useAppData } from '@/hooks/useAppData';
import { AppDataContext } from '@/lib/context';

export default function App() {
  const appData = useAppData();

  return (
    <AppDataContext.Provider value={appData}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="debts" element={<Debts />} />
          <Route path="capitals" element={<Capitals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AppDataContext.Provider>
  );
}
