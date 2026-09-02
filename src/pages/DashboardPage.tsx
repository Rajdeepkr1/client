import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSubjects } from '../api/notes';
import { listPosts } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useWallet } from '../context/WalletContext';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { PageTransition } from '../components/ui/PageTransition';
import type { Post, SubjectSummary } from '../types';
import './DashboardPage.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
} as const;

function formatTimestamp(iso: string) {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function DashboardPage() {
  const { user } = useAuth();
  const progress = useProgress();
  const wallet = useWallet();

  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjects(), listPosts().catch(() => [])]).then(([s, p]) => {
      setSubjects(s);
      setPosts(p);
      setLoading(false);
    });
  }, []);

  const continueItems = useMemo(() => {
    return progress.items
      .filter((p) => p.read || p.bookmarked)
      .sort((a, b) => (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? ''))
      .slice(0, 6);
  }, [progress.items]);

  const ownedSubjects = useMemo(() => subjects.filter((s) => s.purchased), [subjects]);
  const recentPosts = useMemo(() => posts.slice(0, 3), [posts]);
  const recentTransactions = useMemo(() => wallet.transactions.slice(0, 3), [wallet.transactions]);

  return (
    <PageTransition>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="hint">Here's where you left off.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-tile">
            <span className="stat-value">{progress.readCount}</span>
            <span className="stat-label">Read</span>
          </div>
          <div className="stat-tile">
            <span className="stat-value">{progress.bookmarked.length}</span>
            <span className="stat-label">Bookmarked</span>
          </div>
          <div className="stat-tile">
            <span className="stat-value">{ownedSubjects.length}</span>
            <span className="stat-label">Owned</span>
          </div>
          <div className="stat-tile">
            <span className="stat-value">₹{(wallet.balance / 100).toFixed(0)}</span>
            <span className="stat-label">Wallet</span>
          </div>
        </div>

        {continueItems.length > 0 && (
          <div className="dashboard-section">
            <h2 className="section-title">Continue reading</h2>
            <motion.div className="dash-continue-row" variants={container} initial="hidden" animate="show">
              {continueItems.map((it) => (
                <motion.div key={`${it.subject}-${it.topicId}`} variants={cardVariant}>
                  <Link to={`/subjects/${it.subject}/topics/${it.topicId}`} className="dash-continue-card glass">
                    <SubjectIcon slug={it.subject} size={36} />
                    <div className="dash-continue-body">
                      <span className="dash-subject-tag">{it.subjectTitle}</span>
                      <h3>{it.topicTitle}</h3>
                    </div>
                    {it.read && <span className="dash-read-badge">✓</span>}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-section dash-card glass">
            <div className="dash-card-header">
              <h2 className="section-title">Purchased subjects</h2>
              <Link to="/" className="dash-card-link">
                Browse more
              </Link>
            </div>
            {loading ? (
              <p className="hint">Loading…</p>
            ) : ownedSubjects.length === 0 ? (
              <p className="hint">You haven't bought any subjects yet.</p>
            ) : (
              <ul className="dash-owned-list">
                {ownedSubjects.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/subjects/${s.slug}`} className="dash-owned-item">
                      <SubjectIcon slug={s.slug} size={32} />
                      <div className="dash-owned-body">
                        <span className="dash-owned-title">{s.title}</span>
                        <span className="dash-owned-meta">{s.topicCount} topics</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-section dash-card glass">
            <div className="dash-card-header">
              <h2 className="section-title">Wallet</h2>
              <Link to="/wallet" className="dash-card-link">
                View wallet
              </Link>
            </div>
            <div className="dash-wallet-balance">₹{(wallet.balance / 100).toFixed(2)}</div>
            {recentTransactions.length === 0 ? (
              <p className="hint">No transactions yet.</p>
            ) : (
              <ul className="dash-tx-list">
                {recentTransactions.map((t) => (
                  <li key={t._id}>
                    <span>{t.type === 'topup' ? 'Added money' : t.type === 'purchase' ? `Bought ${t.subject}` : 'Refund'}</span>
                    <span className={t.type === 'purchase' ? 'dash-tx-debit' : 'dash-tx-credit'}>
                      {t.type === 'purchase' ? '-' : '+'}₹{(t.amount / 100).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-section dash-card glass dash-card-wide">
            <div className="dash-card-header">
              <h2 className="section-title">Recent posts</h2>
              <Link to="/profile" className="dash-card-link">
                View profile
              </Link>
            </div>
            {recentPosts.length === 0 ? (
              <p className="hint">No posts yet — share something on your profile.</p>
            ) : (
              <ul className="dash-posts-list">
                {recentPosts.map((post) => (
                  <li key={post._id}>
                    <p className="dash-post-content">{post.content}</p>
                    <span className="dash-post-time">{formatTimestamp(post.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
