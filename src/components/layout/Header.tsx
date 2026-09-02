import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const wallet = useWallet();
  const [query, setQuery] = useState('');

  function runSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="header glass">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      <Link to="/" className="brand" aria-label="Dev Notes">
        <span className="brand-mark gradient-text">◆</span>
        <span>Dev Notes</span>
      </Link>

      <form className="search" onSubmit={runSearch}>
        <input
          type="search"
          placeholder="Search all topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <motion.button
          type="submit"
          className="btn btn-primary search-btn"
          whileTap={{ scale: 0.94 }}
        >
          Search
        </motion.button>
      </form>

      <nav className="actions">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="user-avatar" aria-label="Dashboard" title="Dashboard">
              <span aria-hidden="true">📊</span>
            </Link>
            <Link to="/bookmarks" className="btn btn-ghost bookmarks-link">
              <span className="full-label">★ Bookmarks</span>
              <span className="short-label">★</span>
            </Link>
            <Link to="/wallet" className="wallet-badge" aria-label="Wallet balance">
              💰 ₹{(wallet.balance / 100).toFixed(2)}
            </Link>
            <Link
              to="/profile"
              className="user-avatar"
              aria-label={user?.name ? `${user.name}'s profile` : 'Profile'}
              title={user?.name}
            >
              <span aria-hidden="true">👤</span>
            </Link>
            <button className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
