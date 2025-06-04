import { PageOptions } from '@graphcommerce/framer-next-pages'
import { cacheFirst } from '@graphcommerce/graphql'
import { hygraphPageContent, HygraphPagesQuery } from '@graphcommerce/hygraph-ui'
import { ProductListDocument, ProductListQuery } from '@graphcommerce/magento-product'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutHeader, MetaRobots, PageMeta } from '@graphcommerce/next-ui'
import {
  LayoutDocument,
  LayoutNavigation,
  LayoutNavigationProps,
  RowProduct,
  RowRenderer,
} from '../components'
import { graphqlSharedClient, graphqlSsrClient } from '../lib/graphql/graphqlSsrClient'
import he from 'he'


import { GetBestSellerProductsDocument } from '../components/CustomCode/GraphqlQuries/GetBestSellerProducts.gql'
import { GetLatestProductsDocument } from '../components/CustomCode/GraphqlQuries/GetLatestProducts.gql'
import { ShippingBlockDocument } from '../components/CustomCode/GraphqlQuries/ShippingBlock.gql'
import { GetSubcategoriesOf45TabsDocument } from '../components/CustomCode/GraphqlQuries/CategoryTabs.gql'
import { GetProductsByCategoryIdDocument } from '../components/CustomCode/GraphqlQuries/ProductsByCategory.gql'
import { GetWhyWeAreCmsBlockDocument } from '../components/CustomCode/GraphqlQuries/GetWhyWeAreCmsBlock.gql'



import { BannerSlider } from '../components/CustomCode/BannerSlider'
import { ShippingBlock } from '../components/CustomCode/ShippingBlock'
import { ShopNowCarousel } from '../components/CustomCode/ShopNowCarousel'
import { WhoWeAreCarousel } from '../components/CustomCode/WhoWeAreCarousel'
import { BestSellersCarousel } from '../components/CustomCode/BestSellerCarousel'
import { LatestProductsCarousel } from '../components/CustomCode/LatestProductsCarousel'
import NewsletterSubscription from '../components/CustomCode/NewsletterSubscription'





type Props = HygraphPagesQuery & {
  latestList: ProductListQuery
  favoritesList: ProductListQuery
  swipableList: ProductListQuery

  shippingBlock: any

  bestSellerProducts: any
  latestProducts: any
  whoWeAreBlock: any
   categoryTabs: any           
  productsByCategory: any 

}
type RouteProps = { url: string }
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props, RouteProps>

function CmsPage(props: Props) {
  const { pages, latestList, favoritesList, swipableList } = props
  const page = pages?.[0]

  const latest = latestList?.products?.items?.[0]
  const favorite = favoritesList?.products?.items?.[0]
  const swipable = swipableList?.products?.items?.[0]


  return (
    <>
      <PageMeta
        title={page?.metaTitle ?? page?.title ?? ''}
        metaDescription={page?.metaDescription ?? ''}
        metaRobots={page?.metaRobots.toLowerCase().split('_') as MetaRobots[] | undefined}
        canonical='/'
      />

      <LayoutHeader floatingMd floatingSm />
      <BannerSlider />

      <ShippingBlock  data={props.shippingBlock} />
<ShopNowCarousel 
  categoryTabs={props.categoryTabs} 
  initialProducts={props.productsByCategory} 
/>

      <WhoWeAreCarousel data={props.whoWeAreBlock} />
        <BestSellersCarousel   data={props.bestSellerProducts}/>
      <LatestProductsCarousel  data={props.latestProducts} />  
      <NewsletterSubscription   />

    

  
      
      

      {/* {page && (
        <RowRenderer
          content={page.content}
          renderer={{
            RowProduct: (rowProps) => {
              const { identity } = rowProps

              if (identity === 'home-favorites')
                return (
                  <RowProduct {...rowProps} {...favorite} items={favoritesList.products?.items} />
                )
              if (identity === 'home-latest')
                return <RowProduct {...rowProps} {...latest} items={latestList.products?.items} />
              if (identity === 'home-swipable')
                return (
                  <RowProduct {...rowProps} {...swipable} items={swipableList.products?.items} />
                )
              return (
                <RowProduct {...rowProps} {...favorite} items={favoritesList.products?.items} />
              )
            },
          }}
        />
      )} */}
    </>
  )
}

CmsPage.pageOptions = {
  Layout: LayoutNavigation,
} as PageOptions

export default CmsPage

export const getStaticProps: GetPageStaticProps = async (context) => {
  const client = graphqlSharedClient(context)
  const staticClient = graphqlSsrClient(context)

  const conf = client.query({ query: StoreConfigDocument })
  const page = hygraphPageContent(staticClient, 'page/home')
  const layout = staticClient.query({
    query: LayoutDocument,
    fetchPolicy: cacheFirst(staticClient),
  })

  // todo(paales): Remove when https://github.com/Urigo/graphql-mesh/issues/1257 is resolved
  const favoritesList = staticClient.query({
    query: ProductListDocument,
    variables: { onlyItems: true, pageSize: 8, filters: { category_uid: { eq: 'MTIx' } } },
  })

  const latestList = staticClient.query({
    query: ProductListDocument,
    variables: { onlyItems: true, pageSize: 8, filters: { category_uid: { eq: 'MTAy' } } },
  })

  const swipableList = staticClient.query({
    query: ProductListDocument,
    variables: { onlyItems: true, pageSize: 8, filters: { category_uid: { eq: 'MTIy' } } },
  })

  const bestSellerProducts = staticClient.query({
  query: GetBestSellerProductsDocument,
})

const latestProducts = staticClient.query({
  query: GetLatestProductsDocument,
})

const shippingBlock = staticClient.query({
  query: ShippingBlockDocument,
  variables: { identifier: 'home-shipping-content' }, // 👈 REQUIRED
})

const categoryTabs = staticClient.query({
  query: GetSubcategoriesOf45TabsDocument,
})

const productsByCategory = staticClient.query({
  query: GetProductsByCategoryIdDocument,
  variables: { id: 61 }, // 👈 Default/fallback category ID (corresponding to 'NjE=')
})




const whoWeAreBlock = staticClient.query({
  query: GetWhyWeAreCmsBlockDocument,
})


  if (!(await page).data.pages?.[0]) return { notFound: true }

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      latestList: (await latestList).data,
      favoritesList: (await favoritesList).data,
      swipableList: (await swipableList).data,

       bestSellerProducts: (await bestSellerProducts).data,
    latestProducts: (await latestProducts).data,
    shippingBlock: (await shippingBlock)?.data ?? null,
    categoryTabs: (await categoryTabs).data,
productsByCategory: (await productsByCategory).data,



    whoWeAreBlock: (await whoWeAreBlock).data,

      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
