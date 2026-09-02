import { motion } from 'framer-motion';

// Three large, blurred, slowly-drifting gradient blobs behind the whole app —
// pure CSS/transform animation (compositor-friendly, see the workspace's
// HTML/CSS notes on animation performance), no images needed.
export function AnimatedBackground() {
  return (
    <div className="bg-blobs" aria-hidden="true">
      <motion.div
        className="blob blob-1"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-2"
        animate={{ x: [0, -50, 30, 0], y: [0, -30, -60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-3"
        animate={{ x: [0, 40, -40, 0], y: [0, -50, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
