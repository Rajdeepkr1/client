import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSubjects } from '../api/notes';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { getSubjectTheme } from '../data/subjectTheme';
import { PageTransition } from '../components/ui/PageTransition';
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
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .finally(() => setLoading(false));
  }, []);

  const totalTopics = useMemo(() => subjects.reduce((sum, s) => sum + s.topicCount, 0), [subjects]);

  return (
    <PageTransition>
      <div className="home">
        <motion.div
          className="hero"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>
            Every deep-dive, <span className="gradient-text">in one place</span>.
          </h1>
          <p className="subtitle">
            {loading ? (
              'Loading your topic library…'
            ) : (
              <>
                <strong>{subjects.length}</strong> subjects · <strong>{totalTopics}</strong> topics
                — search, bookmark, and track what you've read.
              </>
            )}
          </p>
        </motion.div>

        {!loading && (
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
                    <SubjectIcon slug={subject.slug} size={48} />
                    <div className="card-body">
                      <h2>{subject.title}</h2>
                      <span className="count">{subject.topicCount} topics</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
