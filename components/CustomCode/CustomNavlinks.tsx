
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./NavLinks.module.css";
import { useQuery } from "@apollo/client";
import { GetCategoriesDocument, GetCategoriesQuery } from "../CustomCode/GraphqlQuries/CategoryDropdown.gql";

export default function NavLinks() {
  const { data, loading, error } = useQuery<GetCategoriesQuery>(GetCategoriesDocument);
  const [isOpen, setIsOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  let closeTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (!loading) setIsDataLoaded(true);
  }, [loading]);

  if (error) return <p>Error loading categories</p>;

  const category = data?.categories?.items?.[0];
  const hasChildren = Array.isArray(category?.children) && category.children.length > 0;

  const handleMouseEnter = () => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => setIsOpen(false), 300); 
  };

  return (
    <nav className={styles.navContainer}>
    
      <div
        className={styles.navItem}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href="/#" passHref>
          <span className={styles.navLink} aria-haspopup="true" aria-expanded={isOpen}>
            Shop
          </span>
        </Link>

        {isOpen && isDataLoaded && hasChildren && (
          <div className={styles.dropdown} role="menu">
            {/* ✅ Add parent category ("Our Products") at the top */}
            <Link
              key={category.uid}
              href={`/${category.url_path}`}
              className={styles.categoryItem}
              role="menuitem"
            >
              <img
                src={category.image || "/placeholder.jpg"}
                alt={category.name || "Category"}
                className={styles.categoryImage}
              />
              <span>{category.name}</span>
            </Link>

            {/* ✅ Then render children */}
            {category.children?.map((subcategory) => (
              subcategory && ( 
                <Link
                  key={subcategory.uid}
                  href={`/${subcategory.url_path}`}
                  className={styles.categoryItem}
                  role="menuitem"
                >
                  <img
                    src={subcategory.image || "/placeholder.jpg"}
                    alt={subcategory.name || "Category"}
                    className={styles.categoryImage}
                  />
                  <span>{subcategory.name}</span>
                </Link>
              )
            ))}
          </div>
        )}
      </div>

      {/* Other Links */}
      <Link href="/promotions" passHref>
        <span className={styles.navLink}>Promotions</span>
      </Link>
      <Link href="/new-arrival" passHref>
        <span className={styles.navLink}>New Arrivals</span>
      </Link>
      <Link href="/deals-for-the-month" passHref>
        <span className={styles.navLink}>Deals for the Month</span>
      </Link>
    </nav>
  );
}
