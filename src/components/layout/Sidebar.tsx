import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getSubjects } from '../../api/notes';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { usePurchases } from '../../context/PurchaseContext';
import { SubjectIcon } from '../ui/SubjectIcon';
import type { SubjectSummary } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const progress = useProgress();
  const purchases = usePurchases();

  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .finally(() => setLoading(false));
  }, []);

  const activeSubject = useMemo(
    () => location.pathname.match(/^\/subjects\/([^/]+)/)?.[1] ?? null,
    [location.pathname]
  );
  const activeTopic = useMemo(
    () => location.pathname.match(/^\/subjects\/[^/]+\/topics\/([^/]+)/)?.[1] ?? null,
    [location.pathname]
  );

  useEffect(() => {
    if (!activeSubject) return;
    setExpanded((prev) => (prev.has(activeSubject) ? prev : new Set(prev).add(activeSubject)));
  }, [activeSubject]);

  function toggle(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-mobile-header">
        <span className="sidebar-mobile-title">Topics</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      {loading ? (
        <p className="hint sidebar-hint">Loading topics…</p>
      ) : (
        <nav className="subject-list">
          {subjects.map((subject) => {
            const isSubjectOpen = expanded.has(subject.slug);
            const isActiveSubject = activeSubject === subject.slug;
            const topicTag =
              subject.price !== null && subject.purchased
                ? { label: '✓ Owned', className: 'owned' }
                : subject.price !== null
                  ? {
                      label: purchases.configured ? `₹${subject.price / 100}` : 'FREE',
                      className: '',
                    }
                  : { label: 'FREE', className: 'free' };
            return (
              <div key={subject.slug} className="subject">
                <button
                  className={`subject-header ${isActiveSubject ? 'active' : ''}`}
                  onClick={() => toggle(subject.slug)}
                >
                  <SubjectIcon slug={subject.slug} size={26} />
                  <Link
                    to={`/subjects/${subject.slug}`}
                    className="subject-title"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {subject.title}
                  </Link>
                  <span className="topic-count">{subject.topicCount}</span>
                  <motion.span
                    className="chevron"
                    animate={{ rotate: isSubjectOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    ›
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isSubjectOpen && (
                    <motion.ul
                      className="topic-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      {subject.topics.map((topic) => {
                        const isActive =
                          isActiveSubject && activeTopic === topic.id;
                        const isRead = isLoggedIn && progress.isRead(subject.slug, topic.id);
                        const isBookmarked =
                          isLoggedIn && progress.isBookmarked(subject.slug, topic.id);
                        return (
                          <li key={topic.id}>
                            <Link
                              to={`/subjects/${subject.slug}/topics/${topic.id}`}
                              className={`topic-link ${isActive ? 'active' : ''}`}
                            >
                              <span className={`dot ${isRead ? 'read' : ''}`} />
                              <span className="topic-text">{topic.title}</span>
                              <span className={`topic-price ${topicTag.className}`}>{topicTag.label}</span>
                              {isBookmarked && <span className="star">★</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
