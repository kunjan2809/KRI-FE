import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';

import { uploadReviewImage } from 'src/api/product';
import { IProductReviewNewForm, IUploadReviewImage } from 'src/types/product';
import { useParams } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onClose: VoidFunction;
}

export default function ProductReviewNewForm({ onClose, ...other }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { productId } = useParams();
  const { user } = useAuthContext();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.number().min(1, 'Rating must be greater than or equal to 1').required('Rating is required'),
    review: Yup.string().required('Review is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    image: Yup.mixed().nullable(),
  });

  const defaultValues = {
    rating: 0,
    review: '',
    name: '',
    email: '',
    image: null,
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedImage = watch('image');

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Generate a temporary review ID for image upload
      const reviewId = `temp_${Date.now()}`;

      // Upload image if file is selected
      if (selectedFile) {
        const reviewImageData: IUploadReviewImage = {
          review_id: reviewId,
          file: selectedFile,
        };

        // Note: In a real application, you would need to get the token from auth context
        // For now, we'll simulate the upload
        console.log('Review image data:', reviewImageData);
        // await uploadReviewImage(reviewId, reviewImageData, user?.accessToken);
      }
      const reviewData: IProductReviewNewForm = {
        rating: data.rating,
        rating_description: data.review,
        product_id: productId as string,
        user_id: user?.id as string,
      };

      console.log('Review data:', reviewData);

      // await createProductReview(reviewData, user?.accessToken);

      reset();
      setSelectedFile(null);
      onClose();

    } catch (error) {
      console.error(error);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
    setSelectedFile(null);
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other} fullWidth maxWidth="sm">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Add Review </DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
            <Typography variant="body2">Your review about this product:</Typography>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  {...field}
                  size="small"
                  value={Number(field.value)}
                  onChange={(event, newValue) => {
                    field.onChange(newValue as number);
                  }}
                />
              )}
            />
          </Stack>

          {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}

          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="medium" >
              Review
            </Typography>
            <RHFTextField name="review" multiline rows={3} sx={{}} />
          </Box>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="medium" >
              Name
            </Typography>
            <RHFTextField name="name" rows={3} sx={{}} />
          </Box>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="medium" >
              Email
            </Typography>
            <RHFTextField name="email" rows={3} sx={{}} />
          </Box>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="medium" >
              Review Image (Optional)
            </Typography>
            <RHFUpload
              name="image"
              multiple={false}
              thumbnail
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              helperText="Upload an image to accompany your review (max 3MB)"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" component={Button} disabled={isSubmitting}>
            Post
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
