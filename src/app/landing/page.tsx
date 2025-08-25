'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// Import Product.json data
import productData from '../../../Product.json';

// ----------------------------------------------------------------------

const categories = [
  { name: 'Gifts', count: '2.5k+', color: 'primary' },
  { name: 'Home Favourites', count: '1.8k+', color: 'secondary' },
  { name: 'Fashion Finds', count: '3.2k+', color: 'success' },
  { name: 'Personalisation', count: '1.1k+', color: 'warning' },
];

// ----------------------------------------------------------------------

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();

  // Get featured products from Product.json (first 4 products)
  const featuredProducts = productData.slice(0, 4);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
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
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Shop by Category
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.name}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={category.count}
                    color={category.color as any}
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
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
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.coverUrl}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      {formatPrice(product.priceSale || product.price)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        ⭐ {product.totalRatings}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({product.totalReviews})
                      </Typography>
                    </Box>
                  </Box>
                  {/* Show sale badge if product is on sale */}
                  {product.priceSale && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label="SALE"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action Section */}
      <Box
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
      </Box>
    </Container>
  );
}
