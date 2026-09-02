import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSubjects } from '../api/notes';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { getSubjectTheme } from '../data/subjectTheme';
import { PageTransition } from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { usePurchases } from '../context/PurchaseContext';
import type { SubjectSummary } from '../types';
import './Home.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

export function Home() {
  const { isLoggedIn } = useAuth();
  const progress = useProgress();
  const purchases = usePurchases();
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .finally(() => setLoading(false));
  }, []);

  const totalTopics = useMemo(() => subjects.reduce((sum, s) => sum + s.topicCount, 0), [subjects]);

  const continueItems = useMemo(() => {
    return progress.items
      .filter((p) => p.read || p.bookmarked)
      .sort((a, b) => (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? ''))
      .slice(0, 6);
  }, [progress.items]);

  return (
    <PageTransition>
      <div className="home">
        <motion.div
          className="hero"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-content">
            <h1>
              Every deep-dive, <span className="gradient-text">in one place</span>.
            </h1>
            <p className="subtitle">Search, bookmark, and track what you've read.</p>

            {!loading && (
              <div className="stats-bar">
                <div className="stat-tile">
                  <span className="stat-value">{subjects.length}</span>
                  <span className="stat-label">Subjects</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-value">{totalTopics}</span>
                  <span className="stat-label">Topics</span>
                </div>
                {isLoggedIn && (
                  <>
                    <div className="stat-tile">
                      <span className="stat-value">{progress.readCount}</span>
                      <span className="stat-label">Read</span>
                    </div>
                    <div className="stat-tile">
                      <span className="stat-value">{progress.bookmarked.length}</span>
                      <span className="stat-label">Bookmarked</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <Link to="/register" className="btn btn-primary hero-cta">
                Sign up free
              </Link>
            )}
          </div>

          <div className="hero-graphic" aria-hidden="true">
            <img
              className="hero-photo"
              src="https://res.cloudinary.com/highereducation/image/upload/c_scale,w_750/f_auto,fl_lossy,q_auto:eco/v1532988864/TheBestColleges.org/images/study-notebooks.jpg"
              alt=""
            />
          </div>
        </motion.div>

        {isLoggedIn && continueItems.length > 0 && (
          <div className="continue-section">
            <h2 className="section-title">Continue reading</h2>
            <motion.div className="continue-row" variants={container} initial="hidden" animate="show">
              {continueItems.map((it) => (
                <motion.div key={`${it.subject}-${it.topicId}`} variants={cardVariant}>
                  <Link
                    to={`/subjects/${it.subject}/topics/${it.topicId}`}
                    className="continue-card glass"
                  >
                    <SubjectIcon slug={it.subject} size={38} />
                    <div className="continue-body">
                      <span className="subject-tag">{it.subjectTitle}</span>
                      <h3>{it.topicTitle}</h3>
                    </div>
                    {it.read && <span className="read-badge">✓ read</span>}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {!loading && (
          <>
            <h2 className="section-title">Browse subjects</h2>
            <motion.div className="grid" variants={container} initial="hidden" animate="show">
              {subjects.map((subject) => {
                const theme = getSubjectTheme(subject.slug);
                return (
                  <motion.div key={subject.slug} variants={cardVariant}>
                    <Link
                      to={`/subjects/${subject.slug}`}
                      className="subject-card glass"
                      style={{ ['--card-glow' as string]: theme.glow }}
                    >
                      <div className="card-glow" />
                      {subject.price !== null && (
                        <span className={`price-badge ${subject.purchased ? 'owned' : ''}`}>
                          {subject.purchased
                            ? '✓ Owned'
                            : purchases.configured
                              ? `₹${(subject.price / 100).toFixed(0)}`
                              : 'FREE'}
                        </span>
                      )}
                      <SubjectIcon slug={subject.slug} size={56} />
                      <div className="card-body">
                        <h3>{subject.title}</h3>
                        <span className="count">{subject.topicCount} topics</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
