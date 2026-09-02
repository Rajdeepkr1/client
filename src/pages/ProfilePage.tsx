import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { PageTransition } from '../components/ui/PageTransition';
import './ProfilePage.css';

function getInitials(name: string | undefined) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const progress = useProgress();

  return (
    <PageTransition>
      <div className="profile-page">
        <motion.div
          className="profile-card glass"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* No avatar upload API yet — swap this for <img src={user.avatarUrl}> once it exists */}
          <div className="profile-avatar" aria-hidden="true">
            <span>{getInitials(user?.name)}</span>
          </div>

          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </motion.div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{progress.readCount}</span>
            <span className="profile-stat-label">Read</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{progress.bookmarked.length}</span>
            <span className="profile-stat-label">Bookmarked</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/bookmarks" className="btn btn-ghost">
            ★ View bookmarks
          </Link>
          <button className="btn btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
