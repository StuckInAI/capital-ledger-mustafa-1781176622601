import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Users, Wallet, BarChart2, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/lib/context';
import { t } from '@/lib/i18n';
import Modal from '@/components/Modal';
import { useState } from 'react';

type LayoutProps = { onLogout: () => void; currentUser: string };

export default function Layout({ onLogout, currentUser }: LayoutProps) {
  const { lang, setLang } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);
  const isUrdu = lang === 'ur';

  const navItems = [
    { to: '/', label: t(lang, 'home'), icon: LayoutDashboard, end: true },
    { to: '/transactions', label: t(lang, 'ledger'), icon: ArrowLeftRight },
    { to: '/debts', label: t(lang, 'debts'), icon: Users },
    { to: '/capitals', label: t(lang, 'capital'), icon: Wallet },
    { to: '/reports', label: t(lang, 'reports'), icon: BarChart2 },
    { to: '/settings', label: t(lang, 'settings'), icon: Settings },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto relative transition-colors"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">₨</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight block">
              Daily Khaata
            </span>
            <span
              className={clsx(
                'text-blue-600 dark:text-blue-400 text-xs font-semibold leading-tight block',
                isUrdu ? 'font-urdu' : ''
              )}
            >
              روزانہ کھاتہ
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {lang === 'en' ? 'اردو' : 'EN'}
          </button>
          {/* User + logout */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
                {currentUser.charAt(0)}
              </span>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
              title={t(lang, 'logout')}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-30 shadow-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'nav-link px-2 py-1.5 rounded-xl transition-all',
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={clsx(
                      'p-1.5 rounded-xl transition-all flex justify-center',
                      isActive ? 'bg-blue-50 dark:bg-blue-900/40' : ''
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <span className={clsx('text-center text-xs leading-tight block', isUrdu ? 'text-[10px]' : '')}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout confirm modal */}
      <Modal open={showLogout} onClose={() => setShowLogout(false)} title={t(lang, 'logout')}>
        <div className="space-y-4 text-center">
          <div className="text-5xl">👋</div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">{t(lang, 'logoutConfirm')}</p>
          <div className="flex gap-3">
            <button onClick={() => setShowLogout(false)} className="btn-secondary flex-1 justify-center">
              {t(lang, 'cancel')}
            </button>
            <button
              onClick={() => { setShowLogout(false); onLogout(); }}
              className="btn-danger flex-1 justify-center"
            >
              {t(lang, 'logout')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
