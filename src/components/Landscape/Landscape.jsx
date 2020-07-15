import React from 'react';
import styles from '../../Main.css';

export default function Landscape() {

  window.addEventListener('orientationchange', () => {
    if(window.orientation === 0) window.location = '/';
  });

  return (
    <div className={styles.landscape_detected}>
      <div className={styles.landscape_contents}>
        <p>This website currently does not support landscape mode.</p>
        <p>We appologize for any inconvience.</p>
      </div>
    </div>
  );
}
