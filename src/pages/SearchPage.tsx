import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchNotes } from '../api/notes';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { PageTransition } from '../components/ui/PageTransition';
import type { SearchResult } from '../types';
import './SearchPage.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchNotes(q)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <PageTransition>
      <div className="results">
        <h1>
          Search results for <span className="gradient-text">"{q}"</span>
        </h1>

        {loading ? (
          <p className="hint">Searching…</p>
        ) : results.length === 0 ? (
          <p className="hint">No matching topics found.</p>
        ) : (
          <>
            <p className="count">{results.length} match(es)</p>
            <motion.ul className="result-list" variants={container} initial="hidden" animate="show">
              {results.map((result) => (
                <motion.li key={`${result.subject}-${result.topicId}`} variants={item}>
                  <Link
                    to={`/subjects/${result.subject}/topics/${result.topicId}`}
                    className="result-card glass"
                  >
                    <SubjectIcon slug={result.subject} size={38} />
                    <div className="result-body">
                      <span className="subject-tag">{result.subjectTitle}</span>
                      <h2>{result.topicTitle}</h2>
                      <p className="snippet">{result.snippet}</p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </>
        )}
      </div>
    </PageTransition>
  );
}
