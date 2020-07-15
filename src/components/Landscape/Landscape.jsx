import React from 'react';
import styles from '../../Main.css';
import { useParams } from 'react-router-dom';

export default function Landscape() {
  const { redirect } = useParams();

  window.addEventListener('orientationchange', () => {
    if(window.orientation === 0) {
      if(redirect === 'home') window.location = '/';
      else window.location = `/${redirect}`;
    }
  });

  return (
    <div className={styles.landscape_detected}>
      <div className={styles.landscape_contents}>
        <p>This website does not currently support landscape mode.</p>
        <p>We appologize for any inconvience.</p>
      </div>
    </div>
  );
}
