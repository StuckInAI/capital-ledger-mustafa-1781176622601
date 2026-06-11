import { useState } from 'react';
import { loginUser, registerUser } from '@/lib/auth';
import { useAppContext } from '@/lib/context';
import { t } from '@/lib/i18n';
import clsx from 'clsx';

type LoginPageProps = { onLogin: () => void };

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { lang, setLang, data } = useAppContext();
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
      // auto login after register
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
        'min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4',
        isUrdu ? 'font-urdu' : ''
      )}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Lang toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {lang === 'en' ? 'اردو' : 'English'}
        </button>
      </div>

      {/* Dark mode indicator (inherits from app) */}
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">₨</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
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
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            {t(lang, 'manageFinances')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
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
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {t(lang, 'username')}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={t(lang, 'enterUsername')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {t(lang, 'password')}
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={t(lang, 'enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  {t(lang, 'confirmPassword')}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={t(lang, 'confirmYourPassword')}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-sm"
            >
              {mode === 'login' ? t(lang, 'signIn') : t(lang, 'createAccount')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            {mode === 'login' ? t(lang, 'noAccount') : t(lang, 'haveAccount')}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {mode === 'login' ? t(lang, 'signUp') : t(lang, 'signIn')}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-6">
          {t(lang, 'localData')}
        </p>
      </div>
    </div>
  );
}
