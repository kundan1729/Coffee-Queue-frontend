import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../api/orders';
import AnimatedCard from '../../components/AnimatedCard/AnimatedCard';
import Loader from '../../components/Loader/Loader';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import styles from './Cashier.module.css';

const Cashier = () => {
  const [formData, setFormData] = useState({
    drinkType: '',
    customerType: 'NEW',
    loyaltyStatus: 'NONE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResponse, setOrderResponse] = useState(null);

  const drinkTypes = [
    'Espresso',
    'Americano',
    'Cappuccino',
    'Latte',
    'Mocha',
    'Macchiato',
    'Flat White',
    'Cold Brew',
  ];

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
    </div>
  );
};

export default Cashier;
