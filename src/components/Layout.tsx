import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Users, Wallet, BarChart2, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Ledger', icon: ArrowLeftRight },
  { to: '/debts', label: 'Debts', icon: Users },
  { to: '/capitals', label: 'Capital', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">₨</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">CashBook</span>
        </div>
        <span className="text-xs text-gray-400">Finance Manager</span>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-30 shadow-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'nav-link px-2 py-1.5 rounded-xl transition-all',
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={clsx(
                      'p-1.5 rounded-xl transition-all',
                      isActive ? 'bg-blue-50' : ''
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
