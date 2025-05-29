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
        <Link href="/shop" passHref>
          <span className={styles.navLink} aria-haspopup="true" aria-expanded={isOpen}>
            Shop
          </span>
        </Link>

        {isOpen && isDataLoaded && hasChildren && (
          <div className={styles.dropdown} role="menu">
            {category!.children!.map((subcategory) => (
              subcategory && ( 
                <Link
                  key={subcategory.uid}
                  href={`/category/${subcategory.url_path}`}
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
      <Link href="/new-arrivals" passHref>
        <span className={styles.navLink}>New Arrivals</span>
      </Link>
      <Link href="/deals-for-the-month" passHref>
        <span className={styles.navLink}>Deals for the Month</span>
      </Link>
    </nav>
  );
}





// import { useState } from "react";
// import Link from "next/link";
// import styles from "./NavLinks.module.css";
// import { useQuery } from "@apollo/client";
// import { GetCategoriesDocument, GetCategoriesQuery } from "../CustomCode/GraphqlQuries/CategoryDropdown.gql";

// export default function NavLinks() {
//   const { data, loading, error } = useQuery<GetCategoriesQuery>(GetCategoriesDocument);
//   const [isOpen, setIsOpen] = useState(false);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error loading categories</p>;

//   const category = data?.categories?.items?.[0];

//   return (
//     <nav className={styles.navContainer}>
//       {/* SHOP with Dropdown */}
//       <div
//         className={styles.navItem}
//         onMouseEnter={() => setIsOpen(true)}
//         onMouseLeave={() => setIsOpen(false)}
//       >
//         <Link href="/shop" passHref>
//           <span className={styles.navLink}>Shop</span>
//         </Link>
//         {isOpen && category?.children && (
//           <div className={styles.dropdown}>
//             {category.children.map((subcategory) => (
//               <Link
//                 key={subcategory?.uid}
//                 href={`/category/${subcategory?.url_path}`}
//                 className={styles.categoryItem}
//               >
//                 <img
//                   src={subcategory?.image || "/placeholder.jpg"}
//                   alt={subcategory?.name || "Category"}
//                   className={styles.categoryImage}
//                 />
//                 <span>{subcategory?.name}</span>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Other Links */}
//       <Link href="/promotions" passHref>
//         <span className={styles.navLink}>Promotions</span>
//       </Link>
//       <Link href="/new-arrivals" passHref>
//         <span className={styles.navLink}>New Arrivals</span>
//       </Link>
//       <Link href="/deals-for-the-month" passHref>
//         <span className={styles.navLink}>Deals for the Month</span>
//       </Link>
//     </nav>
//   );
// }
