'use client';

import { useState, useEffect } from 'react';
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
  Stack,
  TextField,
  IconButton,
  useTheme,
  Alert,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// Import Product.json data

import ProductDetailsDescription from 'src/sections/product/product-details-description';
import Iconify from 'src/components/iconify';
import ProductDetailsCarousel from 'src/sections/product/product-details-carousel';
import {
  IProductItem,
  Product,
  ProductDetailsRoot,
  Reviews,
  Suggestion,
  Variation,
} from 'src/types/product';
import ProductDetailsReview from 'src/sections/product/product-details-review';
import RecommendedProductsCard from 'src/app/cart/RecommendedProductsCard';

import { getSuggestionById, getUserProductById } from 'src/api/product';
import { useAuthToken } from 'src/auth/hooks';
import { enqueueSnackbar } from 'notistack';
import { AddToCart } from 'src/api/cart';
import { addWishlist, removeWishlist } from 'src/api/wishlist';
import { ProductDetailsLoading } from 'src/sections/product/product-skeleton';
import { ReviewLoading } from 'src/sections/product/review-skeleton';
import { SuggestionCardLoading } from 'src/sections/product/suggestion-card-skeleton';
import LoginPopup from 'src/app/landing/loginPopup/AuthPopup';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

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
  const token = useAuthToken();
  const params = useParams();
  const { authenticated } = useAuthContext();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState<Product | null>(null);
  const [review, setReview] = useState<Reviews | null>(null);
  const [suggestionData, setSuggestionData] = useState<Suggestion[] | []>([]);
  const [isProductDetailsLoading, setIsProductDetailsLoading] = useState<Boolean>(true);
  const [isReviewLoading, setIsReviewLoading] = useState<Boolean>(true);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState<Boolean>(true);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  const productId = params.id as string;

  const getProductDataById = async () => {
    if (productId) {
      try {
        let response = await getUserProductById(productId, token);
        if (response.success) {
          const { product, reviews } = response.data ?? {};

          if (product) {
            // const transformedArray = product?.images?.map((img) => `${img?.image_url}`);
            setProductData(product);
            if (product.variations && product?.variations?.length > 0) {
              setSelectedSize(product.variations[0].size);
              setSelectedColor(product.variations[0].color);
            }
          }
          if (reviews) {
            setReview(reviews);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsProductDetailsLoading(false);
        setIsReviewLoading(false);
      }
    }
  };

  const getProductSuggestion = async () => {
    if (productId) {
      try {
        let response = await getSuggestionById(productId, token);
        if (response.success) {
          const { suggestions } = response.data ?? {};
          if (suggestions) {
            setSuggestionData(suggestions);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch suggestions product';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsSuggestionLoading(false);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = async (productId: string, variation?: Variation[]) => {
    try {
      if (!authenticated) {
        setLoginPopupOpen(true);
      } else {
        const selectedVariation =
          variation && variation.find((v) => v.color === selectedColor && v.size === selectedSize);
        const variationId = selectedVariation?.id ?? null;
        await AddToCart(token, productId, variationId as string, quantity);
        router.push(paths.user.cart);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to product add to cart';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleWishlist = async (productId: string, wishlist: boolean) => {
    try {
      !wishlist ? await addWishlist(productId, token) : await removeWishlist(productId, token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to product add to cart';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleSelectedVariation = (event: SelectChangeEvent) => {
    setSelectedColor(event.target.value as string);
  };

  const handleLoginPopupClose = (): void => {
    setLoginPopupOpen(false);
  };

  useEffect(() => {
    const sizeOfPresentVariation =
      productData?.variations && productData.variations.find((v) => v.color === selectedColor);
    if (sizeOfPresentVariation) setSelectedSize(sizeOfPresentVariation.size);
  }, [selectedColor]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  useEffect(() => {
    getProductDataById();
    getProductSuggestion();
  }, [productId]);

  // Use product data from Product.json
  const totalRating = (review && review.summary.average_rating) || 0;
  const totalReviews = (review && review.summary.total_reviews) || 0;

  return (
    <Box>
      {/* Hero Section */}
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
            Discover Your Perfect Style
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            Explore our curated collection of handcrafted pieces that tell your unique story.
          </Typography>
        </Container>
      </Box> */}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Success Alert */}
        {/* {reviewSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your review! It has been submitted successfully.
          </Alert>
        )}  */}

        {/* Product Details */}

        {isProductDetailsLoading ? (
          <ProductDetailsLoading />
        ) : !productData ? (
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
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <ProductDetailsCarousel product={productData} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                      {productData.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating value={totalRating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {totalRating.toFixed(2)} ({totalReviews} reviews)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {productData.sold} sold
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {formatPrice(productData.price)}
                  </Typography>
                  {productData.mrp && (
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through', mt: 1 }}
                    >
                      {formatPrice(productData.mrp)}
                    </Typography>
                  )}
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {productData.description}
                </Typography>

                {productData.variations && productData.variations.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Color
                    </Typography>
                    <Select
                      value={selectedColor}
                      placeholder="Select a color"
                      onChange={handleSelectedVariation}
                      sx={{ maxWidth: '50%', width: '400px' }}
                    >
                      {productData.variations.map((variation) => (
                        <MenuItem key={variation.color} value={variation.color}>
                          {variation.color}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}

                {productData.variations && productData.variations.length > 0 && (
                  <Box width="100%">
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Size
                    </Typography>
                    <Select
                      value={selectedSize}
                      onChange={(event) => setSelectedSize(event.target.value as string)}
                      placeholder="Select a size"
                      sx={{ maxWidth: '50%', width: '400px' }}
                    >
                      {productData.variations
                        .filter((variation) => variation.color === selectedColor)
                        .map((variation) => (
                          <MenuItem key={variation.size} value={variation.size}>
                            {variation.size}
                          </MenuItem>
                        ))}
                    </Select>
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
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
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
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
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
                    onClick={() => handleAddToCart(productId, productData?.variations)}
                    sx={{ py: 1.5 }}
                  >
                    <Iconify icon="eva:shopping-cart-fill" /> Add to Cart
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    // onClick={handleBuyNow}
                    sx={{ py: 1.5 }}
                  >
                    <Iconify icon="eva:shopping-cart-fill" /> Buy Now
                  </Button>
                </Stack>

                <Card
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    boxShadow: 'none',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Product Highlights
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'text.secondary',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Premium quality materials
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'text.secondary',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Expert Craftsmanship
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'text.secondary',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Timeless & Elegant Design
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'text.secondary',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Enhanced Comfort & Usability
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card sx={{ p: 3, boxShadow: 'none', border: '1px solid #E0E0E0' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Delivery & Returns
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="eva:briefcase-outline" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        Complimentary standard delivery
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="ant-design:truck-outlined" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        Express delivery available
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="ant-design:clock-circle-outlined" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        14-day return policy
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    boxShadow: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Iconify icon="icomoon-free:shield" color="text.secondary" />
                    <Typography variant="h6">Purchase Protection</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Your order is covered by our Buyer Protection Policy, ensuring a safe and secure
                    shopping experience. If any issue arises with your purchase, our support team
                    will resolve it promptly and fairly. We’re committed to ensuring every
                    experience with us is secure, seamless, and worry-free.
                  </Typography>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        )}

        {isReviewLoading ? (
          <ReviewLoading />
        ) : (
          <Box sx={{ mt: 8 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Description" />
                <Tab label="Reviews" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <ProductDetailsDescription description={productData?.description as string} />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <ProductDetailsReview getProductDataById={getProductDataById} />
            </TabPanel>
          </Box>
        )}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Complete Your Look With These Gems
          </Typography>

          {isSuggestionLoading ? (
            <SuggestionCardLoading />
          ) : (
            <Grid container spacing={3}>
              {suggestionData.map((recommendedProduct) => {
                const suggestion = {
                  ...recommendedProduct,
                  collection: recommendedProduct.category.name,
                  originalPrice: recommendedProduct.mrp,
                  id: recommendedProduct._id,
                  image: recommendedProduct.primary_image?.image_url,
                  wishlist: recommendedProduct.is_in_wishlist,
                };
                return (
                  <Grid item xs={12} sm={6} md={3} key={recommendedProduct.category_id}>
                    <RecommendedProductsCard
                      product={suggestion as Suggestion}
                      addToCart={() =>
                        handleAddToCart(recommendedProduct._id, recommendedProduct.variations)
                      }
                      addToWishlist={handleWishlist}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>
      {loginPopupOpen && (
        <LoginPopup
          open={loginPopupOpen}
          onClose={handleLoginPopupClose}
          title="Login"
          description="Please login to check cart"
        />
      )}
    </Box>
  );
}
