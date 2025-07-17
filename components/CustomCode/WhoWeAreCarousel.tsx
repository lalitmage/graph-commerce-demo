import { Box, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useQuery } from '@graphcommerce/graphql'
import {
  GetWhyWeAreCmsBlockDocument,
  GetWhyWeAreCmsBlockQuery,
} from './GraphqlQuries/GetWhyWeAreCmsBlock.gql'
import he from 'he'
import parse, { domToReact, Element as HtmlParserElement } from 'html-react-parser'
import styles from './WhoWeAreCarousel.module.css'
import Link from 'next/link'

const CATEGORY_ITEMS_SELECTOR = '.item'

type WhoWeAreCarouselProps = {
  data?: GetWhyWeAreCmsBlockQuery | null
}

export function WhoWeAreCarousel({ data }: WhoWeAreCarouselProps) {
  const { data: queryData } = useQuery(GetWhyWeAreCmsBlockDocument, {
    skip: !!data,
    fetchPolicy: 'no-cache',
  })

  const rawHtml =
    data?.cmsBlocks?.items?.[0]?.content ?? queryData?.cmsBlocks?.items?.[0]?.content ?? ''
  const decodedHtml = he.decode(rawHtml)

  const [itemsHtml, setItemsHtml] = useState<string[]>([])
  const [sectionTitle, setSectionTitle] = useState('Who Are We?')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(decodedHtml, 'text/html')
    const items = Array.from(doc.querySelectorAll(CATEGORY_ITEMS_SELECTOR)).map(
      (item) => item.outerHTML,
    )
    const title = doc.querySelector('.title-name')?.textContent ?? 'Who Are We?'

    setItemsHtml(items)
    setSectionTitle(title)
  }, [decodedHtml])

  const handleNext = () => {
    if (currentIndex < itemsHtml.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  if (!itemsHtml.length) return null

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.sectionTitle}>
        {sectionTitle}
      </Typography>

      <Box className={styles.carouselWrapper}>
        <button className={styles.arrowLeft} onClick={handlePrev} disabled={currentIndex === 0}>
          &#8249;
        </button>

        <Box className={styles.carousel}>
          <Box
            className={styles.carouselInner}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {itemsHtml.map((html, index) => {
              const itemDoc = new DOMParser().parseFromString(html, 'text/html')
              const item = itemDoc.querySelector('.item')
              const mediaHtml = item?.querySelector('.imageArea')?.innerHTML || ''
              const contentHtml = item?.querySelector('.contentArea')?.innerHTML || ''

              const contentParsed = parse(contentHtml, {
                replace: (domNode) => {
                  if (
                    domNode instanceof HtmlParserElement &&
                    domNode.name === 'a' &&
                    domNode.attribs?.href
                  ) {
                    // const rawHref = domNode.attribs.href

                    // const cleanedHref = rawHref
                    //   .replace('{{store url=\'', '')
                    //   .replace('\'}}', '')
                    //   .replace(/\.html$/, '')
                    //   .trim()

                    // const nextHref = `/${cleanedHref}`

                    let rawHref = domNode.attribs.href?.trim() || ''

// Case 1: Magento-style {{store url='about-us.html'}}
if (rawHref.includes("{{store url=")) {
  rawHref = rawHref.replace(/^\{\{store url='?/, '').replace(/'?}}$/, '')
}

// Case 2: Full absolute URL like https://indiastaging.tonggardenintranetlive.com/about-us.html
if (rawHref.startsWith('http')) {
  try {
    const parsed = new URL(rawHref)
    rawHref = parsed.pathname // "/about-us.html"
  } catch (e) {
    rawHref = '/' // fallback
  }
}

// Clean `.html` and trailing slashes
const cleanedHref = rawHref.replace(/\.html$/, '').replace(/^\/+/, '/')

// const nextHref = cleanedHref || '/'
const nextHref = cleanedHref ? `/${cleanedHref}` : '/'




                    return (
                      <Link href={nextHref} legacyBehavior passHref>
                        <a className={styles.btnTheme}>
                          {domToReact(domNode.children as any)}
                        </a>
                      </Link>
                    )
                  }
                },
              })

              return (
                <Box className={styles.slide} key={index}>
                  <Box className={styles.media}>{parse(mediaHtml)}</Box>
                  <Box className={styles.content}>{contentParsed}</Box>
                </Box>
              )
            })}
          </Box>
        </Box>

        <button
          className={styles.arrowRight}
          onClick={handleNext}
          disabled={currentIndex === itemsHtml.length - 1}
        >
          &#8250;
        </button>
      </Box>

      <Box className={styles.pagination}>
        {itemsHtml.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Container>
  )
}












// import { Box, Container, Typography } from '@mui/material'
// import { useEffect, useState } from 'react'
// import { useQuery } from '@graphcommerce/graphql'
// import { GetWhyWeAreCmsBlockDocument } from './GraphqlQuries/GetWhyWeAreCmsBlock.gql'
// import he from 'he'
// import parse, { domToReact, Element as HtmlParserElement } from 'html-react-parser'
// import styles from './WhoWeAreCarousel.module.css'

// const CATEGORY_ITEMS_SELECTOR = '.item'

// export function WhoWeAreCarousel() {
//   const { data } = useQuery(GetWhyWeAreCmsBlockDocument)
//   const rawHtml = data?.cmsBlocks?.items?.[0]?.content ?? ''
//   const decodedHtml = he.decode(rawHtml)

//   const [itemsHtml, setItemsHtml] = useState<string[]>([])
//   const [sectionTitle, setSectionTitle] = useState('Who Are We?')
//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     const parser = new DOMParser()
//     const doc = parser.parseFromString(decodedHtml, 'text/html')
//     const items = Array.from(doc.querySelectorAll(CATEGORY_ITEMS_SELECTOR)).map(
//       (item) => item.outerHTML
//     )
//     const title = doc.querySelector('.title-name')?.textContent ?? 'Who Are We?'

//     setItemsHtml(items)
//     setSectionTitle(title)
//   }, [decodedHtml])

//   const handleNext = () => {
//     if (currentIndex < itemsHtml.length - 1) setCurrentIndex(currentIndex + 1)
//   }

//   const handlePrev = () => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
//   }

//   if (!itemsHtml.length) return null

//   return (
//     <Container className={styles.container}>
//       <Typography variant="h4" className={styles.sectionTitle}>
//         {sectionTitle}
//       </Typography>

//       <Box className={styles.carouselWrapper}>
//         <button className={styles.arrowLeft} onClick={handlePrev} disabled={currentIndex === 0}>
//           &#8249;
//         </button>

//         <Box className={styles.carousel}>
//           <Box
//             className={styles.carouselInner}
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {itemsHtml.map((html, index) => {
//               const itemDoc = new DOMParser().parseFromString(html, 'text/html')
//               const item = itemDoc.querySelector('.item')
//               const mediaHtml = item?.querySelector('.imageArea')?.innerHTML || ''
//               const contentHtml = item?.querySelector('.contentArea')?.innerHTML || ''

//               const contentParsed = parse(contentHtml, {
//                 replace: (domNode) => {
//                   if (
//                     domNode instanceof HtmlParserElement &&
//                     domNode.name === 'a' &&
//                     domNode.attribs?.href
//                   ) {
//                     return (
//                       <a href={domNode.attribs.href} className={styles.btnTheme}>
//                         {domToReact(domNode.children as unknown as import('html-react-parser').DOMNode[])}
//                       </a>
//                     )
//                   }
//                 },
//               })

//               return (
//                 <Box className={styles.slide} key={index}>
//                   <Box className={styles.media}>{parse(mediaHtml)}</Box>
//                   <Box className={styles.content}>{contentParsed}</Box>
//                 </Box>
//               )
//             })}
//           </Box>
//         </Box>

//         <button
//           className={styles.arrowRight}
//           onClick={handleNext}
//           disabled={currentIndex === itemsHtml.length - 1}
//         >
//           &#8250;
//         </button>
//       </Box>

//       <Box className={styles.pagination}>
//         {itemsHtml.map((_, index) => (
//           <span
//             key={index}
//             className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
//             onClick={() => setCurrentIndex(index)}
//           />
//         ))}
//       </Box>
//     </Container>
//   )
// }
