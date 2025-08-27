'use client';

import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useAuthToken } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';

import { getProductById } from 'src/api/product';
import { IProductAPIResponse } from 'src/types/product';
import ProductUpdateForm from '../product-update-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductEditView({ id }: Props) {
  const settings = useSettingsContext();
  const token = useAuthToken();
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentProduct, setCurrentProduct] = useState<IProductAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getProductById(id, token);
        setCurrentProduct(response.data.product);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, enqueueSnackbar]);

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
        heading="Edit Product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
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

      <ProductUpdateForm productId={id} currentProduct={currentProduct} />
    </Container>
  );
}
