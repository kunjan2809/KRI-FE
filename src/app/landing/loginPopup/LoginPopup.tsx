'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// OTP Input Component
const OTPInput = ({ value, onChange, error, theme }: { value: string; onChange: (value: string) => void; error?: boolean; theme: any }) => {
    const [focusedIndex, setFocusedIndex] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '').slice(0, 6);
        onChange(input);
        // Update focused index to the next empty position or current length
        setFocusedIndex(Math.min(input.length, 5));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow backspace, delete, arrow keys, and numbers
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
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
                type="text"
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

interface LoginPopupProps {
    open: boolean;
    onClose: () => void;
}

const LoginPopup = ({ open, onClose }: LoginPopupProps) => {
    const theme = useTheme();
    const { login, register } = useAuthContext();
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isEmailVerification, setIsEmailVerification] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const password = useBoolean();

    const LoginSchema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        password: Yup.string().required('Password is required'),
    });

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required('First name required'),
        lastName: Yup.string().required('Last name required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        password: Yup.string().required('Password is required'),
    });

    const OTPSchema = Yup.object().shape({
        otp: Yup.string()
            .required('OTP is required')
            .length(6, 'OTP must be exactly 6 digits')
            .matches(/^\d{6}$/, 'OTP must contain only numbers'),
    });

    const loginDefaultValues = {
        email: '',
        password: '',
    };

    const registerDefaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };

    const otpDefaultValues = {
        otp: '',
    };

    const getCurrentSchema = () => {
        if (isEmailVerification) return OTPSchema;
        return isSignup ? RegisterSchema : LoginSchema;
    };

    const getCurrentDefaultValues = useCallback(() => {
        if (isEmailVerification) return otpDefaultValues;
        return isSignup ? registerDefaultValues : loginDefaultValues;
    }, [isEmailVerification, isSignup]);

    const methods = useForm<any>({
        resolver: yupResolver(getCurrentSchema() as any),
        defaultValues: getCurrentDefaultValues(),
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // Reset form when switching modes
    useEffect(() => {
        reset(getCurrentDefaultValues());
    }, [reset, getCurrentDefaultValues]);

    const onSubmit = handleSubmit(async (data: any) => {
        try {
            if (isEmailVerification) {
                // Handle OTP verification
                console.log('OTP Verification Data:', {
                    email: userEmail,
                    otp: data.otp,
                    timestamp: new Date().toISOString()
                });
                // Here you would typically call your OTP verification API
                // await verifyOTP?.(userEmail, data.otp);
                onClose();
                reset();
                setErrorMsg('');
            } else if (isSignup) {
                await register?.(data.email, data.password, data.firstName, data.lastName);
                // After successful registration, show email verification
                setUserEmail(data.email);
                setIsEmailVerification(true);
                reset();
                setErrorMsg('');
            } else {
                await login?.(data.email, data.password);
                onClose();
                reset();
                setErrorMsg('');
            }
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
        setIsSignup(!isSignup);
        reset();
        setErrorMsg('');
    };

    const handleBackToLogin = () => {
        setIsEmailVerification(false);
        setIsSignup(false);
        setUserEmail('');
        reset();
        setErrorMsg('');
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
            <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
                {(() => {
                    if (isEmailVerification) return 'Verify your email';
                    if (isSignup) return 'Get started absolutely free';
                    return 'Hi, Welcome back';
                })()}
            </Typography>

            {isEmailVerification ? (
                <>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        We&apos;ve sent a 6-digit code to
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {userEmail}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <OTPInput
                            value={methods.watch('otp') || ''}
                            onChange={(value) => {
                                methods.setValue('otp', value);
                                methods.trigger('otp'); // Trigger validation
                            }}
                            error={!!methods.formState.errors.otp}
                            theme={theme}
                        />
                    </Box>

                    {methods.formState.errors.otp && (
                        <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
                            {String(methods.formState.errors.otp.message)}
                        </Typography>
                    )}

                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        Didn&apos;t receive the code?{' '}
                        <Link component="button" variant="subtitle2" sx={{ textDecoration: 'none' }}>
                            Resend
                        </Link>
                    </Typography>
                </>
            ) : (
                <>
                    {isSignup && (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle2" fontWeight="medium" >
                                    First Name
                                </Typography>
                                <RHFTextField name="firstName" placeholder='First Name' />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle2" fontWeight="medium" >
                                    Last Name
                                </Typography>
                                <RHFTextField name="lastName" placeholder='Last Name' />
                            </Box>
                        </Stack>
                    )}
                    <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium" >
                            Email Address
                        </Typography>
                        <RHFTextField name="email" placeholder='Email Address' />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium" >
                            Password
                        </Typography>
                        <RHFTextField
                            name="password"
                            placeholder='Password'
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

                    {!isSignup && (
                        <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
                            Forgot password?
                        </Link>
                    )}

                    <Typography
                        component="div"
                        sx={{
                            mt: 2.5,
                            textAlign: 'center',
                            typography: 'caption',
                            color: 'text.secondary',
                        }}
                    >

                        {isSignup ? 'By signing up, ' : 'By logging in, '}
                        I agree to {' '}
                        <Link underline="always" color="text.primary">
                            Terms of Service
                        </Link>
                        {' and '}
                        <Link underline="always" color="text.primary">
                            Privacy Policy
                        </Link>
                        .
                    </Typography>
                </>
            )}

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
                        if (isEmailVerification) return 'Verifying...';
                        if (isSignup) return 'Creating account...';
                        return 'Logging in...';
                    }
                    if (isEmailVerification) return 'Verify Email';
                    if (isSignup) return 'Create account';
                    return 'Login';
                })()}
            </Button>


            {!isEmailVerification && (
                <>
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
                            startIcon={
                                <Iconify
                                    icon="mdi:apple"
                                    width={24}
                                    height={24}
                                />
                            }
                            onClick={() => handleSocialLogin('apple')}
                        >
                            Continue with Apple
                        </Button>
                    </Stack>
                </>
            )}

            {!isEmailVerification && (
                <Stack direction="row" spacing={0.5} sx={{ alignSelf: 'center', marginBottom: 2, mt: 2 }}>
                    <Typography variant="body2">
                        {isSignup ? 'Already have an account?' : 'New user?'}
                    </Typography>

                    <Link
                        component="button"
                        variant="subtitle2"
                        onClick={handleToggleMode}
                        sx={{ textDecoration: 'none', cursor: 'pointer', color: "#212B36" }}
                    >
                        {isSignup ? 'Sign in' : 'Create an account'}
                    </Link>
                </Stack>
            )}

            {isEmailVerification && (
                <Stack direction="row" spacing={0.5} sx={{ alignSelf: 'center', marginBottom: 2 }}>
                    <Typography variant="body2">
                        Wrong email?
                    </Typography>

                    <Link
                        component="button"
                        variant="subtitle2"
                        onClick={handleBackToLogin}
                        sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                        Go back
                    </Link>
                </Stack>
            )}
        </Stack>
    );

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" sx={{ '.MuiDialogContent-root': { padding: 0 } }}>
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
                    <FormProvider methods={methods} onSubmit={onSubmit} >
                        {renderForm}
                    </FormProvider>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LoginPopup
