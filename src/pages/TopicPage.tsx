import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getSubject, getTopic } from '../api/notes';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { MarkdownView } from '../components/ui/MarkdownView';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { PageTransition } from '../components/ui/PageTransition';
import type { SubjectDetail, TopicDetail } from '../types';
import './TopicPage.css';

export function TopicPage() {
  const { subject = '', topicId } = useParams<{ subject: string; topicId?: string }>();
  const { isLoggedIn } = useAuth();
  const progress = useProgress();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
  const [topicDetail, setTopicDetail] = useState<TopicDetail | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSubjectDetail(null);
    setTopicDetail(null);

    const request = topicId ? getTopic(subject, topicId) : getSubject(subject);

    request
      .then((data) => {
        if (cancelled) return;
        if (topicId) setTopicDetail(data as TopicDetail);
        else setSubjectDetail(data as SubjectDetail);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this content. It may not exist.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subject, topicId]);

  async function handleToggleRead() {
    if (!topicDetail || toggling) return;
    setToggling(true);
    try {
      await progress.toggleRead(topicDetail.subject, topicDetail.id);
    } finally {
      setToggling(false);
    }
  }

  async function handleToggleBookmark() {
    if (!topicDetail || toggling) return;
    setToggling(true);
    try {
      await progress.toggleBookmark(topicDetail.subject, topicDetail.id);
    } finally {
      setToggling(false);
    }
  }

  return (
    <PageTransition>
      <div className="viewer">
        {loading ? (
          <p className="hint">Loading…</p>
        ) : error ? (
          <div className="error-banner">{error}</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={topicId ?? subject}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {topicDetail && (
                <>
                  <div className="topic-header">
                    <div className="crumbs">
                      <SubjectIcon slug={topicDetail.subject} size={30} />
                      <Link to={`/subjects/${topicDetail.subject}`}>{topicDetail.subjectTitle}</Link>
                      <span className="sep">/</span>
                      <span className="current">{topicDetail.title}</span>
                    </div>

                    {isLoggedIn ? (
                      <div className="topic-actions">
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          className={`btn btn-ghost ${
                            progress.isRead(topicDetail.subject, topicDetail.id) ? 'active' : ''
                          }`}
                          onClick={handleToggleRead}
                          disabled={toggling}
                        >
                          {progress.isRead(topicDetail.subject, topicDetail.id) ? '✓ Read' : 'Mark as read'}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          className={`btn btn-ghost star-btn ${
                            progress.isBookmarked(topicDetail.subject, topicDetail.id) ? 'active' : ''
                          }`}
                          onClick={handleToggleBookmark}
                          disabled={toggling}
                        >
                          {progress.isBookmarked(topicDetail.subject, topicDetail.id)
                            ? '★ Bookmarked'
                            : '☆ Bookmark'}
                        </motion.button>
                      </div>
                    ) : (
                      <Link to="/login" className="hint-link">
                        Log in to track progress & bookmarks
                      </Link>
                    )}
                  </div>
                  <MarkdownView content={topicDetail.content} />
                </>
              )}

              {subjectDetail && !topicDetail && (
                <>
                  <div className="topic-header">
                    <div className="crumbs">
                      <SubjectIcon slug={subjectDetail.slug} size={30} />
                      <span className="current">{subjectDetail.title}</span>
                    </div>
                  </div>
                  <MarkdownView content={subjectDetail.content} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  );
}
