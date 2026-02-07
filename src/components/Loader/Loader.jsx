import { motion } from 'framer-motion';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', text = '' }) => {
  const sizeClass = styles[size] || styles.medium;

  return (
    <div className={styles.loaderContainer}>
      <motion.div
        className={`${styles.loader} ${sizeClass}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className={styles.spinner}></div>
      </motion.div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loader;
