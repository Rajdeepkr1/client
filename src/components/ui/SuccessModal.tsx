import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ConfettiBlast } from './ConfettiBlast';
import './SuccessModal.css';

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: () => void;
}

export function SuccessModal({
  open,
  title = 'Hurray!',
  message,
  actionLabel,
  actionTo,
  onAction,
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="success-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="success-modal glass"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 16, stiffness: 220 }}
          >
            <ConfettiBlast />
            <span className="success-modal-icon" aria-hidden="true">
              🎉
            </span>
            <h2>{title}</h2>
            <p className="hint">{message}</p>
            {actionTo ? (
              <Link to={actionTo} className="btn btn-primary">
                {actionLabel}
              </Link>
            ) : (
              <button className="btn btn-primary" onClick={onAction}>
                {actionLabel}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
