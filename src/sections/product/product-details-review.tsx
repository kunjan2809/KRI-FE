import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import ProductReviewList from './product-review-list';
import ProductReviewNewForm from './product-review-new-form';
import { useParams } from 'next/navigation';
import { useAuthToken } from 'src/auth/hooks';
import { useEffect, useState } from 'react';
import { Reviews } from 'src/types/reviews';
import { getReviewDetail } from 'src/api/reviews';
import { enqueueSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import LoginPopup from 'src/app/landing/loginPopup/AuthPopup';

// ----------------------------------------------------------------------
interface ProductDetailReview {
  getProductDataById: () => Promise<void>;
}

export default function ProductDetailsReview({ getProductDataById }: ProductDetailReview) {
  const { authenticated } = useAuthContext();
  const param = useParams();
  const token = useAuthToken();
  const productId = param.id as string;
  const [productReviews, setProductReviews] = useState<Reviews | null>(null);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [review,setReview] = useState(false);

  const getReviewById = async () => {
    if (productId) {
      try {
        let response = await getReviewDetail(productId, token);
        const { reviews } = response.data ?? {};
        if (reviews) {
          setProductReviews(reviews);
        }
        getProductDataById();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    }
  };
  const handleLoginPopupClose = (): void => {
    setLoginPopupOpen(false);
  };

  useEffect(() => {
    getReviewById();
  }, [productId]);

  const totalRatings =
    (productReviews && Number(productReviews.summary.average_rating.toFixed(1))) || 0;
  const totalReviews = (productReviews && productReviews.summary.total_reviews) || 0;
  const total =
    productReviews &&
    productReviews.summary.rating_distribution.reduce((sum, rating) => sum + rating.count, 0);

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Average rating</Typography>

      <Typography variant="h2">{totalRatings}/5</Typography>

      <Rating readOnly value={totalRatings} precision={0.1} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        ({fShortenNumber(totalReviews)} reviews)
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: (theme) => ({
          md: `dashed 1px ${theme.palette.divider}`,
        }),
        borderRight: (theme) => ({
          md: `dashed 1px ${theme.palette.divider}`,
        }),
      }}
    >
      {[...Array(5)].map((_, index) => {
        const star = 5 - index;
        const rating =
          productReviews && productReviews.summary.rating_distribution.find((r) => r._id === star);
        const count = rating ? rating.count : 0;
        const percentage = total ? (count / total) * 100 : 0;

        return (
          <Stack key={star} direction="row" alignItems="center">
            <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
              {`${star} Star`}
            </Typography>

            <LinearProgress
              color="inherit"
              variant="determinate"
              value={percentage}
              sx={{
                mx: 2,
                flexGrow: 1,
              }}
            />

            <Typography
              variant="body2"
              component="span"
              sx={{
                minWidth: 48,
                color: 'text.secondary',
              }}
            >
              {count}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );

  const renderReviewButton = (
    <Stack alignItems="center" justifyContent="center">
      <Button
        size="large"
        variant="soft"
        color="inherit"
        onClick={() => (!authenticated ? setLoginPopupOpen(true) : setReview(true))}
        startIcon={<Iconify icon="solar:pen-bold" />}
      >
        Write your review
      </Button>
    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{
          py: { xs: 5, md: 0 },
        }}
      >
        {renderSummary}

        {renderProgress}

        {renderReviewButton}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {productReviews && <ProductReviewList reviews={productReviews} />}

      <ProductReviewNewForm
        open={review}
        onClose={() => setReview(false)}
        getReviewById={getReviewById}
      />
      {loginPopupOpen && (
        <LoginPopup
          open={loginPopupOpen}
          onClose={handleLoginPopupClose}
          title="Login"
          description="Please login to give review"
        />
      )}
    </>
  );
}
