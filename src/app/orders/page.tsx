
'use client';

import { useState, useEffect } from 'react';

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
  Chip,
  Pagination,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

import { useAuthToken } from 'src/auth/hooks';
import { getUserAllOrders } from 'src/api/order';

import { OrderListSkeleton, } from 'src/sections/product/product-skeleton';


import { OrderPagination, UserOrders } from 'src/types/order';
import { fDate } from 'src/utils/format-time';


export default function CartPage() {

  const token = useAuthToken()
  const router = useRouter();


  const [orderData, setOrderData] = useState<UserOrders[]>([])
  const [pagenation, setPagenation] = useState<OrderPagination | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isOrderDataLoading, setIsOrderDataLoading] = useState(true)



  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  const fetchOrder = async () => {
    setIsOrderDataLoading(true)
    try {
      const response = await getUserAllOrders(token)
      if (response.success) {
        setOrderData(response.data.orders)
        setPagenation(response.data.pagination)
        setIsOrderDataLoading(false)
      }
    } catch (error) {
      console.log('somthing went wrong', error)
    } finally {
      setIsOrderDataLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentPage])

  if (orderData.length === 0 && !isOrderDataLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
          Your Orders List is Empty
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
            Your Orders List
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Review your orders list.
          </Typography>
          {isOrderDataLoading ? <OrderListSkeleton /> :
            <Grid container spacing={4} sx={{ mt: 4 }}>
              {/* <Grid item xs={12} sm={12} md={12} lg={6} gap={2}> */}
              {orderData.map((item, index) => {
                const { order_number, _id, created_at, order_status, total_amount, delivered_at } = item
                return (
                  <Grid item xs={12} sm={12} md={12} lg={6} gap={2}>
                    <Card key={_id} sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', cursor: 'pointer' }} onClick={() => router.push(paths.user.orders.details(_id))}>
                      <Grid container spacing={3}>
                        {/* <Grid item xs={12} sm={3}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={item.product.primary_image?.image_url}
                          alt={item.product.name}
                          sx={{ objectFit: 'cover', borderRadius: 1 }}
                        />
                      </Grid> */}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                                  {order_number}
                                </Typography>
                                {order_status === "delivered" ? (
                                  <Chip
                                    label={order_status}
                                    color='success'
                                    size="small"
                                    icon={<Iconify icon="ant-design:check-circle-outlined" sx={{ width: 16 }} />}
                                  />
                                ) : (
                                  <Chip
                                    label={order_status}
                                    color={
                                      (order_status === 'shipped' && 'info') ||
                                      (order_status === 'pending' && 'warning') ||
                                      (order_status === 'cancelled' && 'error') ||
                                      (order_status === 'delivered' && 'success') ||
                                      (order_status === 'return' && 'secondary') ||
                                      'default'
                                    }
                                    size="small"
                                    icon={<Iconify icon="ant-design:clock-circle-outlined" sx={{ width: 16 }} />}
                                  />
                                )}
                              </Box>
                              {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.order_items}
                            </Typography> */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Order Placed On :</Typography>
                                <Typography variant="body2" >{fDate(created_at)}</Typography>
                              </Box>
                              {delivered_at && order_status === "delivered" ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary">Order Delivered On :</Typography>
                                  <Typography variant="body2" >{fDate(delivered_at)}</Typography>
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary">Order Tracking :</Typography>
                                  <Typography variant="body2" >{order_status}</Typography>
                                </Box>
                              )}

                              {/* Price */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">Order Total :</Typography>
                                <Typography fontWeight="medium" color="primary.main">{formatPrice(total_amount)}</Typography>
                              </Box>
                              {/* {item.quantity > 1 && (
                              <Typography variant="body2" color="text.secondary">
                                {formatPrice(item.order_items)} each
                              </Typography>
                            )} */}

                              {/* Action Links */}
                              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end' }}>
                                <Button
                                  size="small"
                                  onClick={() => router.push(paths.user.orders.details(_id))}
                                  variant="outlined"
                                >
                                  See Details
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                )
              })}
              {/* </Grid> */}
            </Grid>}
        </Box>
        {pagenation && pagenation!.total_pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagenation?.total_pages}
              page={currentPage}
              onChange={handlePageChange}
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>

    </Box>
  );
}
