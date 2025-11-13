'use client';

import { useState, useEffect, SyntheticEvent } from 'react';

import {
  Box,
  Grid,
  Card,
  Stack,
  Button,
  Divider,
  Container,
  CardMedia,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

import { useAuthToken } from 'src/auth/hooks';
import { ProductSuggestion } from 'src/api/product';
import { addWishlist,removeWishlist} from 'src/api/wishlist';
import { AddToCart, getAllCartProducts, removeItemFromCart, updateItemQuantity } from 'src/api/cart';

import { ProductCartPageSkeleton, ProductSuggestionSlider } from 'src/sections/product/product-skeleton';

import { CartItem, } from 'src/types/cart';
import { Suggestion } from 'src/types/product';

import CheckoutPopup from './CheckoutPopup';
import RecommendedProductsCard from './RecommendedProductsCard';


export default function CartPage() {

  const { enqueueSnackbar } = useSnackbar()
  const token = useAuthToken()
  const router = useRouter();


  const [cartData, setCartData] = useState<CartItem[]>([])
  const [isCartDataLoading, setIsCartDataLoading] = useState(true)
  const [isRecommandDataLoading, setIsRecommandDataLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Suggestion[]>([])
  const [promoCode, setPromoCode] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);



  const addToCart = async (productId: string) => {

    try {
      const response = await AddToCart(token, productId)
      if (response.success) {
        enqueueSnackbar(response.message, { variant: "success" })
        fetchCartProduct()
      }
    } catch (error) {
      console.log("Somthing want wrong", error)
    }
  };
   const handleAddWishlist = async (productId:string,wishlist:boolean) => {
        if (wishlist) {
            await removeWishlist(productId, token)
        } else {
            await addWishlist(productId, token)
        }
    };


  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartData(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    try {
      await updateItemQuantity(itemId, token, newQuantity)
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" })
    }
    
  };

  const removeItem = async (itemId: string) => {
    setCartData(prev =>
      prev.filter(item => item.id !== itemId)
    )
    try {
      await removeItemFromCart(itemId, token)
    } catch (error) {
      console.log("falied to remove", error);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const response = await addWishlist(productId, token)
      if (response.success) {
        enqueueSnackbar(response.message, { variant: "success" })
      } else {
        enqueueSnackbar(response.message, { variant: "error" })
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const applyPromoCode = () => {
    console.log('Applying promo code:', promoCode);
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Order completed:', orderData);
    // Handle successful checkout - could redirect to order confirmation page
    router.push(paths.user.orders.root);
  };



  // Calculate totals
  const subtotal = cartData.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping =0; // Free shipping over $2000
  const tax = 0
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);


  const fetchCartProduct = async () => {
    setIsCartDataLoading(true)
    setIsRecommandDataLoading(true)

    try {
      const cartResponse = await getAllCartProducts(token)
      const items: CartItem[] = cartResponse.data.cart_items
      setCartData(items)
      setIsCartDataLoading(false)
      if (items && items.length > 0) {
        const productid = items[0].product.id
        const response = await ProductSuggestion(token, productid)
        if (response.success) {
          setRecommendations(response.data.suggestions)
          setIsRecommandDataLoading(false)
        }

      } else {
        setRecommendations([])
        setIsCartDataLoading(false)
        setIsRecommandDataLoading(false)
      }

    } catch (error) {
      console.log('error', error)
    } finally {
      setIsCartDataLoading(false)
      setIsRecommandDataLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCartProduct()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (cartData.length === 0 && !isCartDataLoading) {
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
          {isCartDataLoading ? <ProductCartPageSkeleton /> :
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
                            image={item.product.primary_image?item.product.primary_image.image_url:"https://nraasmart.orderz.app/images/item_placeholder.jpg"}
                            alt={item.product.name}
                            sx={{ objectFit: 'cover', borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                                {item.product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {item.product.description}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {item.product.category.name}
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
                                {formatPrice(item.product.price * item.quantity)}
                              </Typography>
                              {item.quantity > 1 && (
                                <Typography variant="body2" color="text.secondary">
                                  {formatPrice(item.product.price)} each
                                </Typography>
                              )}

                              {/* Action Links */}
                              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>

                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => addToWishlist(item.product.id)}
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
                      <Iconify icon="eva:lock-fill" sx={{ color: '#161C24', width: 16, height: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Secure Payment
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="eva:refresh-fill" sx={{ color: '#161C24', width: 16, height: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Free returns within 14 days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="eva:car-fill" sx={{ color: '#161C24', width: 16, height: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Free shipping on orders over $2,000
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

            </Grid>}
        </Box>

        {/* Product Recommendations */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Complete Your Look With These Gems
          </Typography>
          {isRecommandDataLoading ? <ProductSuggestionSlider rowCount={1} /> : <Grid container spacing={3}>
            {recommendations.map((product) => {
              const suggestion={
                ...product,
                 id:product._id,
                 name:product.name,
                 image:product.primary_image?.image_url,
                 collection:product.category.name,
                 price:product.price,
                 originalPrice:product.mrp,
                 wishlist:product.is_in_wishlist
              }
            return(

                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <RecommendedProductsCard product={suggestion} addToCart={addToCart} addToWishlist={handleAddWishlist} />
                </Grid>
              )
            })}
          </Grid>}
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
