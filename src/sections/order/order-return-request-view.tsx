import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAuthToken } from 'src/auth/hooks';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import { createReturnRequest } from 'src/api/order';
import { enqueueSnackbar } from 'notistack';

interface Props {
  open: boolean;
  onClose: VoidFunction;
  orderId: string;
  orderItemId: string;
}

interface ReturnRequest {
  reason: string;
  return_type: string;
  notes: string;
}

const RETURN_ORDER_TYPE_OPTIONS = [
  { value: 'Damaged', label: 'Damaged' },
  { value: 'Wrong item', label: 'Wrong item' },
  { value: 'Size issue', label: 'Size issue' },
  { value: 'Quality issue', label: 'Quality issue' },
  { value: 'Not as described', label: 'Not as described' },
  { value: 'Received late', label: 'Received late' },
  { value: 'Changed mind', label: 'Changed mind' },
  { value: 'Other', label: 'Other' },
];

const OrderReturnRequestForm = ({ open, onClose, orderId, orderItemId }: Props) => {
  const token = useAuthToken();

  const requestSchema = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
    return_type: Yup.string().required('Please select an option'),
    notes: Yup.string().required('Notes is required'),
  });

  const defaultValues: ReturnRequest = {
    reason: '',
    return_type: '',
    notes: '',
  };

  const methods = useForm({
    resolver: yupResolver(requestSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const returnRequestPayload = {
        order_item_id: orderItemId,
        reason: data.reason,
        return_type: data.return_type,
        notes: data.notes,
      };
      await createReturnRequest(orderId, returnRequestPayload, token);
      reset();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to return order';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  });

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleReturnRequest = (value: string) => {
    setValue(`return_type`, value);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          Return Request
          <IconButton onClick={handleCancel} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
          <Box sx={{ fontSize: '14px', fontWeight: 'normal' }}>
            Not happy with the product? Fill out the form below to request a order return.
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" fontWeight="medium">
                Reason
              </Typography>
              <RHFTextField
                placeholder="Enter a reason"
                value={values.reason}
                type="text"
                name="reason"
              />
            </Box>

            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" fontWeight="medium">
                Reason Type
              </Typography>
              <RHFSelect
                native
                name="return_type"
                onChange={(e) => handleReturnRequest(e.target.value)}
              >
                {RETURN_ORDER_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" fontWeight="medium">
                Notes
              </Typography>
              <RHFTextField
                placeholder="Enter a notes"
                value={values.notes}
                type="text"
                name="notes"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <Iconify icon="eos-icons:loading" /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default OrderReturnRequestForm;
