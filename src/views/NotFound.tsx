import styles from '@/styles/NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <div className={styles.errorMessage}>
          <h2>页面未找到</h2>
          <p>很抱歉，您访问的页面不存在或已被移除。</p>
        </div>
        <div className={styles.illustration}>
          <div className={styles.astronaut}>
            <div className={styles.head}></div>
            <div className={styles.body}></div>
            <div className={styles.arm} style={{ left: '15px' }}></div>
            <div className={styles.arm} style={{ right: '15px' }}></div>
            <div className={styles.leg} style={{ left: '20px' }}></div>
            <div className={styles.leg} style={{ right: '20px' }}></div>
          </div>
          <div className={styles.planet}></div>
          <div className={styles.stars}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;