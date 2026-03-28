import { useCallback, useEffect, useState } from "react";

const ACCOUNTS_KEY = "ringid_accounts";
const SESSION_KEY = "ringid_session";
const SESSION_EVENT = "ringid_session_change";

type Account = { passwordHash: string; name: string };
type Session = { phone: string; name: string };

function hashPassword(password: string): string {
  return btoa(`${password}_ringid_salt`);
}

function getAccounts(): Record<string, Account> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function getSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function usePhoneAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setIsLoading(false);

    function onSessionChange() {
      setSession(getSession());
    }
    window.addEventListener(SESSION_EVENT, onSessionChange);
    return () => window.removeEventListener(SESSION_EVENT, onSessionChange);
  }, []);

  const register = useCallback(
    (
      phone: string,
      password: string,
      name: string,
    ): { success: boolean; error?: string } => {
      const accounts = getAccounts();
      if (accounts[phone]) {
        return { success: false, error: "এই নম্বরে ইতিমধ্যে অ্যাকাউন্ট আছে" };
      }
      accounts[phone] = { passwordHash: hashPassword(password), name };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return { success: true };
    },
    [],
  );

  const login = useCallback(
    (phone: string, password: string): { success: boolean; error?: string } => {
      const accounts = getAccounts();
      const account = accounts[phone];
      if (!account) {
        return { success: false, error: "এই নম্বরে কোনো অ্যাকাউন্ট নেই" };
      }
      if (account.passwordHash !== hashPassword(password)) {
        return { success: false, error: "পাসওয়ার্ড ভুল" };
      }
      return { success: true };
    },
    [],
  );

  const saveSession = useCallback((phone: string, name: string) => {
    const sess: Session = { phone, name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
    setSession(sess);
    window.dispatchEvent(new CustomEvent(SESSION_EVENT));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    window.dispatchEvent(new CustomEvent(SESSION_EVENT));
  }, []);

  return {
    session,
    isLoading,
    register,
    login,
    saveSession,
    logout,
  };
}
