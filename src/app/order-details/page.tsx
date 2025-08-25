'use client';

import React from 'react';
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
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

// Import Product.json data
import productData from '../../../Product.json';

// ----------------------------------------------------------------------

// Custom styled components for icons
const IconWrapper = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'currentColor',
}));

const MessageIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 6,
          left: 4,
        },
      }}
    />
  </IconWrapper>
);

const CheckIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 6,
          height: 3,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderRight: 'none',
          transform: 'rotate(-45deg)',
          top: 4,
          left: 3,
        },
      }}
    />
  </IconWrapper>
);

const PackageIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: 1,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 2,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 4px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const TruckIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: 1,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 12,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 4,
          height: 4,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 4px 0',
          top: 4,
          left: 4,
        },
      }}
    />
  </IconWrapper>
);

const HomeIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '2px 2px 0 0',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const MapPinIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 6,
          height: 6,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 6px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const MailIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: 1,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 6,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const PhoneIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const HelpIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const HeadphonesIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const EyeIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

const RotateIcon = () => (
  <IconWrapper>
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderRadius: '50%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 8,
          height: 8,
          border: '2px solid currentColor',
          borderTop: 'none',
          borderLeft: 'none',
          borderRadius: '0 0 8px 0',
          top: 2,
          left: 2,
        },
      }}
    />
  </IconWrapper>
);

// ----------------------------------------------------------------------

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  originalPrice: number;
  metal: string;
}

interface TimelineStep {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
  icon: React.ReactNode;
}

// ----------------------------------------------------------------------

const OrderDetails = () => {
  const theme = useTheme();

  // Use Product.json data for order items
  const orderItems: OrderItem[] = [
    {
      id: productData[0].id,
      name: productData[0].name,
      description: productData[0].subDescription,
      price: productData[0].price,
      originalPrice: productData[0].priceSale || productData[0].price,
      quantity: 1,
      image: productData[0].coverUrl,
      metal: productData[0].category,
    },
    {
      id: productData[1].id,
      name: productData[1].name,
      description: productData[1].subDescription,
      price: productData[1].price,
      originalPrice: productData[1].priceSale || productData[1].price,
      quantity: 2,
      image: productData[1].coverUrl,
      metal: productData[1].category,
    },
    {
      id: productData[2].id,
      name: productData[2].name,
      description: productData[2].subDescription,
      price: productData[2].price,
      originalPrice: productData[2].priceSale || productData[2].price,
      quantity: 1,
      image: productData[2].coverUrl,
      metal: productData[2].category,
    },
  ];

  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      title: 'Order Placed',
      date: 'June 20',
      status: 'completed',
      icon: <Iconify icon="eva:shopping-cart-outline" />,
    },
    {
      id: '2',
      title: 'Confirmed',
      date: 'June 20',
      status: 'completed',
      icon: <Iconify icon="ant-design:check-circle-outlined" />,
    },
    {
      id: '3',
      title: 'Packed',
      date: 'June 21',
      status: 'completed',
      icon: <Iconify icon="ant-design:border-outlined" />,
    },
    {
      id: '4',
      title: 'Shipped',
      date: 'June 22',
      status: 'completed',
      icon: <Iconify icon="eva:shopping-bag-outline" />,
    },
    {
      id: '5',
      title: 'Out for Delivery',
      date: 'June 24',
      status: 'completed',
      icon: <Iconify icon="ant-design:truck-outlined" />,
    },
    {
      id: '6',
      title: 'Delivered',
      date: 'June 25',
      status: 'completed',
      icon: <Iconify icon="eva:home-outline" />,
    },
  ];

  const orderTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
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
            The pieces you&apos;ve chosen are more than just jewelry, they&apos;re moments waiting to be lived.
            Finalize your selection and let your story shine in lumière.
          </Typography>
        </Container>
      </Box>

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Grid container spacing={4} alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
                  Order Details
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Order ID: #VDP-29834 • Placed on June 20, 2025
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:download-outline" />}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    Download Invoice
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:message-circle-outline" />}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    Contact Support
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Stack spacing={6}>
            {/* Order Summary Card */}
            <OrderSummary
              orderTotal={orderTotal}
              orderStatus="Delivered"
              paymentMethod="VISA **** 3284"
              shippingMethod="Express / Insured Courier"
              estimatedDelivery="June 25, 2025"
              actualDelivery="June 25, 2025"
            />

            {/* Order Tracking Timeline */}
            <OrderTracking timelineSteps={timelineSteps} />

            {/* Items in Order */}
            <OrderItems orderItems={orderItems} />

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
                            Sarah Johnson
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            242 Preston Rd,<br />
                            Wynnum West QLD 4178,<br />
                            Australia.
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
                  Our customer support team is here to assist you with any questions about your order.
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
    </Box>
  );
};

// ----------------------------------------------------------------------

interface OrderSummaryProps {
  orderTotal: number;
  orderStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  estimatedDelivery: string;
  actualDelivery: string;
}

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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography color="text.secondary">Order Total</Typography>
                <Typography fontWeight="medium">{formatPrice(orderTotal)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography color="text.secondary">Payment Method</Typography>
                <Typography>{paymentMethod}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography color="text.secondary">Order Status</Typography>
                <Chip
                  label={orderStatus}
                  color="success"
                  size="small"
                  icon={<Iconify icon="ant-design:check-circle-outlined" />}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography color="text.secondary">Shipping Method</Typography>
                <Typography>{shippingMethod}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography color="text.secondary">Estimated Delivery</Typography>
                <Typography>{estimatedDelivery}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography color="text.secondary">Actual Delivery</Typography>
                <Chip
                  label={actualDelivery}
                  color="success"
                  size="small"
                  icon={<Iconify icon="ant-design:check-circle-outlined" />}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

const OrderTracking = ({ timelineSteps }: { timelineSteps: TimelineStep[] }) => {
  return (
    <Card>
      <CardHeader title="Order Tracking" />
      <CardContent>
        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            {timelineSteps.map((step, index) => (
              <Grid item key={step.id} xs={12} sm={2}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: step.status === 'completed' ? 'success.main' : 'grey.300',
                      color: step.status === 'completed' ? 'white' : 'text.secondary',
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
                    fontWeight="medium"
                    color={step.status === 'completed' ? 'text.primary' : 'text.secondary'}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.date}
                  </Typography>
                  {index < timelineSteps.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        left: '50%',
                        width: '100%',
                        height: 2,
                        bgcolor: step.status === 'completed' ? 'success.main' : 'grey.300',
                        zIndex: 0,
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

const OrderItems = ({ orderItems }: { orderItems: OrderItem[] }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card>
      <CardHeader title="Items in this Order" />
      <CardContent>
        <Stack spacing={3}>
          {orderItems.map((item) => (
            <Card key={item.id} sx={{ p: 3, '&:hover': { boxShadow: 2 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontFamily: 'serif' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
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
                              {formatPrice(item.originalPrice)}
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Iconify icon="ant-design:undo-outline" sx={{ rotate: '90deg' }} />}
                        sx={{ textTransform: 'none' }}
                      >
                        Request Return
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Iconify icon="eva:eye-outline" />}
                        sx={{ textTransform: 'none' }}
                      >
                        View Product
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;

