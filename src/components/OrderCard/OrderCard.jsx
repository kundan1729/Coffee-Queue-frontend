import { motion } from 'framer-motion';
import styles from './OrderCard.module.css';

const OrderCard = ({ order, isEmergency = false, delay = 0 }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay }}
      className={`${styles.orderCard} ${isEmergency ? styles.emergency : ''}`}
    >
      {isEmergency && (
        <motion.div
          className={styles.emergencyBadge}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          EMERGENCY
        </motion.div>
      )}

      <div className={styles.header}>
        <h3 className={styles.orderId}>Order #{order.id}</h3>
        {order.estimatedWaitTime && (
          <span className={styles.waitTime}>{order.estimatedWaitTime}m</span>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.drinkType}>{order.drinkType}</p>
        {order.priorityReason && (
          <p className={styles.priority}>{order.priorityReason}</p>
        )}
        {order.customerType && (
          <span className={styles.badge}>{order.customerType}</span>
        )}
        {order.loyaltyStatus && order.loyaltyStatus !== 'NONE' && (
          <span className={`${styles.badge} ${styles.gold}`}>{order.loyaltyStatus}</span>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCard;
