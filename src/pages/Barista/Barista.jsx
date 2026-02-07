import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../api/orders';
import AnimatedCard from '../../components/AnimatedCard/AnimatedCard';
import Loader from '../../components/Loader/Loader';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import styles from './Barista.module.css';

const Barista = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  const fetchStatus = async () => {
    try {
      const data = await orderAPI.getBaristaStatus();
      setStatus(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch barista status');
      console.error('Error fetching status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status?.currentOrder) {
      const startTime = new Date(status.currentOrder.startTime).getTime();

      const timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setTimer(elapsed);
      }, 1000);

      return () => clearInterval(timerInterval);
    } else {
      setTimer(0);
    }
  }, [status?.currentOrder]);

  const handleCompleteOrder = async () => {
    setCompleting(true);
    setError('');

    try {
      await orderAPI.completeOrder();
      await fetchStatus();
    } catch (err) {
      setError('Failed to complete order');
      console.error('Error completing order:', err);
    } finally {
      setCompleting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="large" text="Loading barista status..." />
      </div>
    );
  }

  const isBusy = status?.status === 'BUSY';

  return (
    <div className={styles.barista}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Barista Bar</h1>
        <p className={styles.subtitle}>Current order status and workflow</p>
      </motion.div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <div className={styles.container}>
        <AnimatedCard delay={0.1} className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <h2 className={styles.statusTitle}>Current Status</h2>
            <motion.div
              className={`${styles.statusBadge} ${isBusy ? styles.busy : styles.idle}`}
              animate={{
                scale: isBusy ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isBusy ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {isBusy ? '🔥 BUSY' : '✓ IDLE'}
            </motion.div>
          </div>
        </AnimatedCard>

        <AnimatePresence mode="wait">
          {isBusy && status.currentOrder ? (
            <motion.div
              key="order"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard delay={0.2} className={styles.orderCard}>
                <h2 className={styles.orderTitle}>Current Order</h2>

                <div className={styles.orderDetails}>
                  <div className={styles.orderInfo}>
                    <span className={styles.label}>Order ID</span>
                    <span className={styles.value}>#{status.currentOrder.id}</span>
                  </div>
                  <div className={styles.orderInfo}>
                    <span className={styles.label}>Drink Type</span>
                    <span className={styles.value}>{status.currentOrder.drinkType}</span>
                  </div>
                </div>

                <div className={styles.timerSection}>
                  <span className={styles.timerLabel}>Time Elapsed</span>
                  <motion.div
                    className={styles.timer}
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {formatTime(timer)}
                  </motion.div>
                </div>

                <motion.button
                  className={`btn btn-success ${styles.completeBtn}`}
                  onClick={handleCompleteOrder}
                  disabled={completing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {completing ? <Loader size="small" /> : '✓ Complete Order'}
                </motion.button>
              </AnimatedCard>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard delay={0.2} className={styles.idleCard}>
                <span className={styles.idleIcon}>☕</span>
                <h2 className={styles.idleTitle}>No Active Orders</h2>
                <p className={styles.idleText}>
                  Waiting for the next order to be assigned
                </p>
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Barista;
