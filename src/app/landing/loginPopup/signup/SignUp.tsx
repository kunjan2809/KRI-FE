import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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
  useTheme,
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { getRandomStringNumber } from 'src/utils/avtarData';
import { useBoolean } from 'src/hooks/use-boolean';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useState } from 'react';

interface SignUp {
  firstName: string;
  lastName: string;
  email: string;
  mobile_number:string;
  password: string;
}

interface SignUpPopupProps {
  open: boolean;
  onClose: () => void;
  isSignup: boolean;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEmailVerification: React.Dispatch<React.SetStateAction<boolean>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

const SignUp = ({
  open,
  onClose,
  isSignup,
  setIsSignup,
  setIsEmailVerification,
  setUserEmail,
}: SignUpPopupProps) => {
  const theme = useTheme();
  const { register } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const phoneRegExp =  /^(\+[0-9]{1,2})?[0-9]{10}$/;

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    mobile_number:Yup.string().required('Phone number is required').matches(phoneRegExp, "Phone number is not valid, optionally prefixed with a +1 or +2 digit country code."),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobile_number:'',
    password: '',
  };

  const methods = useForm<SignUp>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const selectedProfileIcon = getRandomStringNumber();

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      setErrorMsg('');
      await register?.(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.mobile_number,
        selectedProfileIcon,
      );
      // After successful registration, show email verification
      setUserEmail(data.email);
      setIsEmailVerification(true);
      reset();
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

  // const handleSocialLogin = async (provider: 'google' | 'apple') => {
  //   try {
  //     // Here you would typically integrate with your authentication provider
  //     // For example, using Firebase Auth, Auth0, or your own OAuth implementation

  //     // Example implementation:
  //     // if (provider === 'google') {
  //     //     await signInWithGoogle();
  //     // } else if (provider === 'apple') {
  //     //     await signInWithApple();
  //     // }

  //     // For now, just close the modal and show success
  //     onClose();
  //     reset();
  //     setErrorMsg('');
  //   } catch (error) {
  //     console.error(`${provider} login error:`, error);
  //     setErrorMsg(`Failed to sign in with ${provider}. Please try again.`);
  //   }
  // };

  const renderForm = (
    <Stack spacing={2.5}>
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {(() => {
          return 'Get started absolutely free';
        })()}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" fontWeight="medium">
            First Name
          </Typography>
          <RHFTextField name="firstName" placeholder="First Name" />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" fontWeight="medium">
            Last Name
          </Typography>
          <RHFTextField name="lastName" placeholder="Last Name" />
        </Box>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle2" fontWeight="medium">
          Email Address
        </Typography>
        <RHFTextField name="email" placeholder="Email Address" />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle2" fontWeight="medium">
          Phone Number
        </Typography>
        <RHFTextField name="mobile_number" placeholder="Phone number" />
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

      <Typography
        component="div"
        sx={{
          mt: 2.5,
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }}
      >
        By signing up, I agree to{' '}
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
            return 'Creating account...';
          }

          return 'Create account';
        })()}
      </Button>

      {/* OR Separator */}
      {/* <Box sx={{ position: 'relative', my: 3 }}>
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
      </Box> */}

      {/* Social Login Buttons */}
      {/* <Stack spacing={1.5}>
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
      </Stack> */}
      
      <Stack direction="row" spacing={0.5} sx={{ alignSelf: 'center', marginBottom: 2, mt: 2 }}>
        <Typography variant="body2">Already have an account?</Typography>

        <Link
          component="button"
          variant="subtitle2"
          onClick={handleToggleMode}
          sx={{ textDecoration: 'none', cursor: 'pointer', color: '#212B36' }}
        >
          Sign in
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

export default SignUp;
