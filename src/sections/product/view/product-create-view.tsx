'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductNewEditForm from '../product-new-edit-form';
import { useEffect, useState } from 'react';
import { IProductAPIResponse } from 'src/types/product';
import { getProductById } from 'src/api/product';
import { enqueueSnackbar } from 'notistack';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthToken } from 'src/auth/hooks';
import { useParams } from 'next/navigation';

// ----------------------------------------------------------------------

export default function ProductCreateView() {
  const settings = useSettingsContext();
  const token = useAuthToken();
  const [currentProduct, setCurrentProduct] = useState<IProductAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const param = useParams();
  const productId = param.id

    useEffect(() => {
      const fetchProduct = async () => {
        if (!token) {
          setError('Authentication required');
          setIsLoading(false);
          return;
        }
  
        try {
           if (typeof productId === 'string'){
          setIsLoading(true);
          const response = await getProductById(productId, token);
          setCurrentProduct(response.data.product);
           }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
          setError(errorMessage);
          enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchProduct();
    }, [productId, token, enqueueSnackbar]);
  
    if (isLoading) {
      return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      );
    }
  
    if (error || !currentProduct) {
      return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Typography variant="h6" color="error">
              {error || 'Product not found'}
            </Typography>
          </Box>
        </Container>
      );
    }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Product',
            href: paths.dashboard.product.root,
          },
          { name: currentProduct.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm />
    </Container>
  );
}
