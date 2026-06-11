import { useState, useRef } from 'react';
import {
  User,
  Globe,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  CheckCircle,
  LogIn,
  Moon,
  Sun,
} from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { exportToJSON, importFromJSON } from '@/lib/storage';
import Modal from '@/components/Modal';
import clsx from 'clsx';

const CURRENCIES = [
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal' },
  { code: 'BDT', symbol: '৳', label: 'Bangladeshi Taka' },
];

export default function Settings() {
  const { data, updateSettings, replaceAllData } = useAppContext();
  const [showCurrency, setShowCurrency] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showGoogleInfo, setShowGoogleInfo] = useState(false);
  const [userName, setUserName] = useState(data.userName);
  const [importError, setImportError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJSON(file);
      replaceAllData(imported);
      setImportError('');
      alert('Data imported successfully!');
    } catch (err: any) {
      setImportError(err.message);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClearAll = () => {
    replaceAllData({
      transactions: [],
      debts: [],
      capitals: [],
      budgets: [],
      currency: data.currency,
      userName: data.userName,
      googleConnected: false,
      darkMode: data.darkMode,
    });
    setShowClearConfirm(false);
  };

  const handleGoogleConnect = () => {
    updateSettings({ googleConnected: true });
    setShowGoogleInfo(false);
  };

  const handleGoogleDisconnect = () => {
    updateSettings({ googleConnected: false });
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !data.darkMode });
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === data.currency) || CURRENCIES[0];

  return (
    <div className="px-4 py-5 space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      {/* Profile */}
      <section className="card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Profile</p>
        </div>
        <button
          onClick={() => setShowProfile(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
            <User size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.userName || 'Set your name'}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Profile name</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
        </button>
      </section>

      {/* Appearance */}
      <section className="card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Appearance</p>
        </div>
        <div className="px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30">
            {data.darkMode ? (
              <Moon size={18} className="text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Sun size={18} className="text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {data.darkMode ? 'Dark theme active' : 'Light theme active'}
            </p>
          </div>
          {/* Toggle switch */}
          <button
            onClick={toggleDarkMode}
            className={clsx(
              'relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none',
              data.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            )}
            aria-label="Toggle dark mode"
          >
            <span
              className={clsx(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                data.darkMode ? 'translate-x-6' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </section>

      {/* Google Integration */}
      <section className="card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Google Integration</p>
        </div>
        <div className="px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-900/20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Google Account</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {data.googleConnected ? (
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle size={11} /> Connected
                </span>
              ) : (
                'Sync & backup with Google'
              )}
            </p>
          </div>
          {data.googleConnected ? (
            <button onClick={handleGoogleDisconnect} className="text-xs text-red-400 hover:text-red-600 transition-colors">
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setShowGoogleInfo(true)}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <LogIn size={13} /> Connect
            </button>
          )}
        </div>
      </section>

      {/* Currency */}
      <section className="card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Preferences</p>
        </div>
        <button
          onClick={() => setShowCurrency(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="w-9 h-9 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Currency</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{selectedCurrency.symbol} {selectedCurrency.label}</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
        </button>
      </section>

      {/* Data */}
      <section className="card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Data Management</p>
        </div>

        <button
          onClick={() => exportToJSON(data)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700"
        >
          <div className="w-9 h-9 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
            <Download size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Export Data</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Download backup as JSON</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700"
        >
          <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <Upload size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Import Data</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Restore from backup</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        {importError && <p className="text-xs text-red-500 px-4 pb-2">{importError}</p>}

        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <div className="w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-red-500">Clear All Data</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Permanently delete everything</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
        </button>
      </section>

      {/* App info */}
      <div className="text-center text-xs text-gray-300 dark:text-gray-600 py-4">
        <p className="font-semibold text-gray-400 dark:text-gray-500">CashBook v1.0</p>
        <p>All data stored locally on your device</p>
      </div>

      {/* Profile Modal */}
      <Modal open={showProfile} onClose={() => setShowProfile(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your name"
              value={userName}
              onChange={(e: any) => setUserName(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowProfile(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button
              onClick={() => {
                updateSettings({ userName });
                setShowProfile(false);
              }}
              className="btn-primary flex-1 justify-center"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Currency Modal */}
      <Modal open={showCurrency} onClose={() => setShowCurrency(false)} title="Select Currency">
        <div className="space-y-2">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                updateSettings({ currency: c.code });
                setShowCurrency(false);
              }}
              className={clsx(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-all border',
                data.currency === c.code
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              )}
            >
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400 w-8 text-center">{c.symbol}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.code}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{c.label}</p>
              </div>
              {data.currency === c.code && <CheckCircle size={16} className="text-blue-500" />}
            </button>
          ))}
        </div>
      </Modal>

      {/* Clear Confirm Modal */}
      <Modal open={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear All Data">
        <div className="space-y-4 text-center">
          <div className="text-5xl">⚠️</div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Are you sure you want to delete all your data?</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">This action cannot be undone. All transactions, debts, and capital data will be permanently deleted.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowClearConfirm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleClearAll} className="btn-danger flex-1 justify-center">Delete Everything</button>
          </div>
        </div>
      </Modal>

      {/* Google Info Modal */}
      <Modal open={showGoogleInfo} onClose={() => setShowGoogleInfo(false)} title="Connect Google">
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Google Integration</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Sync your data with Google Sheets and Backup to Google Drive</p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-400">
            <p className="font-semibold mb-1">ℹ️ Demo Mode</p>
            <p>Full Google OAuth integration requires a backend server. In this demo, clicking "Connect" simulates the connection state. To set up real Google Sync, configure a Google Cloud project with OAuth 2.0 and Sheets API credentials.</p>
          </div>

          <ul className="space-y-2 text-sm">
            {['Backup to Google Drive', 'Export to Google Sheets', 'Access from any device', 'Automatic daily sync'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            <button onClick={() => setShowGoogleInfo(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleGoogleConnect} className="btn-primary flex-1 justify-center">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#fff"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#fff"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff"/>
              </svg>
              Connect Google
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
