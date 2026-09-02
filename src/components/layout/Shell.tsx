import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import '../../App.css';

export function Shell() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // auto-close the mobile drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="shell">
      <AnimatedBackground />
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="shell-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
