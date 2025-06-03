import React from 'react';
import styles from './NewsletterSubscription.module.css';

const NewsletterSubscription = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={styles.topText}>SUBSCRIBE TO OUR NEWSLETTER FOR</p>
        <h2 className={styles.heading}>Exciting Updates and Promos!</h2>
        <p className={styles.description}>
          Here at Tong Garden, we never stop experimenting and learning to make
          snacks even better. Subscribe to our newsletter to find out more!
        </p>
        <button className={styles.signupButton}>SIGNUP OFFER</button>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
