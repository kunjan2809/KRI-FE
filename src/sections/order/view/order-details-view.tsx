'use client';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';

import { useAuthToken } from 'src/auth/hooks';
import { useGetOrder, updateOrderStatus, updateOrderPaymentStatus } from 'src/api/order';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsHistory from '../order-details-history';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return', label: 'Return' },
];

export default function OrderDetailsView({ id }: Props) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const token = useAuthToken();

  const { order, orderLoading, orderError } = useGetOrder(id);

  const [status, setStatus] = useState(order?.order_status || 'pending');

  const handleChangeStatus = useCallback(async (newValue: string) => {
    if (!token || !order) return;
    
    try {
      await updateOrderStatus(order.id, { order_status: newValue }, token);
      setStatus(newValue);
      enqueueSnackbar('Order status updated successfully!');
    } catch (error) {
      enqueueSnackbar('Failed to update order status', { variant: 'error' });
    }
  }, [token, order, enqueueSnackbar]);

  const handleChangePaymentStatus = useCallback(async (newValue: string) => {
    if (!token || !order) return;
    
    try {
      await updateOrderPaymentStatus(order.id, { payment_status: newValue }, token);
      enqueueSnackbar('Payment status updated successfully!');
    } catch (error) {
      enqueueSnackbar('Failed to update payment status', { variant: 'error' });
    }
  }, [token, order, enqueueSnackbar]);

  if (orderLoading) {
    return <div>Loading...</div>;
  }

  if (orderError || !order) {
    return <div>Error loading order or order not found</div>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={order.order_id}
        createdAt={order.created_at}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order.products}
              taxes={0} // Calculate from order data if needed
              shipping={0} // Calculate from order data if needed
              discount={0} // Calculate from order data if needed
              subTotal={order.total_amount} // Calculate from order data if needed
              totalAmount={order.total_amount}
            />

            <OrderDetailsHistory 
              history={{
                orderTime: order.created_at,
                paymentTime: order.updated_at,
                deliveryTime: order.delivery_info?.delivery_date || order.updated_at,
                completionTime: order.order_status === 'delivered' ? order.updated_at : null,
                timeline: [
                  { title: 'Order created', time: order.created_at },
                  { title: 'Order updated', time: order.updated_at },
                ]
              }} 
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={{
              id: order.customer_id || '',
              name: order.customer_name,
              email: order.customer_email,
              avatarUrl: '', // Add if available
              ipAddress: '', // Add if available
            }}
            delivery={{
              shipBy: 'Standard',
              speedy: 'Standard',
              trackingNumber: order.tracking_number || '',
            }}
            payment={{
              cardType: 'unknown',
              cardNumber: '**** **** **** ****',
            }}
            shippingAddress={{
              fullAddress: `${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}`,
              phoneNumber: order.customer_phone,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
