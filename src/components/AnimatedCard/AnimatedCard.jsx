import { motion } from 'framer-motion';
import styles from './AnimatedCard.module.css';

const AnimatedCard = ({ children, className = '', delay = 0, hover = true, ...props }) => {
  return (
    <motion.div
      className={`${styles.card} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)' } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
