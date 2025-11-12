'use client';

import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { SeoIllustration } from 'src/assets/illustrations';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { _orders, _appFeatured, _appInvoices, _ecommerceLatestProducts } from 'src/_mock';
import {
  useGetDashboardAnalyticsUser,
  useGetDashboardAnalyticsOrders,
  useGetDashboardAnalyticsRevenue,
  useGetDashboardAnalyticsOrderCategory,
} from 'src/api/analytics';
import { useSettingsContext } from 'src/components/settings';

import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import EcommerceLatestOrders from '../../e-commerce/ecommerce-latest-orders';
import EcommerceCurrentBalance from '../../e-commerce/ecommerce-current-balance';
import EcommerceLatestProducts from '../../e-commerce/ecommerce-latest-products';
import EcommerceLatestInvoices from '../../e-commerce/ecommerce-latest-invoices';
import { Order } from 'src/types/analytics';
import { useSearchOrders } from 'src/api/order';
import { useGetProducts } from 'src/api/product';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const calculatePercentage = (current: number, previous: number) => {
  if (previous === 0) {
    return 0;
  } else {
    return ((current - previous) / previous) * 100 || 0;
  }
};

const orderSummaryCart = (orderCategory: any) =>
  orderCategory.categories?.map((category: any) => ({
    label: category.category.name,
    value: category.order_count,
  }));

export default function OverviewAppView() {
  const { user } = useAuthContext();

  const theme = useTheme();

  const settings = useSettingsContext();
  const [orderSummaryCartData, setOrderSummaryCartData] = useState<any[]>([]);

  const { users } = useGetDashboardAnalyticsUser(user?.accessToken as string);
  const { orderCategory, orderCategoryLoading } = useGetDashboardAnalyticsOrderCategory(
    user?.accessToken as string
  );
  const { orders } = useGetDashboardAnalyticsOrders(user?.accessToken as string);
  const { revenue } = useGetDashboardAnalyticsRevenue(user?.accessToken as string);
  const userPercentage = calculatePercentage(
    users?.current_month?.users_registered,
    users?.previous_month?.users_registered
  );
  const orderPercentage = calculatePercentage(
    orders?.current_month?.orders_count,
    orders?.previous_month?.orders_count
  );
  const revenuePercentage = calculatePercentage(
    orders?.current_month?.total_revenue,
    orders?.previous_month?.total_revenue
  );
  const { searchOrders } = useSearchOrders({ sort_by: 'created_at', sort_order: 'desc' });
  const { products } = useGetProducts({
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  useEffect(() => {
    if (!orderCategoryLoading && orderCategory) {
      const data = orderSummaryCart(orderCategory);
      setOrderSummaryCartData(data);
    }
  }, [orderCategory, orderCategoryLoading]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.first_name} ${user?.last_name}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Monthly Orders"
            percent={orderPercentage}
            total={orders?.current_month?.orders_count || '0'}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Revenue"
            percent={revenuePercentage}
            total={orders?.current_month?.total_revenue || '0'}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="New users this month"
            percent={userPercentage}
            total={users?.current_month?.users_registered || '0'}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Order summary"
            chart={{
              series: orderSummaryCartData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Order Places"
            subheader={`(+${orderPercentage}%) than last year`}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestOrders
            id="demo__5"
            title="Latest Orders"
            list={searchOrders.slice(0, 5) as any}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts
            id="demo__5"
            title="Latest Products"
            list={products.slice(0, 5)}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <EcommerceLatestInvoices id="demo__5" title="Invoices" />
            <EcommerceCurrentBalance
              title="Monthly Revenue"
              currentBalance={revenue?.total_revenue}
              sentAmount={revenue?.returned_orders_revenue}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
