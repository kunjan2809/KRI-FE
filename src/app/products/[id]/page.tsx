'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  Tabs,
  Tab,
  Rating,
  Chip,
  Stack,
  TextField,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// Import Product.json data

import ProductDetailsDescription from 'src/sections/product/product-details-description';
import Iconify from 'src/components/iconify';
import ProductDetailsCarousel from 'src/sections/product/product-details-carousel';
import { IProductItem, IProductReview } from 'src/types/product';
import ProductDetailsReview from 'src/sections/product/product-details-review';
import RecommendedProductsCard from 'src/app/cart/RecommendedProductsCard';

import productData from '../../../../Product.json';


// Use Product.json data for recommended products
const recommendedProducts = [
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
];

// ----------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Find product from Product.json data
  const product = useMemo(() => {
    if (!params.id) return null;
    return productData.find((p: any) => p.id === params.id) || productData[0]; // Fallback to first product
  }, [params.id]);
  
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Product not found</Typography>
        <Button
          variant="contained"
          onClick={() => router.push(paths.user.products.root)}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  // Use product data from Product.json
  const totalRating = product.totalRatings || 0;
  const totalReviews = product.totalReviews || 0;
  const totalSold = product.totalSold || 0;
  const isNew = product.newLabel?.enabled || false;
  const isSale = product.saleLabel?.enabled || false;
  const salePrice = product.priceSale;
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const description = product.description || '';
  const subDescription = product.subDescription || '';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = () => {
    // Handle add to cart functionality
    console.log('Adding to cart:', { product: product.name, size: selectedSize, quantity });
  };

  const handleBuyNow = () => {
    // Handle buy now functionality
    console.log('Buying now:', { product: product.name, size: selectedSize, quantity });
  };

  const handleReviewSubmit = () => {
    // Handle review submission
    setReviewSuccess(true);
    setReviewDialogOpen(false);
    setReviewForm({ rating: 5, comment: '' });

    // Reset success message after 3 seconds
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);


  const addToCart = (productId: string) => {
    // Handle adding recommended product to cart
    console.log('Adding to cart:', productId);
  };
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Discover Your Perfect Style
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            Explore our curated collection of handcrafted pieces that tell your unique story.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.primary">
            {product.name}
          </Typography>
        </Box>

        {/* Success Alert */}
        {reviewSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your review! It has been submitted successfully.
          </Alert>
        )}

        {/* Product Details */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <ProductDetailsCarousel product={product as unknown as IProductItem} />

            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {isNew && (
                    <Chip
                      label="NEW"
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                  {isSale && (
                    <Chip
                      label="SALE"
                      color="error"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating value={totalRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {totalRating} ({totalReviews} reviews)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {totalSold} sold
                </Typography>
              </Box>

              <Box>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {formatPrice(salePrice || product.price)}
                </Typography>
                {salePrice && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through', mt: 1 }}
                  >
                    {formatPrice(product.price)}
                  </Typography>
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {subDescription}
              </Typography>

              {colors.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Color
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {colors.map((color: string, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '2px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {sizes.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Size
                  </Typography>
                  <Grid container spacing={1}>
                    {sizes.map((size: string) => (
                      <Grid item key={size}>
                        <Button
                          variant={selectedSize === size ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setSelectedSize(size)}
                          sx={{ minWidth: 48 }}
                        >
                          {size}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    sx={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Iconify icon="eva:minus-fill" />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setQuantity(quantity + 1)}
                    sx={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Iconify icon="eva:plus-fill" />
                  </IconButton>
                </Box>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                  sx={{ py: 1.5 }}
                >
                  <Iconify icon="eva:shopping-cart-fill" /> Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleBuyNow}
                  sx={{ py: 1.5 }}
                >
                  <Iconify icon="eva:shopping-cart-fill" /> Buy Now
                </Button>
              </Stack>

              <Card sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Product Highlights
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">Premium quality materials</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">Handcrafted with care</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">Free shipping on orders over $200</Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Delivery & Returns
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:briefcase-outline" color="success.main" />
                    <Typography variant="body2" color="text.secondary"> Free standard delivery on orders over $200
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="ant-design:truck-outlined" color="success.main" />
                    <Typography variant="body2" color="text.secondary"> Express delivery available
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="ant-design:clock-circle-outlined" color="success.main" />
                    <Typography variant="body2" color="text.secondary"> 14-day return policy
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Etsy Protection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your purchase is protected by Etsy&apos;s Buyer Protection Program. If there&apos;s an issue with your order, we&apos;ll make it right.
                </Typography>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Description" />
              <Tab label="Reviews" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <ProductDetailsDescription description={description} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <ProductDetailsReview
              ratings={product.ratings as any[]}
              reviews={product.reviews as unknown as IProductReview[]}
              totalRatings={product.totalRatings as number}
              totalReviews={product.totalReviews as number}
            />
          </TabPanel>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Complete Your Look With These Gems
          </Typography>
          <Grid container spacing={3}>
            {recommendedProducts.map((recommendedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={recommendedProduct.id}>
                <RecommendedProductsCard product={recommendedProduct as unknown as IProductItem} addToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(_, newValue) => setReviewForm({ ...reviewForm, rating: newValue || 5 })}
                size="large"
              />
            </Box>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your experience with this product..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleReviewSubmit}
            disabled={!reviewForm.comment.trim()}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
