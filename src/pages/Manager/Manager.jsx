import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../api/orders';
import StatCard from '../../components/StatCard/StatCard';
import AnimatedCard from '../../components/AnimatedCard/AnimatedCard';
import Loader from '../../components/Loader/Loader';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import styles from './Manager.module.css';

const Manager = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [metricsData, alertsData] = await Promise.all([
        orderAPI.getMetrics(),
        orderAPI.getAlerts(),
      ]);
      setMetrics(metricsData);
      setAlerts(alertsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch manager data');
      console.error('Error fetching manager data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="large" text="Loading manager dashboard..." />
      </div>
    );
  }

  return (
    <div className={styles.manager}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Cafe Insights</h1>
        <p className={styles.subtitle}>System metrics and performance monitoring</p>
      </motion.div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <div className={styles.metricsGrid}>
        <StatCard
          title="Average Wait Time"
          value={metrics?.averageWaitTime || 0}
          unit="min"
          icon="⏱️"
          delay={0.1}
        />
        <StatCard
          title="Max Wait Time"
          value={metrics?.maxWaitTime || 0}
          unit="min"
          icon="⏰"
          delay={0.2}
        />
        <StatCard
          title="Timeout Rate"
          value={metrics?.timeoutRate || 0}
          unit="%"
          icon="📉"
          delay={0.3}
        />
      </div>

      <motion.div
        className={styles.alertsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className={styles.alertsHeader}>
          <h2 className={styles.alertsTitle}>Active Alerts</h2>
          {alerts.length > 0 && (
            <motion.span
              className={styles.alertCount}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {alerts.length}
            </motion.span>
          )}
        </div>

        <div className={styles.alertsContainer}>
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <motion.div
                key="no-alerts"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <AnimatedCard className={styles.noAlerts}>
                  <span className={styles.noAlertsIcon}>✓</span>
                  <h3 className={styles.noAlertsTitle}>All Clear!</h3>
                  <p className={styles.noAlertsText}>
                    No orders are exceeding the wait time threshold
                  </p>
                </AnimatedCard>
              </motion.div>
            ) : (
              alerts.map((alert, index) => (
                <motion.div
                  key={alert.orderId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AnimatedCard className={styles.alertCard} hover={true}>
                    <div className={styles.alertHeader}>
                      <motion.span
                        className={styles.alertIcon}
                        animate={{
                          rotate: [0, 10, -10, 10, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        ⚠️
                      </motion.span>
                      <div className={styles.alertInfo}>
                        <h3 className={styles.alertOrderId}>Order #{alert.orderId}</h3>
                        <p className={styles.alertMessage}>{alert.message}</p>
                      </div>
                      <div className={styles.alertTime}>
                        <span className={styles.alertTimeValue}>{alert.waitTime}</span>
                        <span className={styles.alertTimeLabel}>minutes</span>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Manager;
