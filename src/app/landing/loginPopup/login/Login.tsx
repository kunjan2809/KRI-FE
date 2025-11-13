import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { useBoolean } from 'src/hooks/use-boolean';

interface LoginPopupProps {
  open: boolean;
  onClose: () => void;
  isSignup: boolean;
  title?: string;
  description?: string;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEmailVerification: React.Dispatch<React.SetStateAction<boolean>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

interface login {
  email: string;
  password: string;
}
const Login = ({
  open,
  onClose,
  setIsSignup,
  setIsEmailVerification,
  setUserEmail,
  isSignup,
  title,
  description,
}: LoginPopupProps) => {
  const theme = useTheme();
  const { login } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<login>({
    resolver: yupResolver(LoginSchema),
    defaultValues: defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {

    try {
      await login?.(data.email, data.password);
      onClose();
      reset();
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleClose = () => {
    onClose();
    reset();
    setErrorMsg('');
    setIsSignup(false);
    setIsEmailVerification(false);
    setUserEmail('');
  };

  const handleToggleMode = () => {
    reset();
    setErrorMsg('');
    setIsSignup(!isSignup);
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      console.log(`${provider} login initiated`);
      // Here you would typically integrate with your authentication provider
      // For example, using Firebase Auth, Auth0, or your own OAuth implementation

      // Example implementation:
      // if (provider === 'google') {
      //     await signInWithGoogle();
      // } else if (provider === 'apple') {
      //     await signInWithApple();
      // }

      // For now, just close the modal and show success
      onClose();
      reset();
      setErrorMsg('');
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setErrorMsg(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack>
        <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
          {title ? title : 'Hi, Welcome back'}
        </Typography>
        {description && (
          <Typography variant="h6" sx={{ maxWidth: 480, textAlign: 'center' }}>
            {description ? description : 'Please login for proceed'}
          </Typography>
        )}
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle2" fontWeight="medium">
          Email Address
        </Typography>
        <RHFTextField name="email" placeholder="Email Address" />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle2" fontWeight="medium">
          Password
        </Typography>
        <RHFTextField
          name="password"
          placeholder="Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link>

      <Typography
        component="div"
        sx={{
          mt: 2.5,
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }}
      >
        {'By logging in, '}I agree to{' '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography>

      <Button
        fullWidth
        color="inherit"
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <Iconify icon="eos-icons:loading" /> : null}
      >
        {(() => {
          if (isSubmitting) {
            return 'Logging in...';
          }
          return 'Login';
        })()}
      </Button>

      {/* OR Separator */}
      <Box sx={{ position: 'relative', my: 3 }}>
        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: theme.palette.divider,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.palette.background.paper,
            px: 2,
            color: 'text.secondary',
          }}
        >
          OR
        </Typography>
      </Box>

      {/* Social Login Buttons */}
      <Stack spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={
            <Box
              component="img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google"
              sx={{ width: 20, height: 20 }}
            />
          }
          onClick={() => handleSocialLogin('google')}
        >
          Continue with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Iconify icon="mdi:apple" width={24} height={24} />}
          onClick={() => handleSocialLogin('apple')}
        >
          Continue with Apple
        </Button>
      </Stack>

      <Stack direction="row" spacing={0.5} sx={{ alignSelf: 'center', marginBottom: 2, mt: 2 }}>
        <Typography variant="body2">New user?</Typography>

        <Link
          component="button"
          variant="subtitle2"
          onClick={handleToggleMode}
          sx={{ textDecoration: 'none', cursor: 'pointer', color: '#212B36' }}
        >
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      sx={{ '.MuiDialogContent-root': { padding: 0 } }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        }}
      >
        <Iconify icon="ant-design:close-outlined" />
      </IconButton>
      <DialogContent>
        <Box sx={{ width: '100%', padding: 8 }}>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}
          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
