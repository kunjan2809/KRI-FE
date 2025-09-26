'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CardContent,
  Card,
  Button,
  Stack,
  useTheme,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// Import Product.json data
import { IProductItem } from 'src/types/product';
import Iconify from 'src/components/iconify';
import productData from '../../../Product.json';
import ProductCarousel from './carousel/Carousel';
import HeroSection from './HeroSection/HeroSection';

import bracelet from '../../../public/assets/categories/bresslet.jpg';
import necklace from '../../../public/assets/categories/nackless.jpg';
import ring from '../../../public/assets/categories/ring.jpg';
import watch from '../../../public/assets/categories/watch.png';
import earrings from '../../../public/assets/categories/earrings.jpg';

// ----------------------------------------------------------------------

const categories = [
  { name: 'Bracelet', count: '2.5k+', image: bracelet },
  { name: 'Necklace', count: '1.8k+', image: necklace },
  { name: 'Earrings', count: '1.1k+', image: earrings },
  { name: 'Ring', count: '3.2k+', image: ring },
  { name: 'Watch', count: '1.1k+', image: watch },
];

// ----------------------------------------------------------------------

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get featured products from Product.json (first 4 products)
  const featuredProducts = productData.slice(0, 4);

  // Use Product.json data for recommended products
  const recommendedProducts: IProductItem[] = [
    {
      id: productData[3].id,
      name: productData[3].name,
      collection: productData[3].category,
      price: productData[3].price,
      originalPrice: productData[3].priceSale || productData[3].price,
      image: productData[3].coverUrl,
    },
    {
      id: productData[4].id,
      name: productData[4].name,
      collection: productData[4].category,
      price: productData[4].price,
      originalPrice: productData[4].priceSale || productData[4].price,
      image: productData[4].coverUrl,
    },
    {
      id: productData[5].id,
      name: productData[5].name,
      collection: productData[5].category,
      price: productData[5].price,
      originalPrice: productData[5].priceSale || productData[5].price,
      image: productData[5].coverUrl,
    },
    {
      id: productData[6].id,
      name: productData[6].name,
      collection: productData[6].category,
      price: productData[6].price,
      originalPrice: productData[6].priceSale || productData[6].price,
      image: productData[6].coverUrl,
    },
    {
      id: productData[7].id,
      name: productData[7].name,
      collection: productData[7].category,
      price: productData[7].price,
      originalPrice: productData[7].priceSale || productData[7].price,
      image: productData[7].coverUrl,
    },
    {
      id: productData[8].id,
      name: productData[8].name,
      collection: productData[8].category,
      price: productData[8].price,
      originalPrice: productData[8].priceSale || productData[8].price,
      image: productData[8].coverUrl,
    },
  ];


  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(paths.user.products.details(productId));
  };

  const handleCategoryClick = (categoryName: string) => {
    const categoryPath = paths.user.categories[categoryName.toLowerCase().replace(/\s+/g, '') as keyof typeof paths.user.categories];
    if (categoryPath) {
      router.push(categoryPath);
    }
  };

  const handleViewAllProducts = () => {
    router.push(paths.user.products.root);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <>
      <HeroSection />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        {/* <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Unique Handmade Treasures
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Shop from thousands of independent artists and creators. Find that perfect piece that tells your story.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={handleViewAllProducts}
            sx={{ px: 4, py: 1.5 }}
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push(paths.user.categories.gifts)}
            sx={{ px: 4, py: 1.5 }}
          >
            Explore Gifts
          </Button>
        </Stack>
      </Box> */}


        {/* Categories Section */}
        <Box sx={{ my: 8 }}>
          <Typography variant="h2" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            Shop by Collection
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.name}>
                <Card
                  sx={{
                    position: 'relative',
                    height: '100%',
                    minHeight: { xs: '320px', md: '400px' },
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: theme.shadows[8],
                    '&:hover .bg-image': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {/* Background Image Layer */}
                  <Box
                    className="bg-image"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${category.image.src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      transition: 'transform 0.5s ease-in-out',
                      zIndex: 0,
                    }}
                  />

                  {/* Content Layer */}
                  <CardContent
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      textAlign: 'center',
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'end',
                      alignItems: 'center',
                      color: 'white', // Ensure visibility over the image
                      backdropFilter: 'brightness(0.9)', // Optional: dim background slightly
                    }}
                  >
                    <Typography variant="h3" component="h3" sx={{ mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ borderColor: 'white' }}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      View Collection
                    </Button>
                  </CardContent>
                </Card>

              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Products Section */}
        <Box sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h2" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
              Featured Products
            </Typography>
            <Button
              variant="text"
              onClick={handleViewAllProducts}
              sx={{ textTransform: 'none' }}
            >
              View All →
            </Button>
          </Box>
          <Box sx={{ mb: 4, position: 'relative' }}>
            <ProductCarousel
              products={recommendedProducts as IProductItem[]}
              direction="right"
            />
          </Box>
          <Box sx={{ mb: 4, position: 'relative' }}>
            <ProductCarousel
              products={recommendedProducts as IProductItem[]}
              direction="left"
            />
          </Box>
        </Box>

        {/* Call to Action Section */}
        <Box
          sx={{
            minHeight: '100vh',
          }}
        >
          {/* Main Newsletter Section */}
          <Box
            sx={{
              margin: '0 auto',
              px: 2,
              py: { xs: 8, lg: 12 },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: { xs: 6, lg: 8 },
                alignItems: 'center',
                maxWidth: '1400px',
                mx: 'auto',
              }}
            >
              {/* Left Column - Form */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  pr: { lg: 4 },
                }}
              >
                {/* Brand Badge */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#212B36',
                  }}
                >
                  <Iconify icon="mdi:sparkles" width={20} />
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Exclusive Access
                  </Typography>
                </Box>

                {/* Main Heading */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: '2.25rem', lg: '3rem', xl: '3.75rem' },
                      fontFamily: 'serif',
                      color: 'rgba(61, 63, 65, 0.7)',
                      lineHeight: 1.2,
                      fontWeight: 400,
                    }}
                  >
                    Get the Latest from{' '}
                    <Box
                      component="span"
                      sx={{
                        color: '#212B36',
                      }}
                    >
                      Kri
                    </Box>
                  </Typography>

                  {/* Decorative line */}
                  <Box
                    sx={{
                      width: '96px',
                      height: '2px',
                      background: (theme) => `linear-gradient(to right, #212B36, #fff)`,
                    }}
                  />
                </Box>

                {/* Subheading */}
                <Typography
                  sx={{
                    fontSize: { lg: '1.25rem' },
                    color: 'rgba(100, 116, 139, 0.7)',
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  Sign up to receive{' '}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(100, 116, 139)',
                    }}
                  >
                    10% off
                  </Box>{' '}
                  your next purchase and get exclusive updates on new arrivals, limited collections, and insider offers.
                </Typography>

                {/* Email Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                  <Box sx={{
                    position: 'relative',
                    '.MuiOutlinedInput-notchedOutline': {
                      border: '1px solid #212B36',
                    },
                  }}>
                    <TextField
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              type="submit"
                              variant="contained"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                height: '100%',
                                borderRadius: '0 8px 8px 0',
                              }}
                            >
                              <Iconify icon="mdi:arrow-right" width={24} />
                            </Button>
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: '1.125rem',
                          backdropFilter: 'blur(4px)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          '& .MuiInputBase-input': {
                            '&::placeholder': {
                              color: '#6b7280',
                            },
                          },
                        },
                      }}
                    />


                  </Box>
                </Box>

                {/* Trust Indicators */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    fontWeight: 500,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        bgcolor: '#212B36',
                        borderRadius: '50%',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.875rem' }}>No spam, ever</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        bgcolor: '#212B36',
                        borderRadius: '50%',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.875rem' }}>Unsubscribe anytime</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right Column - Image */}
              <Box
                sx={{
                  position: 'relative',
                  order: { xs: -1, lg: 1 },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  {/* Main Image */}
                  <Box
                    component="img"
                    src="https://media.istockphoto.com/id/2150594029/photo/diamond-jewelry-ring-earing-luxury-jewellery-fashion.jpg?s=612x612&w=0&k=20&c=vhQvedhjArl0EMg7vQ1osFgguKg_Il5K9YVX9asC6pI="
                    alt="Elegant jewelry collection featuring delicate necklaces and bracelets"
                    sx={{
                      width: '100%',
                      height: { xs: '500px', lg: '650px' },
                      maxHeight: '100vh',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent, transparent)',
                    }}
                  />
                </Box>

                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-16px',
                    left: '-16px',
                    width: '96px',
                    height: '96px',
                    bgcolor: 'rgba(var(--mui-palette-secondary-mainChannel), 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(32px)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-16px',
                    right: '-16px',
                    width: '128px',
                    height: '128px',
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel), 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(32px)',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Additional Features Section */}
          <Box
          >
            <Box
              sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                px: 2,
                py: 6,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 4,
                  maxWidth: '896px',
                  mx: 'auto',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      bgcolor: '#212B36',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                    }}
                  >
                    <Iconify icon="mdi:sparkles" width={24} color="#fff" />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'serif',
                      fontSize: '1.125rem',
                      color: '#111827',
                    }}
                  >
                    Exclusive Collections
                  </Typography>
                  <Typography
                    sx={{
                      color: '#4b5563',
                      fontSize: '0.875rem',
                    }}
                  >
                    First access to limited edition pieces
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      bgcolor: '#212B36',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: 'serif',
                        fontSize: '1.5rem',
                      }}
                    >
                      %
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'serif',
                      fontSize: '1.125rem',
                      color: '#111827',
                    }}
                  >
                    Member Discounts
                  </Typography>
                  <Typography
                    sx={{
                      color: '#4b5563',
                      fontSize: '0.875rem',
                    }}
                  >
                    Special pricing for newsletter subscribers
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      bgcolor: '#212B36',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: 'serif',
                        fontSize: '2rem',
                      }}
                    >
                      ♦
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'serif',
                      fontSize: '1.125rem',
                      color: '#111827',
                    }}
                  >
                    Style Insights
                  </Typography>
                  <Typography
                    sx={{
                      color: '#4b5563',
                      fontSize: '0.875rem',
                    }}
                  >
                    Expert tips and jewelry styling guides
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Global styles for animations */}
          <Box
            component="style"
            sx={{
              '& + style': {
                display: 'none',
              },
            }}
          >
            {`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                `}
          </Box>
        </Box>
        {/* <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Ready to Start Shopping?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Join thousands of happy customers who have discovered unique treasures on our platform.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push(paths.auth.jwt.register)}
              sx={{ px: 4, py: 1.5 }}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push(paths.auth.jwt.login)}
              sx={{ px: 4, py: 1.5 }}
            >
              Sign In
            </Button>
          </Stack>
        </Box> */}
      </Container>
    </>
  );
}
