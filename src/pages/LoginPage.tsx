import { useState } from 'react';
import { loginUser, registerUser } from '@/lib/auth';
import { useAppContext } from '@/lib/context';
import { t } from '@/lib/i18n';
import clsx from 'clsx';
import Logo from '@/components/Logo';

type LoginPageProps = { onLogin: () => void };

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { lang, setLang } = useAppContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');

  const isUrdu = lang === 'ur';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) return;

    if (mode === 'register') {
      if (password !== confirmPw) {
        setError(t(lang, 'passwordMismatch'));
        return;
      }
      const result = registerUser(username.trim(), password);
      if (!result.success) {
        setError(t(lang, (result.error as any) || 'userExists'));
        return;
      }
      loginUser(username.trim(), password);
      onLogin();
    } else {
      const result = loginUser(username.trim(), password);
      if (!result.success) {
        setError(t(lang, (result.error as any) || 'wrongPassword'));
        return;
      }
      onLogin();
    }
  };

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden',
        'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
        'dark:from-gray-950 dark:via-gray-900 dark:to-blue-950',
        isUrdu ? 'font-urdu' : ''
      )}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-48 h-48 bg-amber-100 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-30 pointer-events-none" />

      {/* Lang toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          {lang === 'en' ? 'اردو' : 'English'}
        </button>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          {/* Big logo */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-blue-500/20 dark:bg-blue-400/20 blur-xl scale-110 pointer-events-none" />
              <Logo size="lg" className="relative" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Daily Khaata
          </h1>
          <p
            className={clsx(
              'text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5',
              isUrdu ? 'font-urdu' : ''
            )}
          >
            روزانہ کھاتہ
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
            {t(lang, 'manageFinances')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/60 dark:border-gray-700/60">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={clsx(
                'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                mode === 'login'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {t(lang, 'signIn')}
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={clsx(
                'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                mode === 'register'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {t(lang, 'signUp')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                {t(lang, 'username')}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder={t(lang, 'enterUsername')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                {t(lang, 'password')}
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder={t(lang, 'enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  {t(lang, 'confirmPassword')}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder={t(lang, 'confirmYourPassword')}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-red-500 text-base">⚠️</span>
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-sm mt-2"
            >
              {mode === 'login' ? t(lang, 'signIn') : t(lang, 'createAccount')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
            {mode === 'login' ? t(lang, 'noAccount') : t(lang, 'haveAccount')}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {mode === 'login' ? t(lang, 'signUp') : t(lang, 'signIn')}
            </button>
          </p>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {t(lang, 'localData')}
          </p>
        </div>
      </div>
    </div>
  );
}
