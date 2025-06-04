import { useQuery } from '@graphcommerce/graphql'
import { ShippingBlockDocument, ShippingBlockQuery } from './GraphqlQuries/ShippingBlock.gql'
import parse from 'html-react-parser'

const MEDIA_BASE_URL = 'https://indiastaging.tonggardenintranetlive.com/media/'

function extractDesktopImage(html: string): string {
  const match = html.match(/<img[^>]*class="[^"]*pagebuilder-mobile-hidden[^"]*"[^>]*>/)
  if (!match) return ''
  const responsiveImg = match[0].replace(
    '<img',
    '<img style="width: 100%; height: auto; display: block; margin: 0 auto;"',
  )
  return `<div style="max-width: 100%; overflow: hidden;">${responsiveImg}</div>`
}

function replaceMediaUrls(html: string): string {
  return html.replace(/{{media url=(.*?)}}/g, (_, path) => `${MEDIA_BASE_URL}${path.trim()}`)
}

type ShippingBlockProps = {
  data?: ShippingBlockQuery | null
}

export function ShippingBlock({ data }: ShippingBlockProps) {
  const { data: queryData } = useQuery(ShippingBlockDocument, {
    variables: { identifier: 'home-shipping-content' },
    fetchPolicy: 'no-cache',
    skip: !!data,
  })

  const contentSource = data?.getCmsBlock?.content ?? queryData?.getCmsBlock?.content ?? ''

  if (!contentSource) return null // ✅ Prevent crash if empty

  const desktopImageOnly = extractDesktopImage(contentSource)
  const fixedContent = replaceMediaUrls(desktopImageOnly)

  return <>{parse(fixedContent)}</>
}




// import { useQuery } from '@graphcommerce/graphql'
// import { ShippingBlockDocument, ShippingBlockQuery } from './GraphqlQuries/ShippingBlock.gql'
// import parse from 'html-react-parser'

// const MEDIA_BASE_URL = 'https://indiastaging.tonggardenintranetlive.com/media/'

// // Extract <img class="pagebuilder-mobile-hidden" ... /> only
// function extractDesktopImage(html: string): string {
//   const match = html.match(/<img[^>]*class="[^"]*pagebuilder-mobile-hidden[^"]*"[^>]*>/)
//   if (!match) return ''
//   // Add responsive styles to the img
//   const responsiveImg = match[0].replace('<img', '<img style="width: 100%; height: auto; display: block; margin: 0 auto;"')
//   return `<div style="max-width: 100%; overflow: hidden;">${responsiveImg}</div>`
// }

// function replaceMediaUrls(html: string): string {
//   return html.replace(/{{media url=(.*?)}}/g, (_, path) => `${MEDIA_BASE_URL}${path.trim()}`)
// }

// type ShippingBlockProps = {
//   data?: ShippingBlockQuery
// }

// export function ShippingBlock({ data }: ShippingBlockProps) {
//   const { data: queryData } = useQuery(ShippingBlockDocument, {
//     variables: { identifier: 'home-shipping-content' },
//     fetchPolicy: 'no-cache',
//     skip: !!data, // Skip query if external data is provided
//   })

//   const contentSource = data?.getCmsBlock?.content ?? queryData?.getCmsBlock?.content ?? ''
//   const desktopImageOnly = extractDesktopImage(contentSource)
//   const fixedContent = replaceMediaUrls(desktopImageOnly)

//   return <>{parse(fixedContent)}</>
// }














// import { useQuery } from '@graphcommerce/graphql'
// import { ShippingBlockDocument } from './GraphqlQuries/ShippingBlock.gql'
// import parse from 'html-react-parser'

// const MEDIA_BASE_URL = 'https://indiastaging.tonggardenintranetlive.com/media/'

// // Extract <img class="pagebuilder-mobile-hidden" ... /> only
// function extractDesktopImage(html: string): string {
//   const match = html.match(/<img[^>]*class="[^"]*pagebuilder-mobile-hidden[^"]*"[^>]*>/)
//   if (!match) return ''
//   // Add responsive styles to the img
//   const responsiveImg = match[0].replace('<img', '<img style="width: 100%; height: auto; display: block; margin: 0 auto;"')
//   return `<div style="max-width: 100%; overflow: hidden;">${responsiveImg}</div>`
// }

// function replaceMediaUrls(html: string): string {
//   return html.replace(/{{media url=(.*?)}}/g, (_, path) => `${MEDIA_BASE_URL}${path.trim()}`)
// }

// export function ShippingBlock() {
//   const { data } = useQuery(ShippingBlockDocument, {
//     variables: { identifier: 'home-shipping-content' },
//     fetchPolicy: 'no-cache',
//   })

//   const rawContent = data?.getCmsBlock?.content ?? ''
//   const desktopImageOnly = extractDesktopImage(rawContent)
//   const fixedContent = replaceMediaUrls(desktopImageOnly)

//   return <>{parse(fixedContent)}</>
// }
