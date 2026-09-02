import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSubject } from '../api/notes';
import { createCheckout, verifyPayment, payWithWallet } from '../api/purchases';
import { ApiError } from '../api/client';
import { loadRazorpayScript, openRazorpayCheckout } from '../lib/razorpay';
import { useAuth } from '../context/AuthContext';
import { usePurchases } from '../context/PurchaseContext';
import { useWallet } from '../context/WalletContext';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { PageTransition } from '../components/ui/PageTransition';
import { SuccessModal } from '../components/ui/SuccessModal';
import type { LockedSubject } from '../types';
import './CheckoutPage.css';

export function CheckoutPage() {
  const { subject = '' } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const purchases = usePurchases();
  const wallet = useWallet();

  const [info, setInfo] = useState<LockedSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getSubject(subject)
      .then((data) => {
        if (cancelled) return;
        if (!data.locked) {
          // free, or already owned — nothing to check out
          navigate(`/subjects/${subject}`, { replace: true });
          return;
        }
        setInfo(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load this subject.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subject, navigate]);

  async function handlePay() {
    if (!info || buying) return;
    setBuying(true);
    setBuyError(null);
    try {
      const order = await createCheckout(info.slug);

      if (order.free) {
        // no payment provider configured yet — checkout granted access for
        // free server-side, nothing left to do but celebrate
        await purchases.refresh();
        setPaid(true);
        return;
      }

      await loadRazorpayScript();
      openRazorpayCheckout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Dev Notes',
        description: info.title,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#8b5cf6' },
        handler: async (response) => {
          await verifyPayment(response);
          await purchases.refresh();
          setPaid(true);
        },
      });
    } catch (err) {
      setBuyError(err instanceof ApiError ? err.message : 'Could not start checkout. Try again.');
    } finally {
      setBuying(false);
    }
  }

  async function handlePayWithWallet() {
    if (!info || buying) return;
    setBuying(true);
    setBuyError(null);
    try {
      await payWithWallet(info.slug);
      await Promise.all([purchases.refresh(), wallet.refresh()]);
      setPaid(true);
    } catch (err) {
      setBuyError(err instanceof ApiError ? err.message : 'Could not pay with wallet. Try again.');
    } finally {
      setBuying(false);
    }
  }

  const canPayWithWallet = !!info && wallet.balance >= info.price;

  return (
    <PageTransition>
      <div className="checkout-page">
        {loading ? (
          <p className="hint">Loading…</p>
        ) : loadError ? (
          <div className="error-banner">{loadError}</div>
        ) : info ? (
          <motion.div
            className="checkout-card glass"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1>Checkout</h1>

            <div className="checkout-item">
              <SubjectIcon slug={info.slug} size={48} />
              <div className="checkout-item-body">
                <h2>{info.title}</h2>
                <span className="hint">{info.topicCount} topics</span>
              </div>
            </div>

            <div className="checkout-summary">
              <div className="checkout-row">
                <span>Subject access</span>
                <span>{purchases.configured ? `₹${(info.price / 100).toFixed(2)}` : 'FREE'}</span>
              </div>
              <div className="checkout-row checkout-total">
                <span>Total</span>
                <span>{purchases.configured ? `₹${(info.price / 100).toFixed(2)}` : 'FREE'}</span>
              </div>
            </div>

            {canPayWithWallet && (
              <button
                className="btn btn-primary full-width"
                onClick={handlePayWithWallet}
                disabled={buying}
              >
                {buying ? 'Paying…' : `Pay with wallet (₹${(wallet.balance / 100).toFixed(2)} available)`}
              </button>
            )}

            <button
              className={`btn ${canPayWithWallet ? 'btn-ghost' : 'btn-primary'} full-width`}
              onClick={handlePay}
              disabled={buying}
            >
              {buying
                ? 'Starting checkout…'
                : purchases.configured
                  ? `Pay ₹${(info.price / 100).toFixed(2)}`
                  : 'Get for free'}
            </button>

            {buyError && <div className="error-banner">{buyError}</div>}

            <p className="checkout-secured">
              {purchases.configured
                ? '🔒 Payments are securely handled by Razorpay.'
                : 'No payment provider is set up yet, so this is free for now.'}
            </p>

            <Link to={`/subjects/${info.slug}`} className="checkout-cancel">
              Cancel and go back
            </Link>
          </motion.div>
        ) : null}

        {info && (
          <SuccessModal
            open={paid}
            message={`${info.title} is unlocked.`}
            actionLabel="Start reading"
            actionTo={`/subjects/${info.slug}`}
          />
        )}
      </div>
    </PageTransition>
  );
}
