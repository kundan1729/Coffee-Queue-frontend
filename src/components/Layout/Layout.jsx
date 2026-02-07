import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = () => {
  const navItems = [
    { path: '/cashier', label: 'Brew Desk', icon: '💳' },
    { path: '/queue', label: 'Order Board', icon: '📋' },
    { path: '/barista', label: 'Barista Bar', icon: '☕' },
    { path: '/manager', label: 'Cafe Insights', icon: '📊' },
  ];

  return (
    <div className={styles.layout}>
      <motion.aside
        className={styles.sidebar}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.logo}>
          <span className={styles.logoIcon}>☕</span>
          <h1 className={styles.logoText}>Coffee Queue</h1>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <p className={styles.footerText}>Smart Queue v1.0</p>
        </div>
      </motion.aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.statusBar}>
            <motion.div
              className={styles.statusIndicator}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>System Active</span>
            </motion.div>
          </div>
        </header>

        <main className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            key={location.pathname}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
