import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as purchasesApi from '../api/purchases';
import type { SubjectPurchase } from '../types';
import { useAuth } from './AuthContext';

interface PurchaseContextValue {
  configured: boolean;
  purchases: SubjectPurchase[];
  isPurchased: (subject: string) => boolean;
  getPrice: (subject: string) => number | null;
  refresh: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextValue | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [configured, setConfigured] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [purchases, setPurchases] = useState<SubjectPurchase[]>([]);

  useEffect(() => {
    purchasesApi
      .getPricing()
      .then((info) => {
        setConfigured(info.configured);
        setPrices(info.prices);
      })
      .catch(() => {
        setConfigured(false);
        setPrices({});
      });
  }, []);

  const loadPurchases = useCallback(async () => {
    if (!isLoggedIn) {
      setPurchases([]);
      return;
    }
    try {
      setPurchases(await purchasesApi.listPurchases());
    } catch {
      setPurchases([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const purchasedSlugs = useMemo(() => new Set(purchases.map((p) => p.subject)), [purchases]);

  const value = useMemo<PurchaseContextValue>(
    () => ({
      configured,
      purchases,
      isPurchased: (subject) => purchasedSlugs.has(subject),
      getPrice: (subject) =>
        Object.prototype.hasOwnProperty.call(prices, subject) ? prices[subject] : null,
      refresh: loadPurchases,
    }),
    [configured, prices, purchases, purchasedSlugs, loadPurchases]
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchases(): PurchaseContextValue {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error('usePurchases must be used within PurchaseProvider');
  return ctx;
}
