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

import { IProductReviewNewForm, IUploadReviewImage } from 'src/types/product';
import { useParams } from 'next/navigation';
import { addReview } from 'src/api/reviews';
import { useAuthToken } from 'src/auth/hooks';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onClose: VoidFunction;
}

export default function ProductReviewNewForm({ onClose, ...other }: Props) {
  const token = useAuthToken();
  const param = useParams();
  const productId = param.id as string;

  const ReviewSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    rating: Yup.number()
      .min(1, 'Rating must be greater than or equal to 1')
      .required('Rating is required'),
    review: Yup.string().required('Review is required'),
    images: Yup.array().nullable(),
  });

  const defaultValues = {
    title: '',
    rating: 0,
    review: '',
    images: [],
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const reviewData: IProductReviewNewForm = {
        title: data.title,
        rating_description: data.review,
        rating: data.rating,
      };

        if (values.images) {
          const reviewImageData: IUploadReviewImage = {
            file: values.images,
          };
          await addReview(productId, reviewImageData, reviewData, token);
        }
      
      reset();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
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
            <Typography variant="subtitle2" fontWeight="medium">
              Title
            </Typography>
            <RHFTextField name="title" rows={3} sx={{}} />
          </Box>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              Review
            </Typography>
            <RHFTextField name="review" multiline rows={3} sx={{}} />
          </Box>

          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              Review Image (Optional)
            </Typography>

            <RHFUpload
              multiple
              thumbnail
              name="images"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            component={Button}
            disabled={isSubmitting}
          >
            Post
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
