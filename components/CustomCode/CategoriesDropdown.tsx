import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CategoriesDropdown.module.css'
import { useQuery } from '@apollo/client'
import {
  GetCategoriesDocument,
  GetCategoriesQuery,
} from '../CustomCode/GraphqlQuries/CategoryDropdown.gql'

export default function CategoriesDropdown() {
  const { data, loading, error } = useQuery<GetCategoriesQuery>(GetCategoriesDocument)
  const [isOpen, setIsOpen] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  let closeTimeout: NodeJS.Timeout | null = null

  useEffect(() => {
    if (!loading) setIsDataLoaded(true)
  }, [loading])

  if (error) return <p>Error loading categories</p>

  const category = data?.categories?.items?.[0]
  const hasChildren = Array.isArray(category?.children) && category.children.length > 0

  const handleMouseEnter = () => {
    if (closeTimeout) clearTimeout(closeTimeout)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => setIsOpen(false), 300)
  }

  return (
    <div
      className={styles.dropdownContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Categories Button */}
      <button className={styles.categoriesButton} aria-haspopup='true' aria-expanded={isOpen}>
        CATEGORIES
        <span className={styles.menuIcon}>&#9776;</span> {/* Menu icon */}
      </button>

      {/* Dropdown */}
      {isOpen && isDataLoaded && hasChildren && (
        <div className={styles.dropdownMenu} role='menu'>
          {category!.children!.map(
            (subcategory) =>
              subcategory && (
                <Link
                  key={subcategory.uid}
                  href={`/${subcategory.url_path}`}
                  className={styles.categoryItem}
                  role='menuitem'
                >
                  {subcategory.name}
                </Link>
              ),
          )}
        </div>
      )}
    </div>
  )
}
