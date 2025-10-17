'use client';

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

// ----------------------------------------------------------------------

// Mock gifts data
const giftsData = [
  {
    id: '1',
    name: 'Personalized Jewelry Box',
    price: 32.50,
    category: 'Jewelry',
    image: '/assets/images/home/hero-2.webp',
    rating: 4.9,
    reviews: 89,
    description: 'Custom engraved jewelry box with velvet interior.',
    isPersonalized: true,
  },
  {
    id: '2',
    name: 'Handcrafted Wooden Bowl',
    price: 45.99,
    category: 'Home & Garden',
    image: '/assets/images/home/hero-1.webp',
    rating: 4.8,
    reviews: 127,
    description: 'Beautiful hand-carved wooden bowl perfect for serving or display.',
    isPersonalized: false,
  },
  {
    id: '3',
    name: 'Vintage Style Wall Clock',
    price: 78.00,
    category: 'Home Decor',
    image: '/assets/images/home/hero-3.webp',
    rating: 4.7,
    reviews: 203,
    description: 'Elegant vintage-inspired wall clock with brass accents.',
    isPersonalized: false,
  },
  {
    id: '4',
    name: 'Organic Cotton Tote Bag',
    price: 24.99,
    category: 'Fashion',
    image: '/assets/images/home/hero-4.webp',
    rating: 4.6,
    reviews: 156,
    description: 'Sustainable and stylish tote bag for everyday use.',
    isPersonalized: false,
  },
];

// ----------------------------------------------------------------------

export default function GiftsPage() {
  const theme = useTheme();
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(paths.user.products.details(productId));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
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
          Perfect Gifts for Every Occasion
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Discover thoughtful, handmade gifts that show you care. From personalized treasures to unique finds, 
          we have something special for everyone on your list.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(paths.user.products.root)}
            sx={{ px: 4, py: 1.5 }}
          >
            Shop All Gifts
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push(paths.user.categories.personalisation)}
            sx={{ px: 4, py: 1.5 }}
          >
            Personalized Gifts
          </Button>
        </Stack>
      </Box>

      {/* Featured Gifts */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Featured Gifts
        </Typography>
        <Grid container spacing={3}>
          {giftsData.map((product) => (
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
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    {product.isPersonalized && (
                      <Chip
                        label="Personalized"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      ${product.price}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        ⭐ {product.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({product.reviews})
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Gift Categories */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Gift Categories
        </Typography>
        <Grid container spacing={3}>
          {[
            { name: 'For Her', count: '500+', color: 'primary', href: '/gifts/for-her' },
            { name: 'For Him', count: '400+', color: 'secondary', href: '/gifts/for-him' },
            { name: 'For Kids', count: '300+', color: 'success', href: '/gifts/for-kids' },
            { name: 'For Home', count: '600+', color: 'warning', href: '/gifts/for-home' },
            { name: 'Personalized', count: '200+', color: 'info', href: '/gifts/personalized' },
            { name: 'Under $50', count: '800+', color: 'error', href: '/gifts/under-50' },
          ].map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
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
                onClick={() => router.push(category.href)}
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

      {/* Call to Action */}
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
          Need Help Finding the Perfect Gift?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          Our gift guides and personalized recommendations make it easy to find something special for everyone.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(paths.user.products.root)}
            sx={{ px: 4, py: 1.5 }}
          >
            Browse All Gifts
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push(paths.user.categories.personalisation)}
            sx={{ px: 4, py: 1.5 }}
          >
            Personalized Options
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
