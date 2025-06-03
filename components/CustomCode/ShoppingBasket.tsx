import React from 'react'
import { Box, Typography } from '@mui/material'
import basketIcon from './images/icon-cart.png'

const ShoppingBasket: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <img
        src='https://indiastaging.tonggardenintranetlive.com/static/frontend/Tonggarden/tg/en_US/images/icon-cart.png'
        alt="Shopping Basket"
        style={{ width: 32, height: 32 }}
      />
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px' }}
        >
          Shopping Basket
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '14px' }}>
          ₹0.00
        </Typography>
      </Box>
    </Box>
  )
}

export default ShoppingBasket
