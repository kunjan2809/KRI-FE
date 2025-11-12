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
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { changePassword, resetPassword } from 'src/api/user';
import { enqueueSnackbar } from 'notistack';
import { useAuthToken } from 'src/auth/hooks';

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

interface PasswordState {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

const UserChangePassword = ({ open, onClose }: Props) => {
  const token = useAuthToken();
  const [errormsg, setErrormsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<PasswordState>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters long')
      .notOneOf(
        [Yup.ref('currentPassword'), null],
        'New password must be different from current password'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const password = {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      };
      await changePassword(password, token);

      reset();
      onClose();
    } catch (err) {
      if (err.message) {
        setError('currentPassword', { message: err.message });
      }
      console.error('API Error:', err.message);
    }
  });

  const handleCancel = () => {
    setErrormsg(null);
    reset();
    onClose();
  };

  const togglePasswordVisibility = (field: keyof PasswordState) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          Change Password
          <IconButton onClick={handleCancel} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <RHFTextField
              value={values.currentPassword}
              type={showPassword ? 'text' : 'password'}
              name="currentPassword"
              label="Current Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword.currentPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errormsg && (
              <Box component="span" sx={{ color: 'error.main' }}>
                {errormsg}
              </Box>
            )}

            <RHFTextField
              value={values.newPassword}
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              label="New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility('newPassword')} edge="end">
                      <Iconify
                        icon={showPassword.newPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              value={values.confirmPassword}
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              name="confirmPassword"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword.confirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
          {isSubmitting ? 'Changing password' : 'Change Password'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UserChangePassword;
