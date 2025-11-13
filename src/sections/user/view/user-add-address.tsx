import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useAuthToken } from 'src/auth/hooks';
import { addAddress, editAddress, updateUserInfo } from 'src/api/user';
import { enqueueSnackbar } from 'notistack';
import { AddAddress, UserAddress } from 'src/types/user';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: VoidFunction;
  currentAddress?: UserAddress | null;
  onSuccess: VoidFunction;
}

const AddressFormDialog = ({ open, onClose, currentAddress, onSuccess }: Props) => {
  const token = useAuthToken();
  const phoneReg = /^\+[1-9]\d{7,14}$/

  const AddressSchema = Yup.object().shape({
    full_name: Yup.string().required('Full name is required'),
    mobile_number: Yup.string().required('Phone number is required') .matches(phoneReg, "Phone number is not valid"),
    address_line_1: Yup.string().required('Address line 1 is required'),
    address_line_2: Yup.string().optional(),
    landmark: Yup.string().optional(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postal_code: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
  });

  const defaultValues = {
    full_name: currentAddress?.full_name || '',
    mobile_number: currentAddress?.mobile_number || '',
    address_line_1: currentAddress?.address_line_1 || '',
    address_line_2: currentAddress?.address_line_2 || '',
    landmark: currentAddress?.landmark || '',
    city: currentAddress?.city || '',
    state: currentAddress?.state || '',
    postal_code: currentAddress?.postal_code || '',
    country: currentAddress?.country || '',
  };

  const methods = useForm({
    resolver: yupResolver(AddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const addAddressData = {
        full_name: data.full_name,
        mobile_number: data.mobile_number,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        landmark: data?.landmark,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        is_default: false,
      };
      if (currentAddress?._id) {
        await editAddress(currentAddress._id, addAddressData, token);
      } else {
        await addAddress({ ...data, is_default: false }, token);
        enqueueSnackbar('Address added successfully', { variant: 'success' });
      }

      reset();
      onClose();
      onSuccess();
    } catch (error) {
      enqueueSnackbar('Failed to save address', { variant: 'error' });
    }
  });

  const handleCancel = () => {
    if (!currentAddress) {
      reset();
    }
    onClose();
  };

  useEffect(() => {
    setValue('full_name', currentAddress ? currentAddress?.full_name : '');
    setValue('mobile_number', currentAddress ? currentAddress?.mobile_number : '');
    setValue('address_line_1', currentAddress ? currentAddress?.address_line_1 : '');
    setValue('address_line_2', currentAddress ? currentAddress?.address_line_2 : '');
    setValue('landmark', currentAddress ? currentAddress?.landmark : '');
    setValue('city', currentAddress ? currentAddress?.city : '');
    setValue('state', currentAddress ? currentAddress?.state : '');
    setValue('postal_code', currentAddress ? currentAddress?.postal_code : '');
    setValue('country', currentAddress ? currentAddress?.country : '');
  }, [currentAddress]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <RHFTextField value={values.full_name} name="full_name" label="Full Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="mobile_number"
                value={values.mobile_number}
                label="Phone Number"
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="address_line_1"
                value={values.address_line_1}
                label="Address Line 1"
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="address_line_2"
                value={values.address_line_2}
                label="Address Line 2 (optional)"
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="landmark" value={values.landmark} label="Landmark (optional)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="city" value={values.city} label="City" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="state" value={values.state} label="State / Province" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="postal_code" value={values.postal_code} label="Postal Code" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="country" value={values.country} label="Country" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined" color="inherit">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained">
            {currentAddress ? 'Save Changes' : 'Add Address'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default AddressFormDialog;
