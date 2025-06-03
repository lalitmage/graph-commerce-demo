import React from 'react';
import styles from './CustomFooter.module.css';

const CustomFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Column 1: Contact Info */}
        <div className={styles.column}>
          <h2 className={styles.logo}>TONG GARDEN</h2>
          <p className={styles.text}>
            Plot NO.SM-14/Sanand GIDC-2, Sanand Viramgam Highway,<br />
            Sanand, Gujarat, India - 382170
          </p>
          <p className={styles.text}>+91 93201-74808</p>
          <p className={styles.text}>shop.india@tonggarden.com</p>
          <p className={styles.copy}>Copyright 2022 Tong Garden. All rights reserved.</p>
        </div>

        {/* Column 2: Information Links */}
        <div className={styles.column}>
          <h3 className={styles.heading}>INFORMATION</h3>
          <ul className={styles.linkList}>
            <li><a href="#">Shop</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Terms & Condition</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Frequently Asked Question</a></li>
            <li><a href="#">Return & Refund</a></li>
            <li><a href="#">CSR</a></li>
          </ul>
        </div>

        {/* Column 3: Sign Up Form */}
        <div className={styles.column}>
          <h3 className={styles.heading}>SIGN UP & SAVE</h3>
          <p className={styles.subtext}>
            Get a free gift from us. Be the first to know about exclusive promo offers!
          </p>
          <form className={styles.form}>
            <input
              type="text"
           
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email Address"
              className={styles.input}
            />
            <button type="submit" className={styles.submit}>
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
