import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { topUp, verifyTopUp } from '../api/wallet';
import { ApiError } from '../api/client';
import { loadRazorpayScript, openRazorpayCheckout } from '../lib/razorpay';
import { useAuth } from '../context/AuthContext';
import { usePurchases } from '../context/PurchaseContext';
import { useWallet } from '../context/WalletContext';
import { PageTransition } from '../components/ui/PageTransition';
import { SuccessModal } from '../components/ui/SuccessModal';
import type { WalletTransactionRecord } from '../types';
import './WalletPage.css';

const TYPE_ICON: Record<WalletTransactionRecord['type'], string> = {
  topup: '💰',
  purchase: '🛒',
  refund: '↩️',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function WalletPage() {
  const { user } = useAuth();
  const purchases = usePurchases();
  const wallet = useWallet();

  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedAmount, setAddedAmount] = useState<number | null>(null);

  async function handleTopUp(e: FormEvent) {
    e.preventDefault();
    const rupees = Number(amount);
    if (submitting || !rupees || rupees <= 0) return;

    const amountPaise = Math.round(rupees * 100);
    setSubmitting(true);
    setError(null);
    try {
      const order = await topUp(amountPaise);

      if (order.free) {
        await wallet.refresh();
        setAddedAmount(amountPaise);
        setAmount('');
        return;
      }

      await loadRazorpayScript();
      openRazorpayCheckout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Dev Notes',
        description: 'Add money to wallet',
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#8b5cf6' },
        handler: async (response) => {
          await verifyTopUp(response);
          await wallet.refresh();
          setAddedAmount(amountPaise);
          setAmount('');
        },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add money. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="wallet-page">
        <motion.div
          className="wallet-balance-card glass"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="wallet-balance-label">Wallet balance</span>
          <span className="wallet-balance-value">₹{(wallet.balance / 100).toFixed(2)}</span>

          <form className="wallet-topup-form" onSubmit={handleTopUp}>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.01"
              placeholder="Amount in ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting || !amount}>
              {submitting ? 'Adding…' : 'Add money'}
            </button>
          </form>

          {error && <div className="error-banner">{error}</div>}

          <p className="wallet-hint">
            {purchases.configured
              ? '🔒 Payments are securely handled by Razorpay.'
              : 'No payment provider is set up yet, so top-ups are free for now.'}
          </p>
        </motion.div>

        <div className="wallet-history glass">
          <h2>Transaction history</h2>
          {wallet.transactions.length === 0 ? (
            <p className="hint">No transactions yet.</p>
          ) : (
            <ul className="wallet-transactions">
              {wallet.transactions.map((t) => (
                <li key={t._id}>
                  <span className="wallet-tx-icon" aria-hidden="true">
                    {TYPE_ICON[t.type]}
                  </span>
                  <div className="wallet-tx-body">
                    <span className="wallet-tx-title">
                      {t.type === 'topup' ? 'Added money' : t.type === 'purchase' ? `Bought ${t.subject}` : 'Refund'}
                    </span>
                    <span className="wallet-tx-meta">
                      {formatDate(t.createdAt)} · Balance ₹{(t.balanceAfter / 100).toFixed(2)}
                    </span>
                  </div>
                  <span className={`wallet-tx-amount ${t.type === 'purchase' ? 'debit' : 'credit'}`}>
                    {t.type === 'purchase' ? '-' : '+'}₹{(t.amount / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SuccessModal
          open={addedAmount !== null}
          message={`₹${((addedAmount ?? 0) / 100).toFixed(2)} added to your wallet.`}
          actionLabel="Done"
          onAction={() => setAddedAmount(null)}
        />
      </div>
    </PageTransition>
  );
}
