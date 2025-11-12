'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Chip,
  Divider,
  Avatar,
  useTheme,
  Skeleton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

// Import Product.json data
import { useGetOrderDetail } from 'src/api/order';
import { IOrderDetailItem, Order } from 'src/types/order';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
import { OrderDetailSkeleton } from 'src/sections/order/order-detail-skeleton';
import OrderReturnRequestForm from 'src/sections/order/order-return-request-view';

// ----------------------------------------------------------------------
const statusOrder = ['pending', 'shipped', 'delivered', 'return'];

// ----------------------------------------------------------------------

interface OrderSummaryProps {
  orderTotal: number;
  orderStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  estimatedDelivery: string;
  actualDelivery: string;
}

interface TimelineStep {
  id: string;
  title: string;
  status: 'pending' | 'shipped' | 'delivered' | 'return';
  icon: React.ReactNode;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ----------------------------------------------------------------------

const OrderDetails = () => {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      title: 'Order Placed',
      status: 'pending',
      icon: <Iconify icon="eva:shopping-cart-outline" />,
    },

    {
      id: '2',
      title: 'Shipped',
      status: 'shipped',
      icon: <Iconify icon="eva:shopping-bag-outline" />,
    },
    {
      id: '3',
      title: 'Delivered',
      status: 'delivered',
      icon: <Iconify icon="eva:home-outline" />,
    },

    {
      id: '4',
      title: 'Return',
      status: 'return',
      icon: <Iconify icon="tabler:truck-return" />,
    },
  ];

  const { orderDetail, orderDetailError } = useGetOrderDetail(orderId);

  if (orderDetailError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Order not found</Typography>
        <Button
          variant="contained"
          onClick={() => router.push(paths.user.orders.root)}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

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
            A Chapter Almost Complete
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            The pieces you&apos;ve chosen are more than just jewelry, they&apos;re moments waiting
            to be lived. Finalize your selection and let your story shine in lumière.
          </Typography>
        </Container>
      </Box>

      {!orderDetail ? (
        <OrderDetailSkeleton />
      ) : (
        <div className="min-h-screen bg-white">
          {/* Header Section */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg" sx={{ py: 8 }}>
              <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{ fontWeight: 'bold', fontFamily: 'serif' }}
                  >
                    Order Details
                  </Typography>

                  {!orderDetail.order ? (
                    <>
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                      Order ID: {orderDetail.order.order_number} • Placed on{' '}
                      {formatDate(orderDetail.order.created_at)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Stack spacing={6}>
              {/* Order Summary Card */}

              <OrderSummary
                orderTotal={orderDetail.order.total_amount}
                orderStatus={orderDetail.order.order_status}
                paymentMethod={orderDetail.order.payment_status}
                shippingMethod="Express / Insured Courier"
                estimatedDelivery="June 25, 2025"
                actualDelivery={orderDetail.order.delivered_at || 'June 25, 2025'}
              />

              {/* Order Tracking Timeline */}
              <OrderTracking timelineSteps={timelineSteps} order={orderDetail.order} />

              {/* Items in Order */}
              <OrderItems
                orderItems={orderDetail.order_items}
                orderStatus={orderDetail.order.order_status}
              />
              {/* Delivery & Contact Info */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Delivery Information" />
                    <CardContent>
                      <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Iconify icon="ant-design:environment-outline" />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {orderDetail.order.shipping_address_id.full_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {orderDetail.order.shipping_address_id.address_line_1}
                              <br />
                              {orderDetail.order.shipping_address_id.address_line_2}
                              <br />
                              {orderDetail.order.shipping_address_id.city}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Contact Information" />
                    <CardContent>
                      <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Iconify icon="eva:email-outline" />
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            wynnum@actionindoorsportsqld.com.au
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Iconify icon="eva:phone-outline" />
                          <Typography variant="body2">+61733088011</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* Support Section */}
              <Card sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                <CardContent sx={{ pt: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Iconify icon="eva:question-mark-circle-outline" />
                    <Typography variant="h5" fontWeight="medium">
                      Need Help?
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Our customer support team is here to assist you with any questions about your
                    order.
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="eva:headphones-outline" />}
                      sx={{ px: 3, py: 1.5 }}
                    >
                      Contact Support
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:message-circle-outline" />}
                      sx={{ px: 3, py: 1.5 }}
                    >
                      Request Assistance
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        </div>
      )}
    </Box>
  );
};

// ----------------------------------------------------------------------

const OrderSummary = ({
  orderTotal,
  orderStatus,
  paymentMethod,
  shippingMethod,
  estimatedDelivery,
  actualDelivery,
}: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card>
      <CardHeader title="Order Summary" />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">Order Total</Typography>
                <Typography fontWeight="medium">{formatPrice(orderTotal)}</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">Payment Method</Typography>
                <Typography>{paymentMethod.toUpperCase()}</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">Order Status</Typography>
                <Chip
                  label={orderStatus}
                  color={
                    (orderStatus === 'delivered' && 'success') ||
                    (orderStatus === 'pending' && 'warning') ||
                    (orderStatus === 'cancelled' && 'error') ||
                    (orderStatus === 'shipped' && 'info') ||
                    (orderStatus === 'return' && 'secondary') ||
                    'default'
                  }
                  size="small"
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">Shipping Method</Typography>
                <Typography>{shippingMethod}</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">Estimated Delivery</Typography>
                <Typography>{estimatedDelivery}</Typography>
              </Box>
              <Divider />
              {orderStatus === 'shipped' && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                  }}
                >
                  <Typography color="text.secondary">Actual Delivery</Typography>
                  <Chip
                    label={actualDelivery}
                    color="success"
                    size="small"
                    icon={<Iconify icon="ant-design:check-circle-outlined" />}
                  />
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

const OrderTracking = ({
  timelineSteps,
  order,
}: {
  timelineSteps: TimelineStep[];
  order: Order;
}) => {
  const currentStepIndex = statusOrder.indexOf(order.order_status);
  const isReturn = order.order_status === 'return';
  const orderTrakingLine = timelineSteps.length - (isReturn ? 1 : 2);

  const timeLine = isReturn ? timelineSteps : timelineSteps.slice(0, -1);

  return (
    <Card>
      <CardHeader title="Order Tracking" />
      <CardContent>
        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={2} justifyContent="start">
            {timeLine.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;
              return (
                <Grid item key={step.id} xs={12} sm={isReturn ? 3 : 4} sx={{ height: '100%' }}>
                  <Box sx={{ textAlign: 'center', position: 'relative' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: isCompleted ? 'success.main' : 'grey.300',
                        color: isCompleted ? 'white' : 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        zIndex: 10,
                        position: 'relative',
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight={isActive ? 'bold' : 'medium'}
                      color={isCompleted ? 'text.primary' : 'text.secondary'}
                    >
                      {step.title}
                    </Typography>
                    {isActive && (
                      <Typography variant="caption" color="success.main">
                        {order.order_status === 'delivered'
                          ? 'Delivered Successfully'
                          : !isReturn && 'In Progress'}
                      </Typography>
                    )}
                    {index < orderTrakingLine && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 20,
                          left: '50%',
                          width: '100%',
                          height: 2,
                          bgcolor: isCompleted ? 'success.main' : 'grey.300',
                          zIndex: 0,
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

const OrderItems = ({
  orderItems,
  orderStatus,
}: {
  orderItems: IOrderDetailItem[];
  orderStatus: string;
}) => {
  const router = useRouter();

  const [isOrderReturn, setIsOrderReturn] = useState<boolean>(false);
  const [orderItemId, setOrderItemId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleProductClick = (productId: string) => {
    router.push(paths.user.products.details(productId));
  };

  return (
    <>
      <Card>
        <CardHeader title="Items in this Order" />
        <CardContent>
          <Stack spacing={3}>
            {orderItems.map((item) => {
              return (
                <Card key={item._id} sx={{ p: 3, '&:hover': { boxShadow: 2 } }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={item.primary_image.image_url}
                        alt={item.product_id.name}
                        sx={{
                          width: '100%',
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{ mb: 1, fontFamily: 'serif' }}
                          >
                            {item.product_id.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {item.product_id.description}
                          </Typography>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <Typography variant="body2" color="text.secondary">
                                Quantity: {item.quantity}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body2" color="text.secondary">
                                Price: {formatPrice(item.price)}{' '}
                                <Box
                                  component="span"
                                  sx={{
                                    textDecoration: 'line-through',
                                    fontSize: '0.75rem',
                                    color: 'text.disabled',
                                  }}
                                >
                                  {formatPrice(item.mrp)}
                                </Box>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                          {orderStatus === 'delivered' && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={
                                <Iconify icon="ant-design:undo-outline" sx={{ rotate: '90deg' }} />
                              }
                              sx={{ textTransform: 'none' }}
                              onClick={() => {
                                (setOrderId(item.order_id),
                                  setOrderItemId(item._id),
                                  setIsOrderReturn(true));
                              }}
                            >
                              Request Return
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Iconify icon="eva:eye-outline" />}
                            sx={{ textTransform: 'none' }}
                            onClick={() => handleProductClick(item.product_id._id)}
                          >
                            View Product
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
      {orderItemId && orderId && (
        <OrderReturnRequestForm
          orderId={orderId}
          orderItemId={orderItemId}
          open={isOrderReturn}
          onClose={() => setIsOrderReturn(false)}
        />
      )}
    </>
  );
};

export default OrderDetails;
