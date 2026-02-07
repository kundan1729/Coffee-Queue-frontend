import { motion, AnimatePresence } from 'framer-motion';
import styles from './ErrorBanner.module.css';

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.content}>
          <span className={styles.icon}>⚠️</span>
          <p className={styles.message}>{message}</p>
        </div>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorBanner;
