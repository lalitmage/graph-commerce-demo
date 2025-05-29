import { useQuery } from '@apollo/client'
import { GetAllBannerSlidersDocument } from './GraphqlQuries/Banner.gql'
import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'

type Banner = {
  id: number
  title?: string | null
  image_url: string
  link: string
}

export function BannerSlider() {
  const { data, loading, error } = useQuery(GetAllBannerSlidersDocument)
  const [currentIndex, setCurrentIndex] = useState(0)

  const banners: Banner[] = (data?.getAllBannerSliders?.[0]?.banners || [])
    .filter((b): b is Banner => !!b && !!b.image_url)
    .map((b) => ({
      id: b.id!,
      title: b.title ?? '',
      image_url: b.image_url, 
      link: b.link ?? '#',
    }))

  useEffect(() => {
    if (banners.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  if (loading) return <p>Loading banners...</p>
  if (error) return <p>Error loading banners.</p>
  if (!banners.length) return <p>No banners found.</p>

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '578px',
        overflow: 'hidden',
        backgroundColor: '#eee',
      }}
    >
      {banners.map((banner, index) => (
        <Box
          key={banner.id}
          component="a"
          href={banner.link}
          sx={{
            display: index === currentIndex ? 'block' : 'none',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${banner.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textDecoration: 'none',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 20,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            {banner.title}
          </Typography>
        </Box>
      ))}

      <Button
        onClick={() =>
          setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
        }
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          zIndex: 10,
          '&:hover': { background: 'rgba(0, 0, 0, 0.8)' },
        }}
      >
        ◀
      </Button>

      <Button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          zIndex: 10,
          '&:hover': { background: 'rgba(0, 0, 0, 0.8)' },
        }}
      >
        ▶
      </Button>
    </Box>
  )
}
