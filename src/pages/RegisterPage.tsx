import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { PageTransition } from '../components/ui/PageTransition';
import './Auth.css';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="auth-page">
        <motion.form
          className="auth-card glass"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1>
            Create an <span className="gradient-text">account</span>
          </h1>
          <p className="subtitle">Track read progress and bookmarks across all topics.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary full-width"
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </motion.button>

          <p className="switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </motion.form>
      </div>
    </PageTransition>
  );
}
