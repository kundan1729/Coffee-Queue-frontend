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
  const [activeTab, setActiveTab] = useState('overview');
  const [statsRows, setStatsRows] = useState([]);
  const [selectedTest, setSelectedTest] = useState('test1');
  const [statsSummary, setStatsSummary] = useState(null);
  const [baristaStats, setBaristaStats] = useState(null);
  const [orderRows, setOrderRows] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [frequencyAnalytics, setFrequencyAnalytics] = useState([]);

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

  const runBackendSimulation = async (testId) => {
    const testCase = testId === 'test2' ? 'TEST_2' : 'TEST_1';
    setStatsLoading(true);
    setStatsError('');
    try {
      const data = await orderAPI.runSimulation(testCase);
      setStatsSummary(data.summary);
      setBaristaStats(data.baristas);
      setStatsRows(data.slots || []);
      setOrderRows(data.orders || []);
      setFrequencyAnalytics(data.frequencyAnalytics || []);
    } catch (err) {
      setStatsError('Failed to run simulation');
      console.error('Error running simulation:', err);
    } finally {
      setStatsLoading(false);
    }
  };



  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && activeTab === 'overview') {
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

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'stats' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
      </div>

      {error && activeTab === 'overview' && (
        <ErrorBanner message={error} onClose={() => setError('')} />
      )}

      {activeTab === 'stats' && (
        <div className={styles.statsSection}>
          <div className={styles.statsHeader}>
            <div>
              <h2 className={styles.statsTitle}>Test Results</h2>
              <p className={styles.statsSubtitle}>Backend simulation using live algorithm</p>
            </div>
            <div className={styles.statsControls}>
              <select
                className={styles.statsSelect}
                value={selectedTest}
                onChange={(event) => setSelectedTest(event.target.value)}
              >
                <option value="test1">Test 1: Simulate 200 orders</option>
                <option value="test2">Test 2: Orders between 7:00-10:00 AM</option>
              </select>
              <button
                type="button"
                className={`btn btn-primary ${styles.statsBtn}`}
                onClick={() => runBackendSimulation(selectedTest)}
              >
                {statsLoading ? 'Running...' : 'Run Simulation'}
              </button>
            </div>
          </div>

          {statsError && <ErrorBanner message={statsError} onClose={() => setStatsError('')} />}

          {statsSummary && (
            <div className={styles.statsCards}>
              <div className={styles.statsCard}>
                <p className={styles.statsCardLabel}>Total Orders</p>
                <p className={styles.statsCardValue}>{statsSummary.totalOrders}</p>
              </div>
              <div className={styles.statsCard}>
                <p className={styles.statsCardLabel}>Avg Wait Time</p>
                <p className={styles.statsCardValue}>{statsSummary.avgWaitMinutes} min</p>
              </div>
              <div className={styles.statsCard}>
                <p className={styles.statsCardLabel}>Max Wait Time</p>
                <p className={styles.statsCardValue}>{statsSummary.maxWaitMinutes} min</p>
              </div>
              <div className={styles.statsCard}>
                <p className={styles.statsCardLabel}>Timeout Rate</p>
                <p className={styles.statsCardValue}>{statsSummary.timeoutRatePercent} %</p>
              </div>
              <div className={styles.statsCard}>
                <p className={styles.statsCardLabel}>Fairness Issues</p>
                <p className={styles.statsCardValue}>{statsSummary.fairnessViolations}</p>
              </div>
              <div className={styles.statsCard}>
                <p className={styles.statsCardLabel}>Abandoned</p>
                <p className={styles.statsCardValue}>{statsSummary.abandonedOrders || 0}</p>
              </div>
            </div>
          )}

          {statsSummary && baristaStats && (
            <div className={styles.summaryTableWrapper}>
              <table className={styles.summaryTable}>
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Avg Wait (min)</th>
                    <th>B1 Avg (min)</th>
                    <th>B2 Avg (min)</th>
                    <th>B3 Avg (min)</th>
                    <th>Complaints</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedTest === 'test2' ? 'Test 2' : 'Test 1'}</td>
                    <td>{statsSummary.avgWaitMinutes}</td>
                    <td>{baristaStats.b1AvgWaitMinutes}</td>
                    <td>{baristaStats.b2AvgWaitMinutes}</td>
                    <td>{baristaStats.b3AvgWaitMinutes}</td>
                    <td>{statsSummary.complaints}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {frequencyAnalytics.length > 0 && (
            <div className={styles.frequencySection}>
              <h3 className={styles.frequencyTitle}>Drink Frequency Analytics</h3>
              <div className={styles.frequencyGrid}>
                {frequencyAnalytics.map((row) => {
                  const isOver = row.actualPercent > row.expectedPercent + 1;
                  const isUnder = row.actualPercent < row.expectedPercent - 1;
                  return (
                    <div key={row.drinkType} className={styles.freqCard}>
                      <div className={styles.freqHeader}>
                        <span className={styles.freqDrink}>{row.drinkType}</span>
                        <span className={styles.freqPrep}>{row.prepMinutes} min</span>
                      </div>
                      <div className={styles.freqBars}>
                        <div className={styles.freqBarRow}>
                          <span className={styles.freqBarLabel}>Expected</span>
                          <div className={styles.freqBarTrack}>
                            <div
                              className={styles.freqBarExpected}
                              style={{ width: `${Math.min(row.expectedPercent * 3, 100)}%` }}
                            />
                          </div>
                          <span className={styles.freqBarValue}>{row.expectedPercent}%</span>
                        </div>
                        <div className={styles.freqBarRow}>
                          <span className={styles.freqBarLabel}>Actual</span>
                          <div className={styles.freqBarTrack}>
                            <div
                              className={`${styles.freqBarActual} ${isOver ? styles.freqOver : ''} ${isUnder ? styles.freqUnder : ''}`}
                              style={{ width: `${Math.min(row.actualPercent * 3, 100)}%` }}
                            />
                          </div>
                          <span className={styles.freqBarValue}>{row.actualPercent}%</span>
                        </div>
                      </div>
                      <div className={styles.freqFooter}>
                        <span className={styles.freqCount}>{row.count} orders</span>
                        <span className={`${styles.freqDeviation} ${row.deviationPercent > 0 ? styles.freqDevPos : row.deviationPercent < 0 ? styles.freqDevNeg : ''}`}>
                          {row.deviationPercent > 0 ? '+' : ''}{row.deviationPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.statsTableWrapper}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Arrived</th>
                  <th>Completed</th>
                  <th>Avg Wait</th>
                  <th>Max Wait</th>
                  <th>Timeout %</th>
                  <th>Fair Viol.</th>
                  <th>Utiliz.</th>
                </tr>
              </thead>
              <tbody>
                {statsLoading ? (
                  <tr>
                    <td colSpan="8" className={styles.statsEmpty}>
                      Running simulation...
                    </td>
                  </tr>
                ) : statsRows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.statsEmpty}>
                      Run a simulation to view results
                    </td>
                  </tr>
                ) : (
                  statsRows.map((row) => (
                    <tr key={row.timeSlot}>
                      <td>{row.timeSlot}</td>
                      <td>{row.arrived}</td>
                      <td>{row.completed}</td>
                      <td>{row.avgWaitMinutes}m</td>
                      <td>{row.maxWaitMinutes}m</td>
                      <td>{row.timeoutRatePercent}%</td>
                      <td>{row.fairnessViolations}</td>
                      <td>
                        <div className={styles.utilCell}>
                          <div className={styles.utilBar}>
                            <span
                              className={styles.utilFill}
                              style={{ width: `${Math.min(row.utilizationPercent, 100)}%` }}
                            />
                          </div>
                          <span className={styles.utilLabel}>{row.utilizationPercent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.ordersSection}>
            <h3 className={styles.ordersTitle}>All Simulated Orders</h3>
            <div className={styles.ordersTableWrapper}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Arrival (min)</th>
                    <th>Drink</th>
                    <th>Customer</th>
                    <th>Loyalty</th>
                    <th>Wait (min)</th>
                    <th>Barista</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRows.length === 0 ? (
                    <tr>
                      <td colSpan="8" className={styles.statsEmpty}>
                        Run a simulation to view order details
                      </td>
                    </tr>
                  ) : (
                    orderRows.map((order, index) => (
                      <tr key={`${order.arrivalMinutes}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{order.arrivalMinutes}</td>
                        <td>{order.drinkType}</td>
                        <td>{order.customerType}</td>
                        <td>{order.loyaltyType}</td>
                        <td>{order.waitMinutes}</td>
                        <td>{order.assignedBarista || '-'}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <>

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
                        <h3 className={styles.alertOrderId}>
                          {alert.orderId ? `Order #${alert.orderId}` : 'System Alert'}
                        </h3>
                        {alert.customerName && (
                          <p className={styles.alertMessage}>
                            {alert.customerName} · {alert.isNewCustomer ? 'New' : 'Regular'}
                          </p>
                        )}
                        {alert.message && !alert.customerName && (
                          <p className={styles.alertMessage}>{alert.message}</p>
                        )}
                      </div>
                      <div className={styles.alertTime}>
                        {alert.waitTimeMinutes != null && (
                          <>
                            <span className={styles.alertTimeValue}>
                              {alert.waitTimeMinutes}
                            </span>
                            <span className={styles.alertTimeLabel}>
                              /{alert.thresholdMinutes || '-'} min
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {(alert.severity || alert.recommendedAction) && (
                      <div className={styles.alertMeta}>
                        {alert.severity && (
                          <span
                            className={`${styles.alertBadge} ${styles[`alertBadge${alert.severity}`] || ''}`}
                          >
                            {alert.severity}
                          </span>
                        )}
                        {alert.recommendedAction && (
                          <span className={styles.alertAction}>{alert.recommendedAction}</span>
                        )}
                      </div>
                    )}
                  </AnimatedCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
        </>
      )}
    </div>
  );
};

export default Manager;
