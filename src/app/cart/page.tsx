'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Stack,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// Import Product.json data
import productData from '../../../Product.json';
import RecommendedProductsCard from './RecommendedProductsCard';
import CheckoutPopup from './CheckoutPopup';

// Convert Product.json data to cart items format
const cartItems = [
  {
    id: productData[0].id,
    name: productData[0].name,
    description: productData[0].subDescription,
    material: productData[0].category,
    price: productData[0].price,
    quantity: 1,
    image: productData[0].coverUrl,
  },
  {
    id: productData[1].id,
    name: productData[1].name,
    description: productData[1].subDescription,
    material: productData[1].category,
    price: productData[1].price,
    quantity: 2,
    image: productData[1].coverUrl,
  },
  {
    id: productData[2].id,
    name: productData[2].name,
    description: productData[2].subDescription,
    material: productData[2].category,
    price: productData[2].price,
    image: productData[2].coverUrl,
    quantity: 1,
  },
];

// Use Product.json data for recommended products
const recommendedProducts = [
  {
    id: productData[3].id,
    name: productData[3].name,
    collection: productData[3].category,
    price: productData[3].price,
    originalPrice: productData[3].priceSale || productData[3].price,
    image: productData[3].coverUrl,
    wishlist: productData[3].wishlist,
  },
  {
    id: productData[4].id,
    name: productData[4].name,
    collection: productData[4].category,
    price: productData[4].price,
    originalPrice: productData[4].priceSale || productData[4].price,
    image: productData[4].coverUrl,
    wishlist: productData[4].wishlist,
  },
  {
    id: productData[5].id,
    name: productData[5].name,
    collection: productData[5].category,
    price: productData[5].price,
    originalPrice: productData[5].priceSale || productData[5].price,
    image: productData[5].coverUrl,
    wishlist: productData[5].wishlist,
  },
  {
    id: productData[6].id,
    name: productData[6].name,
    collection: productData[6].category,
    price: productData[6].price,
    originalPrice: productData[6].priceSale || productData[6].price,
    image: productData[6].coverUrl,
    wishlist: productData[6].wishlist,
  },
];

// ----------------------------------------------------------------------

export default function CartPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState(cartItems);
  const [promoCode, setPromoCode] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartData(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartData(prev => prev.filter(item => item.id !== itemId));
  };

  const saveForLater = (itemId: string) => {
    // Handle save for later functionality
    console.log('Save for later:', itemId);
  };

  const addToWishlist = (itemId: string) => {
    // Handle add to wishlist functionality
    console.log('Add to wishlist:', itemId);
  };

  const applyPromoCode = () => {
    // Handle promo code application
    console.log('Applying promo code:', promoCode);
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Order completed:', orderData);
    // Handle successful checkout - could redirect to order confirmation page
    router.push('/order-details');
  };

  const addToCart = (productId: string) => {
    // Handle adding recommended product to cart
    console.log('Adding to cart:', productId);
  };

  // Calculate totals
  const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 50; // Free shipping over $2000
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  if (cartData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
          Your Shopping Bag is Empty
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Start shopping to discover beautiful pieces that tell your story.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push(paths.user.products.root)}
          sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
        >
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Promotional Banner */}
      {/* <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            A Chapter Almost Complete
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            The pieces you&apos;ve chosen are more than just jewelry, they&apos;re moments waiting to be lived.
            Finalize your selection and let your story shine in lumière.
          </Typography>
        </Container>
      </Box> */}

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Shopping Cart Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
            Your Shopping Bag
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Review your selections before checking out.
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column - Cart Items */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {cartData.map((item) => (
                  <Card key={item.id} sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={item.image}
                          alt={item.name}
                          sx={{ objectFit: 'cover', borderRadius: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {item.material}
                            </Typography>

                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Iconify icon="eva:minus-outline" />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                                size="small"
                                sx={{ width: 60, mx: 1 }}
                                inputProps={{ style: { textAlign: 'center' } }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Iconify icon="eva:plus-outline" />
                              </IconButton>
                            </Box>

                            {/* Price */}
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                              {formatPrice(item.price * item.quantity)}
                            </Typography>
                            {item.quantity > 1 && (
                              <Typography variant="body2" color="text.secondary">
                                {formatPrice(item.price)} each
                              </Typography>
                            )}

                            {/* Action Links */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => saveForLater(item.id)}
                                sx={{ textTransform: 'none', color: 'text.secondary' }}
                              >
                                Save for later
                              </Button>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => addToWishlist(item.id)}
                                sx={{ textTransform: 'none', color: 'text.secondary' }}
                              >
                                Add to wishlist
                              </Button>
                            </Box>
                          </Box>

                          {/* Remove Button */}
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            sx={{ color: 'text.secondary' }}
                          >
                            ×
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                {/* Promo Code */}
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Have a promo code?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      onClick={applyPromoCode}
                      sx={{ px: 3 }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Card>
              </Stack>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ p: 3, position: 'sticky', top: 20, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal</Typography>
                    <Typography>{formatPrice(subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Estimated Shipping</Typography>
                    <Typography color="success.main">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tax</Typography>
                    <Typography>{formatPrice(tax)}</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatPrice(total)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  sx={{
                    py: 1.5,
                    bgcolor: 'grey.800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': { bgcolor: 'grey.900' },
                  }}
                >
                  <Iconify icon="eva:lock-outline" />
                  Proceed to Secure Checkout
                </Button>

                {/* Guarantees */}
                <Stack spacing={1} sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:lock-fill" sx={{ color: 'success.main', width: 16, height: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Secure Payment
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:refresh-fill" sx={{ color: 'success.main', width: 16, height: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Free returns within 14 days
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:car-fill" sx={{ color: 'success.main', width: 16, height: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Free shipping on orders over $2,000
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Product Recommendations */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Complete Your Look With These Gems
          </Typography>
          <Grid container spacing={3}>
            {recommendedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                {/* <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1rem' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.collection}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {formatPrice(product.price)}
                      </Typography>
                      {product.originalPrice && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {formatPrice(product.originalPrice)}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() => addToCart(product.id)}
                      startIcon={<Iconify icon="eva:shopping-cart-outline" />}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card> */}
                <RecommendedProductsCard product={product} addToCart={addToCart} addToWishlist={() => { }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Checkout Popup */}
      <CheckoutPopup
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartData={cartData}
        onUpdateCart={setCartData}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </Box>
  );
}
