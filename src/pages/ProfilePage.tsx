import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { PageTransition } from '../components/ui/PageTransition';
import * as postsApi from '../api/posts';
import { ApiError } from '../api/client';
import type { Post } from '../types';
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

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const progress = useProgress();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    postsApi
      .listPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const post = await postsApi.createPost(trimmed);
      setPosts((prev) => [post, ...prev]);
      setContent('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not post — try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p._id !== id));
    try {
      await postsApi.deletePost(id);
    } catch {
      // best-effort — re-fetch to recover from a failed delete
      postsApi.listPosts().then(setPosts).catch(() => {});
    }
  }

  return (
    <PageTransition>
      <div className="profile-page">
        <motion.div
          className="profile-cover"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img
            className="profile-cover-photo"
            src="https://t3.ftcdn.net/jpg/08/38/38/40/360_F_838384062_Rc4B66TYnD19EQOSDDiz52kfFwKWPSQE.jpg"
            alt=""
          />
        </motion.div>

        <div className="profile-header-row">
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-icon" aria-hidden="true">📝</span>
              <span className="profile-stat-value">{posts.length}</span>
              <span className="profile-stat-label">Posts</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-icon" aria-hidden="true">👁</span>
              <span className="profile-stat-value">{progress.readCount}</span>
              <span className="profile-stat-label">Read</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-icon" aria-hidden="true">★</span>
              <span className="profile-stat-value">{progress.bookmarked.length}</span>
              <span className="profile-stat-label">Bookmarked</span>
            </div>
          </div>

          <div className="profile-identity">
            {/* No avatar upload API yet — swap this for <img src={user.avatarUrl}> once it exists */}
            <div className="profile-avatar" aria-hidden="true">
              <span>{getInitials(user?.name)}</span>
            </div>
            <h1>{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>

          <aside className="profile-sidebar glass">
            <h2>Account</h2>
            <ul className="profile-sidebar-info">
              <li>
                <span aria-hidden="true">✉</span> {user?.email}
              </li>
            </ul>
          </aside>

          
        </div>

        <div className="profile-body">
          
          <div className="profile-header-actions">
            <Link to="/bookmarks" className="btn btn-ghost">
              ★ Bookmarks
            </Link>
            <button className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
          <div className="profile-main">
            <form className="post-composer glass" onSubmit={handleSubmit}>
              <textarea
                placeholder="Share your thoughts…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                rows={3}
              />
              {error && <div className="error-banner">{error}</div>}
              <div className="post-composer-footer">
                <span className="post-composer-count">{content.length}/2000</span>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!content.trim() || submitting}
                >
                  {submitting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>

            <div className="post-feed">
              {loadingPosts ? (
                <p className="hint">Loading posts…</p>
              ) : posts.length === 0 ? (
                <p className="hint">No posts yet — share something above.</p>
              ) : (
                <AnimatePresence initial={false}>
                  {posts.map((post) => (
                    <motion.div
                      key={post._id}
                      className="post-card glass"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="post-card-header">
                        <div className="profile-avatar post-avatar" aria-hidden="true">
                          <span>{getInitials(user?.name)}</span>
                        </div>
                        <div className="post-card-meta">
                          <span className="post-card-name">{user?.name}</span>
                          <span className="post-card-time">{formatTimestamp(post.createdAt)}</span>
                        </div>
                        <button
                          className="post-delete"
                          onClick={() => handleDelete(post._id)}
                          aria-label="Delete post"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="post-card-content">{post.content}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
