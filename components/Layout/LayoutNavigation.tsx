import { CartFab, useCartEnabled } from '@graphcommerce/magento-cart'
import { magentoMenuToNavigation } from '@graphcommerce/magento-category'
import { CustomerFab, CustomerMenuFabItem } from '@graphcommerce/magento-customer'
import { SearchFab, SearchField } from '@graphcommerce/magento-search'
import { WishlistFab, WishlistMenuFabItem } from '@graphcommerce/magento-wishlist'
import { Logo } from '../CustomCode/Logo'
// import MenuDropdown from './MenuDropdown'
import Image from 'next/image'
import {
  DesktopNavActions,
  DesktopNavBar,
  LayoutDefault,
  LayoutDefaultProps,
  iconCustomerService,
  iconHeart,
  NavigationFab,
  MenuFabSecondaryItem,
  PlaceholderFab,
  IconSvg,
  DesktopNavItem,
  DarkLightModeMenuSecondaryItem,
  iconChevronDown,
  NavigationProvider,
  NavigationOverlay,
  useNavigationSelection,
  useMemoDeep,
  MobileTopRight,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Divider, Fab } from '@mui/material'
import { useRouter } from 'next/router'
import { Footer } from './Footer'
import { LayoutQuery } from './Layout.gql'
// import { Logo } from './Logo'
import { productListRenderer } from '../ProductListItems/productListRenderer'
import Link from 'next/link'
import NavLinks from '../CustomCode/CustomNavlinks'
import MenuDropdown from '../CustomCode/MenuDropdown'
import CategoriesDropdown from '../CustomCode/CategoriesDropdown'

import ShoppingBasket from '../CustomCode/ShoppingBasket'
import styles from './LayoutNavigation.module.css'
import { HeaderTopContent } from '../CustomCode/HeaderTopContent'
import { Heart, UserRound } from 'lucide-react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PublicIcon from '@mui/icons-material/Public'

export type LayoutNavigationProps = LayoutQuery &
  Omit<LayoutDefaultProps, 'footer' | 'header' | 'cartFab' | 'menuFab'>

export function LayoutNavigation(props: LayoutNavigationProps) {
  const { footer, menu, children, ...uiProps } = props

  const selection = useNavigationSelection()
  const router = useRouter()
  const cartEnabled = useCartEnabled()

  return (
    <>
      <NavigationProvider
        selection={selection}
        items={useMemoDeep(
          () => [
            { id: 'home', name: <Trans id='Home' />, href: '/' },
            {
              id: 'manual-item-one',
              href: `/${menu?.items?.[0]?.children?.[0]?.url_path}`,
              name: menu?.items?.[0]?.children?.[0]?.name ?? '',
            },
            {
              id: 'manual-item-two',
              href: `/${menu?.items?.[0]?.children?.[1]?.url_path}`,
              name: menu?.items?.[0]?.children?.[1]?.name ?? '',
            },
            ...magentoMenuToNavigation(menu, true),
            { id: 'blog', name: 'Blog', href: '/blog' },
            <Divider sx={(theme) => ({ my: theme.spacings.xs })} />,
            <CustomerMenuFabItem
              onClick={() => selection.set(false)}
              key='account'
              guestHref='/account/signin'
              authHref='/account'
            >
              <Trans id='Account' />
            </CustomerMenuFabItem>,
            <MenuFabSecondaryItem
              key='service'
              icon={<IconSvg src={iconCustomerService} size='medium' />}
              href='/service'
            >
              <Trans id='Customer Service' />
            </MenuFabSecondaryItem>,
            <WishlistMenuFabItem
              onClick={() => selection.set(false)}
              key='wishlist'
              icon={<IconSvg src={iconHeart} size='medium' />}
            >
              <Trans id='Wishlist' />
            </WishlistMenuFabItem>,
            <DarkLightModeMenuSecondaryItem key='darkmode' />,
          ],
          [menu, selection],
        )}
      >
        <NavigationOverlay
          stretchColumns={false}
          variantSm='left'
          sizeSm='full'
          justifySm='start'
          itemWidthSm='70vw'
          variantMd='left'
          sizeMd='full'
          justifyMd='start'
          itemWidthMd='230px'
          mouseEvent='hover'
          itemPadding='md'
        />
      </NavigationProvider>
      {/* <div style={{ background: '#E9E9E9', textAlign: 'center', padding: '5px 0' }}>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#222', margin: 0 }}>
          Welcome to Tong Garden India
        </p>
      </div>  */}

      <HeaderTopContent />

      <LayoutDefault
        {...uiProps}
        noSticky={router.asPath.split('?')[0] === '/'}
        header={
          <>
            <div className={styles.container}>
              <div className={styles.innerheader}>
                <div className={styles.headerlogo}>
                  {/* <Link href="/" passHref>
                    <Image
                      src="https://indiastaging.tonggardenintranetlive.com/media/logo/stores/1/logo_1.png"
                      alt="Tong Garden"
                   
                      width={218}
                      height={22}
                      max-width={218}
                    />
                  </Link> */}

                  <Logo />
                </div>
                <div className={styles.menuslink}>
                  {' '}
                  <NavLinks />
                </div>
                <div className={styles.userlinks}>
                  <DesktopNavActions>
                    <CustomerFab
                      guestHref='/account/signin'
                      authHref='/account'
                      icon={<AccountCircleIcon fontSize='large' />}
                    />

                    <WishlistFab icon={<FavoriteIcon fontSize='large' />} />

                    {/* <CustomerFab guestHref='/account/signin' authHref='/account' />
                
                  
                    <WishlistFab icon={<IconSvg src={iconHeart} size='large' />} /> */}
                    {/* <Fab href='/account/signin' size='small' color='inherit' aria-label='Account'>
  <AccountCircleIcon fontSize='medium' />
</Fab>

<Fab href='/wishlist' size='small' color='inherit' aria-label='Wishlist'>
  <FavoriteIcon fontSize='medium' />
</Fab> */}
                    <Fab href='#' aria-label='Change Language' size='large' color='inherit'>
                      <PublicIcon fontSize='large' />
                    </Fab>

                    <Fab
                      href='/service'
                      aria-label={i18n._(/* i18n */ 'Customer Service')}
                      size='large'
                      color='inherit'
                    >
                      <IconSvg src={iconCustomerService} size='large' />
                    </Fab>

                    {/* The placeholder exists because the CartFab is sticky but we want to reserve the space for the <CartFab /> */}
                    {/* {cartEnabled && <PlaceholderFab />} */}
                    {/* <MenuDropdown /> */}
                  </DesktopNavActions>
                  <MenuDropdown />
                </div>
              </div>
            </div>

            {/* <Logo /> */}
            {/* 
            <DesktopNavBar>
              {menu?.items?.[0]?.children?.slice(0, 2).map((item) => (
                <DesktopNavItem key={item?.uid} href={`/${item?.url_path}`}>
                  {item?.name}
                </DesktopNavItem>
              ))}

              <DesktopNavItem
                onClick={() => selection.set([menu?.items?.[0]?.uid || ''])}
                onKeyUp={(evt) => {
                  if (evt.key === 'Enter') {
                    selection.set([menu?.items?.[0]?.uid || ''])
                  }
                }}
                tabIndex={0}
              >
                {menu?.items?.[0]?.name}
                <IconSvg src={iconChevronDown} />
              </DesktopNavItem>

              <DesktopNavItem href='/blog'>
                <Trans id='Blog' />
              </DesktopNavItem>
            </DesktopNavBar> */}

            <MobileTopRight>
              <SearchFab size='responsiveMedium' />
            </MobileTopRight>
          </>
        }
        footer={<Footer footer={footer} />}
        cartFab={<CartFab />}
        menuFab={<NavigationFab onClick={() => selection.set([])} />}
      >
        <div className={styles.container}>
          <div className={styles.subcontainer}>
            <div className={styles.innerheader}>
              <CategoriesDropdown />

              <SearchField
                formControl={{ sx: { width: '400px' } }}
                searchField={{ productListRenderer }}
              />

              <ShoppingBasket />
            </div>
          </div>
        </div>
        <div>{/* <BannerSlider /> */}</div>
        {children}
      </LayoutDefault>
    </>
  )
}
