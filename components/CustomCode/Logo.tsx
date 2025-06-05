import { StoreLogoDocument } from './GraphqlQuries/Logo.gql'
import { useQuery } from '@graphcommerce/graphql'
import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  const { data } = useQuery(StoreLogoDocument)

  if (!data?.getStoreLogo?.logo_url) return null

  const { logo_url, logo_alt } = data.getStoreLogo 

  return (
    <Link href="/" passHref>
      <Image
        src={logo_url}
        alt={logo_alt || 'Store Logo'}
        width={218}
        height={22}
        style={{ maxWidth: 218, height: 'auto' }}
      />
    </Link>
  )
}
