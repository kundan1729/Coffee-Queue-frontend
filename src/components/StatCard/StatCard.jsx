import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import AnimatedCard from '../AnimatedCard/AnimatedCard';
import styles from './StatCard.module.css';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { duration: 1000 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const StatCard = ({ title, value, unit = '', icon, delay = 0 }) => {
  return (
    <AnimatedCard delay={delay} className={styles.statCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>
        <AnimatedNumber value={value} />
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </AnimatedCard>
  );
};

export default StatCard;
