import { useApolloClient } from '@graphcommerce/graphql'
import { useState, useRef, useEffect } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos, FavoriteBorder } from '@mui/icons-material'
import { GetProductsByCategoryIdDocument } from './GraphqlQuries/ProductsByCategory.gql'
import styles from './ShopNowCarousel.module.css'

const CATEGORY_UID_TO_ID: Record<string, number> = {
  'NjE=': 61, 'NjM=': 63, 'NTg=': 58,
  'NDk=': 49, 'NTA=': 50, 'NTQ=': 54,
  'NzI=': 72, 'NzQ=': 74,
}

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

  const scrollLeft = () => {
    setScrollIndex((prev) => Math.max(prev - 5, 0))
  }

  const scrollRight = () => {
    setScrollIndex((prev) =>
      prev + 5 < products.length ? prev + 5 : prev
    )
  }

  const fetchProducts = async (uid: string) => {
    const id = CATEGORY_UID_TO_ID[uid]
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
      // Reset to initialProducts if back to default
      setProducts(initialProducts?.category?.products?.items ?? [])
      setScrollIndex(0)
    }
  }, [selectedUid])

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
                    <Box className={styles.wishlistIcon}>
                      <FavoriteBorder />
                    </Box>
                    <img
                      src={product.image?.url ?? ''}
                      alt={product.name ?? 'Product'}
                      className={styles.productImage}
                    />
                    <Typography className={styles.productName}>{product.name}</Typography>
                    <Typography className={styles.productPrice}>
                      ₹{product.price_range.minimum_price.final_price.value}
                    </Typography>
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
        <button className={styles.shopNowButton}>SHOP NOW</button>
      </Box>
    </Box>
  )
}

// import { useQuery } from '@graphcommerce/graphql'
// import { useState, useRef, useEffect } from 'react'
// import { Box, Typography, IconButton } from '@mui/material'
// import { ArrowBackIos, ArrowForwardIos, FavoriteBorder } from '@mui/icons-material'
// import { GetSubcategoriesOf45TabsDocument } from './GraphqlQuries/CategoryTabs.gql'
//  import { GetProductsByCategoryIdDocument } from './GraphqlQuries/ProductsByCategory.gql'
// import styles from './ShopNowCarousel.module.css'
// // import {GetProductsByCategoryIdDocument} from './GraphqlQuries/ProductListItem.gql'

// const CATEGORY_UID_TO_ID: Record<string, number> = {
//   'NjE=': 61, 'NjM=': 63, 'NTg=': 58,
//   'NDk=': 49, 'NTA=': 50, 'NTQ=': 54,
//   'NzI=': 72, 'NzQ=': 74,
// }

// export function ShopNowCarousel() {
//   const defaultUid = 'NjE='
//   const [selectedUid, setSelectedUid] = useState(defaultUid)
//   const [scrollIndex, setScrollIndex] = useState(0)
//   const carouselRef = useRef<HTMLDivElement>(null)

//   const { data: tabsData } = useQuery(GetSubcategoriesOf45TabsDocument)
//   const tabs = tabsData?.category?.children ?? []

//   const selectedId = CATEGORY_UID_TO_ID[selectedUid]
//   const { data: productsData, loading } = useQuery(GetProductsByCategoryIdDocument, {
//     variables: { id: selectedId },
//     skip: !selectedId,
//   })

//   const products = productsData?.category?.products?.items ?? []

//   const scrollLeft = () => {
//     setScrollIndex((prev) => Math.max(prev - 5, 0))
//   }

//   const scrollRight = () => {
//     setScrollIndex((prev) =>
//       prev + 5 < products.length ? prev + 5 : prev
//     )
//   }

//   useEffect(() => {
//     if (carouselRef.current) {
//       const scrollAmount = scrollIndex * 216 
//       carouselRef.current.style.transform = `translateX(-${scrollAmount}px)`
//     }
//   }, [scrollIndex])

//   return (
//     <Box className={styles.container}>
//       {/* Tabs */}
//       <Box className={styles.tabsContainer}>
//         {tabs.map((tab) =>
//           tab?.uid ? (
//             <button
//               key={tab.uid}
//               className={`${styles.tabButton} ${selectedUid === tab.uid ? styles.activeTab : ''}`}
//               onClick={() => {
//                 setSelectedUid(tab.uid)
//                 setScrollIndex(0)
//               }}
//             >
//               {tab.name}
//             </button>
//           ) : null
//         )}
//       </Box>

//       {/* Product Carousel */}
//       {loading ? (
//         <Typography sx={{ mt: 2 }}>Loading products...</Typography>
//       ) : products.length === 0 ? (
//         <Typography sx={{ mt: 2 }}>No products available.</Typography>
//       ) : (
//         <Box className={styles.carouselWrapper}>
//           <IconButton
//             className={styles.arrowLeft}
//             onClick={scrollLeft}
//             disabled={scrollIndex === 0}
//           >
//             <ArrowBackIos />
//           </IconButton>

//           <Box className={styles.carousel}>
//             <Box className={styles.carouselInner} ref={carouselRef}>
//               {products.map((product) =>
//                 product ? (
//                   <Box key={product.uid} className={styles.productCard}>
//                     <Box className={styles.wishlistIcon}>
//                       <FavoriteBorder />
//                     </Box>
//                     <img
//                       src={product.image?.url ?? ''}
//                       alt={product.name ?? 'Product'}
//                       className={styles.productImage}
//                     />
//                     <Typography className={styles.productName}>{product.name}</Typography>
//                     <Typography className={styles.productPrice}>
//                       ₹{product.price_range.minimum_price.final_price.value}
//                     </Typography>
//                     <button className={styles.addToCartButton}>ADD TO CART</button>
//                   </Box>
//                 ) : null
//               )}
//             </Box>
//           </Box>

//           <IconButton
//             className={styles.arrowRight}
//             onClick={scrollRight}
//             disabled={scrollIndex + 5 >= products.length}
//           >
//             <ArrowForwardIos />
//           </IconButton>
//         </Box>
//       )}

//       <Box className={styles.shopNowWrapper}>
//         <button className={styles.shopNowButton}>SHOP NOW</button>
//       </Box>
//     </Box>
//   )
// }



