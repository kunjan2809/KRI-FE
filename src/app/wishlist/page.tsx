
'use client';

import { useState, useEffect } from 'react';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Pagination,
  Chip,
  Rating,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { AddToCart } from 'src/api/cart';
import { useAuthToken } from 'src/auth/hooks';
import { getAllWishlist, removeWishlist, } from 'src/api/wishlist';

// Import product data
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------
import { SplashScreen } from 'src/components/loading-screen';

import { WishlistItem, WishlistProduct } from 'src/types/product';
import { ProductCardSkeleton } from 'src/sections/product/product-skeleton';


// ----------------------------------------------------------------------


export default function ProductsPage() {

  // hookes
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter();
  const token = useAuthToken()

  const [fetchWishlistLoading, setFetchWishlistLoading] = useState(true)
  const [wishlistItem, setwishlistItem] = useState<WishlistItem[]>([])
  const [animate, setAnimate] = useState('');



  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>, product: WishlistProduct) => {
    event.stopPropagation()
    const productId = product.id
    const variationId = product.variations[0]?._id
    try {
      const response = await AddToCart(token, productId, variationId)
      if (response.success) {
        enqueueSnackbar(response.message, { variant: "success" })
      }
    } catch (error) {
      console.log("Somthing want wrong", error)
    }
  };

  const handleRemoveToWishlist = async (event: React.MouseEvent<HTMLDivElement>, product: WishlistProduct) => {
    event.stopPropagation();
    setAnimate(product.id);
    try {
      await removeWishlist(product.id, token)
      fetchWishlistProduct()
    } catch (error) {
      console.log("Somthing want wrong", error)
    }

    setTimeout(() => setAnimate(''), 500);
  };

  const handleProductClick = (productId: string) => {
    router.push(paths.user.products.details(productId));
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);


  const fetchWishlistProduct = async () => {
    try {
      const response = await getAllWishlist(token)
      setwishlistItem(response.data.wishlist_items)
      setFetchWishlistLoading(false)
    } catch (error) {
      console.log('Something went wrong', error)
      setFetchWishlistLoading(false)
    } finally {
      setFetchWishlistLoading(false)
    }

  }

  useEffect(() => {
    if (token) {
      fetchWishlistProduct()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
          Your Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your favorite products are waiting for you.
        </Typography>

      </Box>
      {fetchWishlistLoading ? <ProductCardSkeleton/> :

        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ width: "100%" }}>

            {/* Products Grid */}
            {wishlistItem.length > 0 ? (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {wishlistItem.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.product.id}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: 'none',
                          border: '1px solid #E0E0E0',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                          },
                          '.add-wishlist-btn': {
                            // ...(item.product.wishlist ? {
                            opacity: 1,
                            top: 5,
                            right: 5,
                            transition: 'all 0.1s ease',
                            // } : {
                            //   opacity: 0,
                            //   top: '25%',
                            //   transition: 'all 0.1s ease',
                            // }),
                          },
                          '&:hover .add-wishlist-btn': {
                            opacity: 1,
                            top: 5,
                            right: 5,
                            transition: 'all 0.1s ease',
                          },
                        }}
                        onClick={() => handleProductClick(item.product.id)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="250"
                            image={item.product.primary_image ? item.product.primary_image.image_url :"https://nraasmart.orderz.app/images/item_placeholder.jpg"}
                            alt={item.product.name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <Box
                            className='add-wishlist-btn'
                            onClick={(event) => handleRemoveToWishlist(event, item.product as WishlistProduct)}
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              // padding: 1,
                              zIndex: 10,
                              minWidth: 36,
                              minHeight: 36,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              backgroundColor: 'white',
                              'svg': {
                                // transition: 'transform 0.3s ease, color 0.3s ease',
                                // color: 'white',
                                // stroke: '#212B36',
                                // ...(item.product.wishlist && {
                                transition: 'color 0.3s ease',
                                color: 'red',
                                stroke: 'red',
                                // }),
                                ...(animate === item.product.id && {
                                  animation: 'beat 0.5s ease',
                                  color: 'red',
                                  stroke: 'white',
                                }),
                              },
                              '@keyframes beat': {
                                '0%': {
                                  transform: 'scale(1)',
                                },
                                '50%': {
                                  transform: 'scale(1.25)',
                                },
                                '100%': {
                                  transform: 'scale(1)',
                                },
                              },
                            }}
                          >
                            <Iconify icon="eva:heart-fill" width={24} />
                          </Box>
                          {/* {product.newLabel?.enabled && (
                          <Chip
                            label={product.newLabel.content}
                            color="primary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              fontWeight: 'bold',
                            }}
                          />
                        )}
                        {product.saleLabel?.enabled && (
                          <Chip
                            label={product.saleLabel.content}
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              fontWeight: 'bold',
                            }}
                          />
                        )} */}
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.product.category.name}
                          </Typography>
                          <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3, fontSize: '1rem' }}>
                            {item.product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={item.product.review_overview.average_rating} size="small" readOnly sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              ({item.product.review_overview.total_reviews})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                              {formatPrice(item.product.price)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
                            {0} sold
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Button variant="outlined" onClick={(event) => handleAddToCart(event, item.product as WishlistProduct)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Iconify icon="eva:shopping-cart-outline" width={20} />
                              Add to cart
                            </Button>

                            <Button variant="contained" onClick={() => handleProductClick(item.product.id)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Iconify icon="eva:eye-outline" width={20} />
                              view product
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>


                {/* {totalPages > 1 && (
               
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )} */}

                {/* View more products */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                  <Button variant="outlined" onClick={() => router.push(paths.user.products.root)}>
                    View more products
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  No products found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      }
    </Container>
  );
}
