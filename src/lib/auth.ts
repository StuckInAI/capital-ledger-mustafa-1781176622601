export type UserAccount = {
  username: string;
  passwordHash: string;
  createdAt: string;
};

const ACCOUNTS_KEY = 'dailykhaata_accounts';
const SESSION_KEY = 'dailykhaata_session';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function getAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as UserAccount[]) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: UserAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerUser(username: string, password: string): { success: boolean; error?: string } {
  const accounts = getAccounts();
  const exists = accounts.find((a) => a.username.toLowerCase() === username.toLowerCase());
  if (exists) return { success: false, error: 'userExists' };
  accounts.push({ username, passwordHash: simpleHash(password), createdAt: new Date().toISOString() });
  saveAccounts(accounts);
  return { success: true };
}

export function loginUser(username: string, password: string): { success: boolean; error?: string } {
  const accounts = getAccounts();
  const account = accounts.find((a) => a.username.toLowerCase() === username.toLowerCase());
  if (!account) return { success: false, error: 'userNotFound' };
  if (account.passwordHash !== simpleHash(password)) return { success: false, error: 'wrongPassword' };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: account.username, loginAt: new Date().toISOString() }));
  return { success: true };
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): { username: string; loginAt: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
