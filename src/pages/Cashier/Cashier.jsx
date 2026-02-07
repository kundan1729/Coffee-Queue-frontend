import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../api/orders';
import AnimatedCard from '../../components/AnimatedCard/AnimatedCard';
import Loader from '../../components/Loader/Loader';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import styles from './Cashier.module.css';

const Cashier = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    drinkType: '',
    customerType: 'NEW',
    loyaltyStatus: 'NONE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResponse, setOrderResponse] = useState(null);
  const [simCount, setSimCount] = useState(3);
  const [simLoading, setSimLoading] = useState(false);
  const [simResults, setSimResults] = useState([]);

  const drinkTypes = [
    'Cold Brew',
    'Espresso',
    'Americano',
    'Cappuccino',
    'Latte',
    'Mocha',
  ];

  const customerNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Ethan',
    'Fiona', 'George', 'Hannah', 'Isaac', 'Julia',
    'Kevin', 'Luna', 'Max', 'Nina', 'Oscar',
  ];

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleQuickSimulate = async () => {
    setSimLoading(true);
    setSimResults([]);
    setError('');
    const results = [];
    for (let i = 0; i < simCount; i++) {
      try {
        const order = {
          customerName: randomPick(customerNames),
          drinkType: randomPick(drinkTypes),
          customerType: Math.random() < 0.7 ? 'NEW' : 'REGULAR',
          loyaltyStatus: Math.random() < 0.1 ? 'GOLD' : 'NONE',
        };
        const res = await orderAPI.createOrder(order);
        results.push({ ...order, id: res.id, waitTime: res.estimatedWaitTime, ok: true });
      } catch (err) {
        results.push({ ok: false, error: err.response?.data?.message || 'Failed' });
      }
    }
    setSimResults(results);
    setSimLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOrderResponse(null);

    if (!formData.drinkType) {
      setError('Please select a drink type');
      return;
    }

    setLoading(true);

    try {
      const response = await orderAPI.createOrder(formData);
      setOrderResponse(response);
      setFormData({
        customerName: '',
        drinkType: '',
        customerType: 'NEW',
        loyaltyStatus: 'NONE',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cashier}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Brew Desk</h1>
        <p className={styles.subtitle}>Create a fresh order</p>
      </motion.div>

      <div className={styles.container}>
        <AnimatedCard delay={0.1} hover={false} className={styles.formCard}>
          {error && <ErrorBanner message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="customerName">
                Customer Name
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Optional"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="drinkType">
                Drink Type *
              </label>
              <select
                id="drinkType"
                name="drinkType"
                value={formData.drinkType}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Select a drink</option>
                {drinkTypes.map((drink) => (
                  <option key={drink} value={drink}>
                    {drink}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="customerType">
                Customer Type
              </label>
              <select
                id="customerType"
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="NEW">New Customer</option>
                <option value="REGULAR">Regular Customer</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="loyaltyStatus">
                Loyalty Status
              </label>
              <select
                id="loyaltyStatus"
                name="loyaltyStatus"
                value={formData.loyaltyStatus}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="NONE">None</option>
                <option value="GOLD">Gold Member</option>
              </select>
            </div>

            <motion.button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader size="small" /> : 'Create Order'}
            </motion.button>
          </form>
        </AnimatedCard>

        <AnimatePresence>
          {orderResponse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard delay={0} className={styles.successCard}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>Order Created Successfully!</h2>
                <div className={styles.orderDetails}>
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Order ID:</span>
                    <span className={styles.detailValue}>#{orderResponse.id}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Estimated Wait Time:</span>
                    <span className={styles.detailValue}>
                      {orderResponse.estimatedWaitTime} minutes
                    </span>
                  </div>
                  {orderResponse.priorityReason && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Priority:</span>
                      <span className={styles.detailValue}>
                        {orderResponse.priorityReason}
                      </span>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <AnimatedCard delay={0.3} hover={false} className={styles.simCard}>
          <h2 className={styles.simTitle}>Quick Simulate</h2>
          <p className={styles.simSubtitle}>Batch-create random orders for testing</p>
          <div className={styles.simControls}>
            <div className={styles.simCountRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.simCountBtn} ${simCount === n ? styles.simCountActive : ''}`}
                  onClick={() => setSimCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <motion.button
              type="button"
              className={`btn btn-primary ${styles.simBtn}`}
              disabled={simLoading}
              onClick={handleQuickSimulate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {simLoading ? <Loader size="small" /> : `Create ${simCount} Order${simCount > 1 ? 's' : ''}`}
            </motion.button>
          </div>

          <AnimatePresence>
            {simResults.length > 0 && (
              <motion.div
                className={styles.simResults}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {simResults.map((r, i) => (
                  <div key={i} className={`${styles.simResultRow} ${r.ok ? styles.simOk : styles.simFail}`}>
                    {r.ok ? (
                      <>
                        <span className={styles.simDot}>✓</span>
                        <span className={styles.simName}>{r.customerName}</span>
                        <span className={styles.simDrink}>{r.drinkType}</span>
                        <span className={styles.simWait}>~{r.waitTime}m</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.simDot}>✗</span>
                        <span className={styles.simError}>{r.error}</span>
                      </>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedCard>
      </motion.div>
    </div>
  );
};

export default Cashier;
