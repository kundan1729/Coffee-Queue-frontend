import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../api/orders';
import OrderCard from '../../components/OrderCard/OrderCard';
import Loader from '../../components/Loader/Loader';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import styles from './Queue.module.css';

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQueue = async () => {
    try {
      const data = await orderAPI.getQueue();
      setQueue(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch queue data');
      console.error('Error fetching queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="large" text="Loading queue..." />
      </div>
    );
  }

  return (
    <div className={styles.queue}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className={styles.title}>Order Board</h1>
          <p className={styles.subtitle}>Real-time order tracking and priority management</p>
        </div>
        <motion.div
          className={styles.queueCount}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className={styles.countNumber}>{queue.length}</span>
          <span className={styles.countLabel}>Orders in Queue</span>
        </motion.div>
      </motion.div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <div className={styles.queueContainer}>
        <AnimatePresence mode="popLayout">
          {queue.length === 0 ? (
            <motion.div
              key="empty"
              className={styles.emptyState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <span className={styles.emptyIcon}>📋</span>
              <h2 className={styles.emptyTitle}>No orders in queue</h2>
              <p className={styles.emptyText}>
                New orders will appear here automatically
              </p>
            </motion.div>
          ) : (
            queue.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                isEmergency={order.isEmergency}
                delay={index * 0.05}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Queue;
