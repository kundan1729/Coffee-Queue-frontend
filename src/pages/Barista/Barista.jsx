import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../api/orders';
import AnimatedCard from '../../components/AnimatedCard/AnimatedCard';
import Loader from '../../components/Loader/Loader';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import styles from './Barista.module.css';

const BaristaCard = ({ barista, onComplete, completingId }) => {
  const [timer, setTimer] = useState(0);
  const isBusy = barista.status === 'BUSY';

  useEffect(() => {
    if (isBusy && barista.currentOrder?.startTime) {
      const startTime = new Date(barista.currentOrder.startTime).getTime();
      const update = () => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    } else {
      setTimer(0);
    }
  }, [isBusy, barista.currentOrder?.startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatedCard delay={0.1} className={`${styles.baristaCard} ${isBusy ? styles.busyCard : styles.idleCardBg}`}>
      <div className={styles.cardHeader}>
        <div className={styles.baristaInfo}>
          <span className={styles.baristaAvatar}>
            {barista.baristaName === 'Alex' ? '👨‍🍳' : barista.baristaName === 'Jordan' ? '👩‍🍳' : '🧑‍🍳'}
          </span>
          <div>
            <h3 className={styles.baristaName}>{barista.baristaName}</h3>
            <span className={styles.baristaStats}>
              {barista.totalOrdersCompleted} completed · load {barista.workloadCounter}
            </span>
          </div>
        </div>
        <motion.div
          className={`${styles.statusBadge} ${isBusy ? styles.busy : styles.idle}`}
          animate={{ scale: isBusy ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: isBusy ? Infinity : 0 }}
        >
          {isBusy ? '🔥 BUSY' : '✓ IDLE'}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {isBusy && barista.currentOrder ? (
          <motion.div
            key="order"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.orderSection}
          >
            <div className={styles.orderDetails}>
              <div className={styles.orderInfo}>
                <span className={styles.label}>Customer</span>
                <span className={styles.value}>{barista.currentOrder.customerName || 'Guest'}</span>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.label}>Drink</span>
                <span className={styles.value}>{barista.currentOrder.drinkType}</span>
              </div>
            </div>

            <div className={styles.timerRow}>
              <span className={styles.timerLabel}>Elapsed</span>
              <motion.span
                className={styles.timer}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(timer)}
              </motion.span>
            </div>

            <motion.button
              className={`btn btn-success ${styles.completeBtn}`}
              onClick={() => onComplete(barista.baristaId)}
              disabled={completingId === barista.baristaId}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {completingId === barista.baristaId ? <Loader size="small" /> : '✓ Complete Order'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.idleSection}
          >
            <span className={styles.idleIcon}>☕</span>
            <p className={styles.idleText}>Waiting for next order</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
};

const Barista = () => {
  const [baristas, setBaristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchBaristas = async () => {
    try {
      const data = await orderAPI.getAllBaristas();
      setBaristas(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch barista status');
      console.error('Error fetching baristas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaristas();
    const interval = setInterval(fetchBaristas, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (baristaId) => {
    setCompletingId(baristaId);
    setError('');
    try {
      await orderAPI.completeBaristaOrder(baristaId);
      await fetchBaristas();
    } catch (err) {
      setError('Failed to complete order');
      console.error('Error completing order:', err);
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="large" text="Loading baristas..." />
      </div>
    );
  }

  const busyCount = baristas.filter(b => b.status === 'BUSY').length;

  return (
    <div className={styles.barista}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Barista Bar</h1>
        <p className={styles.subtitle}>
          {busyCount} of {baristas.length} baristas active
        </p>
      </motion.div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <div className={styles.grid}>
        {baristas.map((barista) => (
          <BaristaCard
            key={barista.baristaId}
            barista={barista}
            onComplete={handleComplete}
            completingId={completingId}
          />
        ))}
      </div>
    </div>
  );
};

export default Barista;
