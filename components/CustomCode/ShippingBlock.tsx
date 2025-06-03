import { useQuery } from '@graphcommerce/graphql'
import { ShippingBlockDocument } from './GraphqlQuries/ShippingBlock.gql'
import parse from 'html-react-parser'

const MEDIA_BASE_URL = 'https://indiastaging.tonggardenintranetlive.com/media/'

// Extract <img class="pagebuilder-mobile-hidden" ... /> only
function extractDesktopImage(html: string): string {
  const match = html.match(/<img[^>]*class="[^"]*pagebuilder-mobile-hidden[^"]*"[^>]*>/)
  if (!match) return ''
  // Add responsive styles to the img
  const responsiveImg = match[0].replace('<img', '<img style="width: 100%; height: auto; display: block; margin: 0 auto;"')
  return `<div style="max-width: 100%; overflow: hidden;">${responsiveImg}</div>`
}

function replaceMediaUrls(html: string): string {
  return html.replace(/{{media url=(.*?)}}/g, (_, path) => `${MEDIA_BASE_URL}${path.trim()}`)
}

export function ShippingBlock() {
  const { data } = useQuery(ShippingBlockDocument, {
    variables: { identifier: 'home-shipping-content' },
    fetchPolicy: 'no-cache',
  })

  const rawContent = data?.getCmsBlock?.content ?? ''
  const desktopImageOnly = extractDesktopImage(rawContent)
  const fixedContent = replaceMediaUrls(desktopImageOnly)

  return <>{parse(fixedContent)}</>
}
