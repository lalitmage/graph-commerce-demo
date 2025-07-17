import { useState } from "react";
import Link from "next/link";
import styles from "./MenuDropdown.module.css";
import { Menu } from "lucide-react"; // Using lucide-react for the hamburger icon

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.menuContainer}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Menu Button */}
      <button className={styles.menuButton}>
        <Menu size={20} className={styles.menuIcon} />
        <span>MENU</span>
        <span className={styles.arrow}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/about-us" className={styles.dropdownItem}>About Us</Link>
          <Link href="/our-brands" className={styles.dropdownItem}>Our Brand</Link>
          <Link href="/our-guarantee" className={styles.dropdownItem}>Our Guarantee</Link>
          <Link href="/best-sellers" className={styles.dropdownItem}>Best Sellers</Link>
          <Link href="/promotions" className={styles.dropdownItem}>Promotions</Link>
          <Link href="/service/contact-us" className={styles.dropdownItem}>Contact Us</Link>
          <Link href="/blog" className={styles.dropdownItem}>Blog</Link>
        </div>
      )}
    </div>
  );
}
