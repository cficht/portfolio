import React from 'react';
import styles from '../../Main.css';
import { useParams } from 'react-router-dom';

export default function Landscape() {
  const { redirect } = useParams();

  window.addEventListener('orientationchange', () => {
    if(redirect === 'home') window.location = '/';
    else window.location = `/${redirect}`;
  });

  window.addEventListener('resize', () => {
    if(redirect === 'home') window.location = '/';
    else window.location = `/${redirect}`;
  });

  return (
    <div className={styles.landscape_detected}>
      <div className={styles.landscape_contents}>
        <p>This website does not support this aspect ratio.</p>
        <p>We appologize for any inconvience.</p>
      </div>
    </div>
  );
}
