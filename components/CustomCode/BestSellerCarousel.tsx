import { useQuery } from '@graphcommerce/graphql'
import { Box, Typography, IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos, FavoriteBorder } from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'
import styles from './BestSellersCarousel.module.css'
import {
  GetBestSellerProductsDocument,
  GetBestSellerProductsQuery,
} from './GraphqlQuries/GetBestSellerProducts.gql'
import Link from 'next/link'

type BestSellersCarouselProps = {
  data?: GetBestSellerProductsQuery | null
}

export function BestSellersCarousel({ data }: BestSellersCarouselProps) {
  const [scrollIndex, setScrollIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const { data: queryData, loading } = useQuery(GetBestSellerProductsDocument, {
    skip: !!data,
    fetchPolicy: 'no-cache',
  })

  const products = data?.category?.products?.items ?? queryData?.category?.products?.items ?? []
  const totalPages = Math.ceil(products.length / 5)

  const scrollToIndex = (index: number) => setScrollIndex(index * 5)
  const scrollLeft = () => setScrollIndex((prev) => Math.max(prev - 5, 0))
  const scrollRight = () => setScrollIndex((prev) => (prev + 5 < products.length ? prev + 5 : prev))

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = scrollIndex * 216
      carouselRef.current.style.transform = `translateX(-${scrollAmount}px)`
    }
  }, [scrollIndex])

  return (
    <Box className={styles.wrapper}>
      <Typography className={styles.heading}>Best Sellers</Typography>

      {loading && !data ? (
        <Typography className={styles.loadingText}>Loading products...</Typography>
      ) : products.length === 0 ? (
        <Typography className={styles.loadingText}>No products available.</Typography>
      ) : (
        <>
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
                {products.map((product) => (
                  <Box
                    key={product?.uid ?? product?.sku ?? Math.random()}
                    className={styles.productCard}
                  >
                    <Box className={styles.wishlistIcon}>
                      <IconButton>
                        <FavoriteBorder />
                      </IconButton>
                    </Box>

                    <Link href={`/p/${product?.url_key}`} legacyBehavior>
                      <a style={{ textDecoration: 'none', color: 'black' }}>
                        <img
                          src={product?.image?.url ?? '/placeholder.jpg'}
                          alt={product?.name ?? 'Product'}
                          className={styles.productImage}
                        />
                        <Typography className={styles.productName}>{product?.name}</Typography>
                      </a>
                    </Link>

                    <Typography className={styles.productPrice}>
                      ₹{product?.price_range?.minimum_price?.final_price?.value?.toFixed(2)}
                    </Typography>

                    <button className={styles.addToCartButton}>ADD TO CART</button>
                  </Box>
                ))}
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

          <Box className={styles.paginationDots}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  index === Math.floor(scrollIndex / 5) ? styles.activeDot : ''
                }`}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </Box>
        </>
      )}

 <Box className={styles.viewAllWrapper}>
  <Link href="/best-sellers" passHref legacyBehavior>
    <a className={styles.viewAllButton}>VIEW ALL</a>
  </Link>
</Box>

    </Box>
  )
}


// import { useQuery } from '@graphcommerce/graphql'
// import { Box, Typography, IconButton } from '@mui/material'
// import { ArrowBackIos, ArrowForwardIos, FavoriteBorder } from '@mui/icons-material'
// import { useState, useRef, useEffect } from 'react'
// import styles from './BestSellersCarousel.module.css'
// import {
//   GetBestSellerProductsDocument,
//   GetBestSellerProductsQuery,
// } from './GraphqlQuries/GetBestSellerProducts.gql'
// import Link from 'next/link'

// type BestSellersCarouselProps = {
//   data?: GetBestSellerProductsQuery | null
// }

// export function BestSellersCarousel({ data }: BestSellersCarouselProps) {
//   const [scrollIndex, setScrollIndex] = useState(0)
//   const carouselRef = useRef<HTMLDivElement>(null)

//   const { data: queryData, loading } = useQuery(GetBestSellerProductsDocument, {
//     skip: !!data,
//     fetchPolicy: 'no-cache',
//   })

//   const products = data?.category?.products?.items ?? queryData?.category?.products?.items ?? []
//   const totalPages = Math.ceil(products.length / 5)

//   const scrollToIndex = (index: number) => setScrollIndex(index * 5)
//   const scrollLeft = () => setScrollIndex((prev) => Math.max(prev - 5, 0))
//   const scrollRight = () => setScrollIndex((prev) => (prev + 5 < products.length ? prev + 5 : prev))

//   useEffect(() => {
//     if (carouselRef.current) {
//       const scrollAmount = scrollIndex * 216
//       carouselRef.current.style.transform = `translateX(-${scrollAmount}px)`
//     }
//   }, [scrollIndex])

//   return (
//     <Box className={styles.wrapper}>
//       <Typography className={styles.heading}>Best Sellers</Typography>

//       {loading && !data ? (
//         <Typography className={styles.loadingText}>Loading products...</Typography>
//       ) : products.length === 0 ? (
//         <Typography className={styles.loadingText}>No products available.</Typography>
//       ) : (
//         <>
//           <Box className={styles.carouselWrapper}>
//             <IconButton
//               className={styles.arrowLeft}
//               onClick={scrollLeft}
//               disabled={scrollIndex === 0}
//             >
//               <ArrowBackIos />
//             </IconButton>

//             <Box className={styles.carousel}>
//               <Box className={styles.carouselInner} ref={carouselRef}>
//                 {products.map((product) => (
//                   <Link
//                     key={product?.uid ?? product?.sku ?? Math.random()}
//                     href={`/p/${product?.url_key}`}
//                     legacyBehavior
//                   >
//                     <a className={styles.productCard} style={{ textDecoration: 'none', color: 'black' }}>
//                       <Box className={styles.wishlistIcon}>
//                         <FavoriteBorder />
//                       </Box>
//                       <img
//                         src={product?.image?.url ?? '/placeholder.jpg'}
//                         alt={product?.name ?? 'Product'}
//                         className={styles.productImage}
//                       />
//                       <Typography className={styles.productName} >{product?.name}</Typography>
//                       <Typography className={styles.productPrice}>
//                         ₹{product?.price_range?.minimum_price?.final_price?.value?.toFixed(2)}
//                       </Typography>
//                       <button className={styles.addToCartButton}>ADD TO CART</button>
//                     </a>
//                   </Link>
//                 ))}
//               </Box>
//             </Box>

//             <IconButton
//               className={styles.arrowRight}
//               onClick={scrollRight}
//               disabled={scrollIndex + 5 >= products.length}
//             >
//               <ArrowForwardIos />
//             </IconButton>
//           </Box>

//           <Box className={styles.paginationDots}>
//             {Array.from({ length: totalPages }).map((_, index) => (
//               <span
//                 key={index}
//                 className={`${styles.dot} ${
//                   index === Math.floor(scrollIndex / 5) ? styles.activeDot : ''
//                 }`}
//                 onClick={() => scrollToIndex(index)}
//               />
//             ))}
//           </Box>
//         </>
//       )}

//       <Box className={styles.viewAllWrapper}>
//         <button className={styles.viewAllButton}>VIEW ALL</button>
//       </Box>
//     </Box>
//   )
// }

// import { useQuery } from '@graphcommerce/graphql'
// import { Box, Typography, IconButton } from '@mui/material'
// import { ArrowBackIos, ArrowForwardIos, FavoriteBorder } from '@mui/icons-material'
// import { useState, useRef, useEffect } from 'react'
// import styles from './BestSellersCarousel.module.css'
// import { GetBestSellerProductsDocument, GetBestSellerProductsQuery } from './GraphqlQuries/GetBestSellerProducts.gql'

// type BestSellersCarouselProps = {
//   data?: GetBestSellerProductsQuery | null
// }

// export function BestSellersCarousel({ data }: BestSellersCarouselProps) {
//   const [scrollIndex, setScrollIndex] = useState(0)
//   const carouselRef = useRef<HTMLDivElement>(null)

//   const { data: queryData, loading } = useQuery(GetBestSellerProductsDocument, {
//     skip: !!data,
//     fetchPolicy: 'no-cache',
//   })

//   const products = data?.category?.products?.items ?? queryData?.category?.products?.items ?? []
//   const totalPages = Math.ceil(products.length / 5)

//   const scrollToIndex = (index: number) => setScrollIndex(index * 5)
//   const scrollLeft = () => setScrollIndex((prev) => Math.max(prev - 5, 0))
//   const scrollRight = () =>
//     setScrollIndex((prev) => (prev + 5 < products.length ? prev + 5 : prev))

//   useEffect(() => {
//     if (carouselRef.current) {
//       const scrollAmount = scrollIndex * 216
//       carouselRef.current.style.transform = `translateX(-${scrollAmount}px)`
//     }
//   }, [scrollIndex])

//   return (
//     <Box className={styles.wrapper}>
//       <Typography className={styles.heading}>Best Sellers</Typography>

//       {loading && !data ? (
//         <Typography className={styles.loadingText}>Loading products...</Typography>
//       ) : products.length === 0 ? (
//         <Typography className={styles.loadingText}>No products available.</Typography>
//       ) : (
//         <>
//           <Box className={styles.carouselWrapper}>
//             <IconButton
//               className={styles.arrowLeft}
//               onClick={scrollLeft}
//               disabled={scrollIndex === 0}
//             >
//               <ArrowBackIos />
//             </IconButton>

//             <Box className={styles.carousel}>
//               <Box className={styles.carouselInner} ref={carouselRef}>
//                 {products.map((product) => (
//                   <Box
//                     key={product?.uid ?? product?.sku ?? Math.random()}
//                     className={styles.productCard}
//                   >
//                     <Box className={styles.wishlistIcon}>
//                       <FavoriteBorder />
//                     </Box>
//                     <img
//                       src={product?.image?.url ?? '/placeholder.jpg'}
//                       alt={product?.name ?? 'Product'}
//                       className={styles.productImage}
//                     />
//                     <Typography className={styles.productName}>
//                       {product?.name}
//                     </Typography>
//                     <Typography className={styles.productPrice}>
//                       ₹{product?.price_range?.minimum_price?.final_price?.value?.toFixed(2)}
//                     </Typography>
//                     <button className={styles.addToCartButton}>ADD TO CART</button>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>

//             <IconButton
//               className={styles.arrowRight}
//               onClick={scrollRight}
//               disabled={scrollIndex + 5 >= products.length}
//             >
//               <ArrowForwardIos />
//             </IconButton>
//           </Box>

//           <Box className={styles.paginationDots}>
//             {Array.from({ length: totalPages }).map((_, index) => (
//               <span
//                 key={index}
//                 className={`${styles.dot} ${
//                   index === Math.floor(scrollIndex / 5) ? styles.activeDot : ''
//                 }`}
//                 onClick={() => scrollToIndex(index)}
//               />
//             ))}
//           </Box>
//         </>
//       )}

//       <Box className={styles.viewAllWrapper}>
//         <button className={styles.viewAllButton}>VIEW ALL</button>
//       </Box>
//     </Box>
//   )
// }
