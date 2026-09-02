import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as walletApi from '../api/wallet';
import type { WalletTransactionRecord } from '../types';
import { useAuth } from './AuthContext';

interface WalletContextValue {
  balance: number;
  transactions: WalletTransactionRecord[];
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransactionRecord[]>([]);

  const load = useCallback(async () => {
    if (!isLoggedIn) {
      setBalance(0);
      setTransactions([]);
      return;
    }
    try {
      const info = await walletApi.getWallet();
      setBalance(info.balance);
      setTransactions(info.transactions);
    } catch {
      setBalance(0);
      setTransactions([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo<WalletContextValue>(
    () => ({ balance, transactions, refresh: load }),
    [balance, transactions, load]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
