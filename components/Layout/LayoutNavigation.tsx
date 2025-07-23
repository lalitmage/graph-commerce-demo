import { CartFab, useCartEnabled } from '@graphcommerce/magento-cart'
import { magentoMenuToNavigation } from '@graphcommerce/magento-category'
import { CustomerFab, CustomerMenuFabItem } from '@graphcommerce/magento-customer'
import { SearchFab, SearchField } from '@graphcommerce/magento-search'
import { WishlistFab, WishlistMenuFabItem } from '@graphcommerce/magento-wishlist'
import { Logo } from '../CustomCode/Logo'
import { Box,Typography } from '@mui/material'


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


      <HeaderTopContent />

      <LayoutDefault
        {...uiProps}
        noSticky={router.asPath.split('?')[0] === '/'}
        header={
          <>
            <div className={styles.container}>
              <div className={styles.innerheader}>
                <div className={styles.headerlogo}>
          

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

            
                  </DesktopNavActions>
                  <MenuDropdown />
                </div>
              </div>
            </div>

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

              {/* <ShoppingBasket /> */}
              <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}
>
  <CartFab
    icon={
      <img
        src='https://indiastaging.tonggardenintranetlive.com/static/frontend/Tonggarden/tg/en_US/images/icon-cart.png'
        alt='Shopping Basket'
        style={{ width: 32, height: 32 }}
      />
    }
    sx={{
      boxShadow: 'none',
      backgroundColor: 'transparent',
      width: 'auto',
      height: 'auto',
      minHeight: 0,
      minWidth: 0,
      p: 0,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    }}
    BadgeProps={{
      sx: {
        '& .MuiBadge-badge': {
          backgroundColor: '#ff0000',
          color: '#fff',
          fontSize: '10px',
          right: -4,
          top: 0,
        },
      },
    }}
  />
     <Typography
          variant="subtitle2"
          sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px' }}
        >
          Shopping Basket
        </Typography>
</Box>
              
            </div>
          </div>
        </div>
     
        {children}
      </LayoutDefault>
    </>
  )
}