import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';

// OTP Input Component
const OTPInput = ({
  value,
  onChange,
  error,
  theme,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  theme: any;
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(input);
    // Update focused index to the next empty position or current length
    setFocusedIndex(Math.min(input.length, 5));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, arrow keys, and numbers
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Tab'
    ) {
      return;
    }
    // Only allow numbers
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleFocus = () => {
    // Set focus to the next empty position or the last filled position
    setFocusedIndex(Math.min(value.length, 5));
  };

  const handleClick = (index: number) => {
    setFocusedIndex(index);
    // Focus the input when clicking on a box
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', gap: 1, justifyContent: 'center' }}>
      {Array.from({ length: 6 }, (_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!value[index];

        return (
          <Box
            key={index}
            onClick={() => handleClick(index)}
            sx={{
              width: 48,
              height: 48,
              border: (() => {
                if (error) return `2px solid ${theme.palette.error.main}`;
                if (isFocused) return `2px solid ${theme.palette.primary.main}`;
                if (hasValue) return `2px solid ${theme.palette.primary.main}`;
                return `2px solid ${theme.palette.divider}`;
              })(),
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                borderColor: (() => {
                  if (isFocused) return theme.palette.primary.main;
                  return theme.palette.primary.light;
                })(),
              },
              boxShadow: isFocused ? `0 0 0 2px ${theme.palette.primary.main}20` : 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: hasValue ? theme.palette.text.primary : theme.palette.text.disabled,
              }}
            >
              {value[index] || ''}
            </Typography>
          </Box>
        );
      })}
      <input
        type="number"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        maxLength={6}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '16px', // Prevent zoom on mobile
        }}
        autoComplete="one-time-code"
      />
    </Box>
  );
};

// ----------------------------------------------------------------------

interface MailVerificationPopupProps {
  open: boolean;
  onClose: () => void;
  setIsEmailVerification: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  userEmail: string;
}

interface MailVerification {
  otp: string;
}

const MailVerification = ({
  open,
  onClose,
  setIsEmailVerification,
  setIsSignup,
  setUserEmail,
  userEmail,
}: MailVerificationPopupProps) => {
  const theme = useTheme();
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    otp: '',
  };

  const OTPSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
  });

  const methods = useForm<MailVerification>({
    resolver: yupResolver(OTPSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    setError,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    if (data.otp.length < 6) {
      setError('otp', { message: 'OTP must be exactly 6 digit' });
    } else {
      try {
        onClose();
        reset();
        setErrorMsg('');
        //   setIsSignup(false);
        //   setIsEmailVerification(false);
        setUserEmail('');
      } catch (error) {
        console.error(error);
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
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

  const handleBackToLogin = () => {
    setIsEmailVerification(false);
    setIsSignup(false);
    setUserEmail('');
    reset();
    setErrorMsg('');
  };

  const renderForm = (
    <Stack spacing={2.5}>
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {(() => {
          return 'Verify your email';
        })()}
      </Typography>

      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
        We&apos;ve sent a 6-digit code to
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {userEmail}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <OTPInput
          value={watch('otp') || ''}
          onChange={(value) => {
            setValue('otp', value);
            trigger('otp'); // Trigger validation
          }}
          error={!!errors.otp}
          theme={theme}
        />
      </Box>

      {errors.otp && (
        <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
          {String(errors.otp.message)}
        </Typography>
      )}

      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
        Didn&apos;t receive the code?{' '}
        <Link component="button" variant="subtitle2" sx={{ textDecoration: 'none' }}>
          Resend
        </Link>
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
            return 'Verifying...';
          }
          return 'Verify Email';
        })()}
      </Button>

      <Stack direction="row" spacing={0.5} sx={{ alignSelf: 'center', marginBottom: 2 }}>
        <Typography variant="body2">Wrong email?</Typography>

        <Link
          component="button"
          variant="subtitle2"
          onClick={handleBackToLogin}
          sx={{ textDecoration: 'none', cursor: 'pointer', color: '#212B36' }}
        >
          Go back
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

export default MailVerification;
