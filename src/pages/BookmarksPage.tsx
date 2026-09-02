import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { PageTransition } from '../components/ui/PageTransition';
import './BookmarksPage.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function BookmarksPage() {
  const progress = useProgress();

  return (
    <PageTransition>
      <div className="bookmarks">
        <h1>
          <span className="gradient-text">★ Bookmarks</span>
        </h1>
        <p className="hint">{progress.readCount} topic(s) marked as read overall.</p>

        {progress.bookmarked.length === 0 ? (
          <p className="empty">
            No bookmarks yet. Open any topic and click <strong>☆ Bookmark</strong> to save it here.
          </p>
        ) : (
          <motion.ul className="bookmark-list" variants={container} initial="hidden" animate="show">
            {progress.bookmarked.map((it) => (
              <motion.li key={`${it.subject}-${it.topicId}`} variants={item}>
                <Link to={`/subjects/${it.subject}/topics/${it.topicId}`} className="bookmark-card glass">
                  <SubjectIcon slug={it.subject} size={38} />
                  <div className="bookmark-body">
                    <span className="subject-tag">{it.subjectTitle}</span>
                    <h2>{it.topicTitle}</h2>
                  </div>
                  {it.read && <span className="read-badge">✓ read</span>}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </PageTransition>
  );
}
