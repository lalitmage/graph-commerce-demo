import { useApolloClient } from '@graphcommerce/graphql'
import { useState, useRef, useEffect } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos, FavoriteBorder } from '@mui/icons-material'
import { GetProductsByCategoryIdDocument } from './GraphqlQuries/ProductsByCategory.gql'
import styles from './ShopNowCarousel.module.css'
import Link from 'next/link'

type ShopNowCarouselProps = {
  categoryTabs: any
  initialProducts: any
}

export function ShopNowCarousel({ categoryTabs, initialProducts }: ShopNowCarouselProps) {
  const client = useApolloClient()
  const defaultUid = 'NjE='
  const [selectedUid, setSelectedUid] = useState(defaultUid)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [products, setProducts] = useState(initialProducts?.category?.products?.items ?? [])
  const [loading, setLoading] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)
  const tabs = categoryTabs?.category?.children ?? []

  const scrollLeft = () => setScrollIndex((prev) => Math.max(prev - 5, 0))
  const scrollRight = () =>
    setScrollIndex((prev) => (prev + 5 < products.length ? prev + 5 : prev))

  const fetchProducts = async (uid: string) => {
    const tab = tabs.find((t: any) => t.uid === uid)
    const id = tab?.id
    if (!id) return

    setLoading(true)
    try {
      const { data } = await client.query({
        query: GetProductsByCategoryIdDocument,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      setProducts(data?.category?.products?.items ?? [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = scrollIndex * 216
      carouselRef.current.style.transform = `translateX(-${scrollAmount}px)`
    }
  }, [scrollIndex])

  useEffect(() => {
    if (selectedUid !== defaultUid) {
      fetchProducts(selectedUid)
      setScrollIndex(0)
    } else {
      setProducts(initialProducts?.category?.products?.items ?? [])
      setScrollIndex(0)
    }
  }, [selectedUid])

  const selectedTab = tabs.find((tab: any) => tab.uid === selectedUid)
const categoryUrl = selectedTab?.url_path ? `/${selectedTab.url_path}` : '/'


  return (
    <Box className={styles.container}>
      {/* Tabs */}
      <Box className={styles.tabsContainer}>
        {tabs.map((tab: any) =>
          tab?.uid ? (
            <button
              key={tab.uid}
              className={`${styles.tabButton} ${selectedUid === tab.uid ? styles.activeTab : ''}`}
              onClick={() => setSelectedUid(tab.uid)}
            >
              {tab.name}
            </button>
          ) : null
        )}
      </Box>

      {/* Product Carousel */}
      {loading ? (
        <Typography sx={{ mt: 2 }}>Loading products...</Typography>
      ) : products.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No products available.</Typography>
      ) : (
        <Box className={styles.carouselWrapper}>
          <IconButton
            className={styles.arrowLeft}
            onClick={scrollLeft}
            disabled={scrollIndex === 0}
          >
            <ArrowBackIos />
          </IconButton>

          <Box className={styles.carousel}>
            <Box className={styles.carouselInner} ref={carouselRef}>
              {products.map((product: any) =>
                product ? (
                  <Box key={product.uid} className={styles.productCard}>
                    {/* Wishlist Icon */}
                    <Box className={styles.wishlistIcon}>
                      <FavoriteBorder />
                    </Box>

                    {/* Product link */}
                    <Link href={`/p/${product?.url_key}`} legacyBehavior>
                      <a style={{ textDecoration: 'none', color: 'black' }}>
                        <img
                          src={product.image?.url ?? ''}
                          alt={product.name ?? 'Product'}
                          className={styles.productImage}
                        />
                        <Typography className={styles.productName}>{product.name}</Typography>
                      </a>
                    </Link>

                    <Typography className={styles.productPrice}>
                      ₹{product.price_range.minimum_price.final_price.value}
                    </Typography>

                    {/* Add to Cart */}
                    <button className={styles.addToCartButton}>ADD TO CART</button>
                  </Box>
                ) : null
              )}
            </Box>
          </Box>

          <IconButton
            className={styles.arrowRight}
            onClick={scrollRight}
            disabled={scrollIndex + 5 >= products.length}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      )}
<Box className={styles.shopNowWrapper}>
  <Link href={categoryUrl} passHref legacyBehavior>
    <a className={styles.shopNowButton} style={{ textDecoration: 'none' }}>SHOP NOW</a>
  </Link>
</Box>

    </Box>
  )
}
