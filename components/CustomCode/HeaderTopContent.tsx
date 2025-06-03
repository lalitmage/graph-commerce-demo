
import { useQuery } from '@graphcommerce/graphql'
import { HeaderTopContentDocument } from './GraphqlQuries/HeaderTopContent.gql'
import parse from 'html-react-parser'
import he from 'he'
import styles from './HeaderTopContent.module.css'

export function HeaderTopContent() {
  const { data, error, loading } = useQuery(HeaderTopContentDocument, {
    variables: { identifier: 'header-top-slider' },
    fetchPolicy: 'no-cache', // Disable caching for this query to get fresh data every time
  })

  console.log('GraphQL data:', data)
  console.log('GraphQL error:', error)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading content</div>

  const rawContent = data?.getCmsBlock?.content
  if (!rawContent) return null

  const decodedHtml = he.decode(rawContent)

  return (
    <div className={styles.headertopcontent}>
      <div className={styles.headertopinner}>
        {parse(decodedHtml)}
      </div>
    </div>
  )
  
}
