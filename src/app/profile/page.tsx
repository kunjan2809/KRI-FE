'use client';

import React, { useState } from 'react';

import { alpha } from '@mui/material/styles';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getDummyAvtarUrl } from 'src/utils/avtarData';

// ----------------------------------------------------------------------

interface AddressData {
  houseNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: AddressData;
  address2: AddressData;
};

// ----------------------------------------------------------------------

const dummyProfileData = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+61733088011',
  address1: {
    houseNumber: '242',
    streetName: 'Preston Rd',
    suburb: 'Wynnum West',
    state: 'QLD',
    zipCode: '4178',
    country: 'Australia',
  },
  address2: {
    houseNumber: '4B',
    streetName: 'Apt 4B',
    suburb: 'Wynnum West',
    state: 'QLD',
    zipCode: '4178',
    country: 'Australia',
  },
}

const ProfilePage = () => {
  const theme = useTheme();
  const [isEditpersonalInfo, setIsEditpersonalInfo] = useState(false);
  const [isEditaddressOne, setIsEditaddressOne] = useState(false);
  const [isEditaddressTwo, setIsEditaddressTwo] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [open2FADialog, setOpen2FADialog] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>(dummyProfileData);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 2FA form state
  const [twoFAForm, setTwoFAForm] = useState({
    email: '',
    otp: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [twoFAError, setTwoFAError] = useState('');

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressInputChange = (addressField: 'address1' | 'address2', field: keyof AddressData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [addressField]: {
        ...prev[addressField],
        [field]: value,
      },
    }));
  };

  const handlePersonalInfoSave = () => {
    setIsEditpersonalInfo(false);
  };

  const handlePersonalInfoCancel = () => {
    setProfileData(dummyProfileData);
    setIsEditpersonalInfo(false);
  };

  const handleAddressOneSave = () => {
    setIsEditaddressOne(false);
  };

  const handleAddressOneCancel = () => {
    setProfileData(dummyProfileData);
    setIsEditaddressOne(false);
  };

  const handleAddressTwoSave = () => {
    setIsEditaddressTwo(false);
  };

  const handleAddressTwoCancel = () => {
    setProfileData(dummyProfileData);
    setIsEditaddressTwo(false);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError('');
  };

  const handle2FAChange = (field: string, value: string) => {
    setTwoFAForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setTwoFAError('');
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    // Here you would typically make an API call to change the password
    console.log('Password change submitted:', passwordForm);
    setOpenPasswordDialog(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handle2FASubmit = () => {
    if (!twoFAForm.email || !twoFAForm.otp) {
      setTwoFAError('Please fill in all fields');
      return;
    }
    // Here you would typically make an API call to verify 2FA
    console.log('2FA submitted:', twoFAForm);
    setOpen2FADialog(false);
    setTwoFAForm({ email: '', otp: '' });
  };

  const handleLogout = () => {
    router.push(paths.user.root);
  };

  return (
    <Box>
      {/* Hero Section */}
      {/* <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            My Profile
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            Manage your personal information and account security
          </Typography>
        </Container>
      </Box> */}

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4} alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
                  My Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Manage your personal information and account security
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:log-out-outline" />}
                    onClick={handleLogout}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Stack spacing={4} >
            {/* Profile Avatar and Basic Info */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item>
                  <Avatar
                        src={profileData.photoURL || getDummyAvtarUrl(profileData.profile_icon || '25').avatarUrl}
                        alt={profileData.firstName + profileData.lastName}
                        sx={{ width: 120, height: 120 }}
                      />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h5" fontWeight="bold">
                      {profileData.firstName} {profileData.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      {profileData.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member since January 2024
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <Card>
              <CardHeader
                title="Personal Information"
                action={
                  isEditpersonalInfo ? (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        onClick={handlePersonalInfoCancel}
                        size="small"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handlePersonalInfoSave}
                        size="small"
                        startIcon={<Iconify icon="eva:checkmark-outline" />}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditpersonalInfo(true)}
                      startIcon={<Iconify icon="eva:edit-outline" />}
                      size="small"
                    >
                      Edit
                    </Button>
                  )
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        First Name
                      </Typography>
                      {isEditpersonalInfo ? (
                        <TextField
                          fullWidth
                          size='small'
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {profileData.firstName}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Last Name
                      </Typography>
                      {isEditpersonalInfo ? (
                        <TextField
                          fullWidth
                          size='small'
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {profileData.lastName}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Email Address
                      </Typography>
                      {isEditpersonalInfo ? (
                        <TextField
                          fullWidth
                          size='small'
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {profileData.email}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Phone Number
                      </Typography>
                      {isEditpersonalInfo ? (
                        <TextField
                          fullWidth
                          size='small'
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {profileData.phone}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Box>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardHeader
                      title="Address one"
                      action={
                        isEditaddressOne ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              onClick={handleAddressOneCancel}
                              size="small"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleAddressOneSave}
                              size="small"
                              startIcon={<Iconify icon="eva:checkmark-outline" />}
                            >
                              Save Changes
                            </Button>
                          </Stack>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => setIsEditaddressOne(true)}
                            startIcon={<Iconify icon="eva:edit-outline" />}
                            size="small"
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              House Number
                            </Typography>
                            {isEditaddressOne ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address1.houseNumber}
                                onChange={(e) => handleAddressInputChange('address1', 'houseNumber', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address1.houseNumber}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              Street Name
                            </Typography>
                            {isEditaddressOne ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address1.streetName}
                                onChange={(e) => handleAddressInputChange('address1', 'streetName', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address1.streetName}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              City
                            </Typography>
                            {isEditaddressOne ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address1.suburb}
                                onChange={(e) => handleAddressInputChange('address1', 'suburb', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address1.suburb}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              State/Province
                            </Typography>
                            {isEditaddressOne ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address1.state}
                                onChange={(e) => handleAddressInputChange('address1', 'state', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address1.state}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              ZIP/Postal Code
                            </Typography>
                            {isEditaddressOne ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address1.zipCode}
                                onChange={(e) => handleAddressInputChange('address1', 'zipCode', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address1.zipCode}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              Country
                            </Typography>
                            {isEditaddressOne ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address1.country}
                                onChange={(e) => handleAddressInputChange('address1', 'country', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address1.country}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardHeader
                      title="Address Two"
                      action={
                        isEditaddressTwo ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              onClick={handleAddressTwoCancel}
                              size="small"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleAddressTwoSave}
                              size="small"
                              startIcon={<Iconify icon="eva:checkmark-outline" />}
                            >
                              Save Changes
                            </Button>
                          </Stack>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => setIsEditaddressTwo(true)}
                            startIcon={<Iconify icon="eva:edit-outline" />}
                            size="small"
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              House Number
                            </Typography>
                            {isEditaddressTwo ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address2.houseNumber}
                                onChange={(e) => handleAddressInputChange('address2', 'houseNumber', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address2.houseNumber}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              Street Name
                            </Typography>
                            {isEditaddressTwo ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address2.streetName}
                                onChange={(e) => handleAddressInputChange('address2', 'streetName', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address2.streetName}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              City
                            </Typography>
                            {isEditaddressTwo ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address2.suburb}
                                onChange={(e) => handleAddressInputChange('address2', 'suburb', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address2.suburb}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              State/Province
                            </Typography>
                            {isEditaddressTwo ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address2.state}
                                onChange={(e) => handleAddressInputChange('address2', 'state', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address2.state}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              ZIP/Postal Code
                            </Typography>
                            {isEditaddressTwo ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address2.zipCode}
                                onChange={(e) => handleAddressInputChange('address2', 'zipCode', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address2.zipCode}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              Country
                            </Typography>
                            {isEditaddressTwo ? (
                              <TextField
                                fullWidth
                                size='small'
                                value={profileData.address2.country}
                                onChange={(e) => handleAddressInputChange('address2', 'country', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {profileData.address2.country}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Account Security */}
            <Card sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
              <CardHeader title="Account Security" />
              <CardContent>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Change Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Update your password to keep your account secure
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenPasswordDialog(true)}
                    >
                      Change Password
                    </Button>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpen2FADialog(true)}
                    >
                      Enable 2FA
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Change Password
          <IconButton
            onClick={() => setOpenPasswordDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {passwordError && (
              <Alert severity="error">{passwordError}</Alert>
            )}
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordSubmit}
            startIcon={<Iconify icon="eva:checkmark-outline" />}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Two-Factor Authentication Dialog */}
      <Dialog
        open={open2FADialog}
        onClose={() => setOpen2FADialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Enable Two-Factor Authentication
          <IconButton
            onClick={() => setOpen2FADialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {twoFAError && (
              <Alert severity="error">{twoFAError}</Alert>
            )}
            <Alert severity="info">
              We&apos;ll send a verification code to your Gmail address to enable two-factor authentication.
            </Alert>
            <TextField
              fullWidth
              label="Gmail Address"
              type="email"
              value={twoFAForm.email}
              onChange={(e) => handle2FAChange('email', e.target.value)}
              placeholder="your.email@gmail.com"
            />
            <TextField
              fullWidth
              label="Verification Code (OTP)"
              value={twoFAForm.otp}
              onChange={(e) => handle2FAChange('otp', e.target.value)}
              placeholder="Enter 6-digit code"
              inputProps={{ maxLength: 6 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen2FADialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handle2FASubmit}
            startIcon={<Iconify icon="eva:shield-outline" />}
          >
            Enable 2FA
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;

