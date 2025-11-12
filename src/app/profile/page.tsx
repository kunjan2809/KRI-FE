'use client';

import React, { useEffect, useState } from 'react';

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
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { getDummyAvtarUrl } from 'src/utils/avtarData';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { useAuthToken } from 'src/auth/hooks';
import { deleteAddress, getAllAddress, getUserInfo, updateUserInfo } from 'src/api/user';
import { GetUserInfo, UserAddress, UserPersonalInfo } from 'src/types/user';
import { enqueueSnackbar } from 'notistack';
import AddressFormDialog from 'src/sections/user/view/user-add-address';
import { Icon } from '@iconify/react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import UserChangePassword from 'src/sections/user/view/user-change-password';
import { ProfileAddressSkeleton, ProfileHeaderSkeleton } from 'src/sections/user/profile-skeleton';
import { useBoolean } from 'src/hooks/use-boolean';

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
}

// ----------------------------------------------------------------------

const ProfilePage = () => {
  const token = useAuthToken();
  const theme = useTheme();
  const [isEditpersonalInfo, setIsEditpersonalInfo] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const [user, setUser] = useState<GetUserInfo | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<UserAddress | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmationDelete, setConfirmationDelete] = useState<boolean>(false);
  const [confirmationLogout, setConfirmationLogout] = useState<boolean>(false);
  const { logout } = useAuthContext();

  const getUserAddress = async () => {
    try {
      if (token) {
        const response = await getAllAddress(token);
        if (response.success) setAddresses(response.data.addresses);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const getUserInformation = async () => {
    try {
      if (token) {
        const response = await getUserInfo(token);
        if (response.success) setUser(response.data.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  useEffect(() => {
    getUserInformation();
    getUserAddress();
  }, [token]);

  const handleInputChange = (field: keyof GetUserInfo, value: string) => {
    if (user) {
      setUser((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePersonalInfoSave = async () => {
    try {
      if (user) {
        const personalInfoSave: UserPersonalInfo = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          mobile_number: user.mobile_number,
        };
        await updateUserInfo(personalInfoSave, token);
        setIsEditpersonalInfo(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handlePersonalInfoCancel = () => {
    setIsEditpersonalInfo(false);
  };

  const handleClose = () => {
    (setOpenDialog(false), setOpenPasswordDialog(false));
  };

  const handleDelete = async () => {
    try {
      await deleteAddress(deleteId as string, token);
      getUserAddress();
      setDeleteId(null);
      setConfirmationDelete(false);
    } catch (err) {
      setDeleteId(null);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleOpenAdd = () => {
    setCurrentAddress(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (address: UserAddress) => {
    setCurrentAddress(address);
    setOpenDialog(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setConfirmationLogout(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const date = user && new Date(user.created_at);
  const monthName = date && date.toLocaleString('default', { month: 'long' });
  const year = date && date.getFullYear();

  return (
    <>
      <Box>
        <div className="min-h-screen bg-white">
          {/* Header Section */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{ fontWeight: 'bold', fontFamily: 'serif' }}
                  >
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
                      onClick={() => setConfirmationLogout(true)}
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
            {/* Profile Avatar and Basic Info */}

            <Stack spacing={4}>
              {!user ? (
                <ProfileHeaderSkeleton />
              ) : (
                <>
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={4} alignItems="center">
                        <Grid item>
                          <Avatar
                            src={getDummyAvtarUrl(user.profile_icon || '25').avatarUrl}
                            alt={user.first_name + user.last_name}
                            sx={{ width: 120, height: 120 }}
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h5" fontWeight="bold">
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            {user.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Member since {monthName} {year}
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
                                size="small"
                                value={user.first_name}
                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {user.first_name}
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
                                size="small"
                                value={user.last_name}
                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {user.last_name}
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
                                size="small"
                                value={user.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
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
                                size="small"
                                value={user.mobile_number}
                                onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {user.mobile_number}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Address Information */}
              {!addresses ? (
                <ProfileAddressSkeleton />
              ) : (
                <Card>
                  <CardHeader title="Address" />
                  <CardContent>
                    <Grid container spacing={3}>
                      {addresses.map((address) => (
                        <>
                          <Grid key={address._id} item xs={12} sm={6}>
                            <Card sx={{ borderRadius: 2 }}>
                              <CardHeader
                                title={address.full_name}
                                action={
                                  <Stack direction="row" spacing={1}>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Icon icon="eva:edit-outline" />}
                                      onClick={() => handleOpenEdit(address)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      color="error"
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Icon icon="eva:trash-2-outline" />}
                                      onClick={() => {
                                        (setConfirmationDelete(true), setDeleteId(address._id!));
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Stack>
                                }
                              />
                              <Divider sx={{ marginTop: '10px' }} />
                              <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                  <b>Address: </b>
                                  {address.formatted_address || (
                                    <>
                                      {address.address_line_1},{' '}
                                      {address.address_line_2 && `${address.address_line_2}, `}
                                      {address.city}, {address.state} {address.postal_code},{' '}
                                      {address.country}
                                    </>
                                  )}
                                </Typography>
                                {address.landmark && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    Landmark: {address.landmark}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        </>
                      ))}
                    </Grid>

                    <Box
                      sx={{
                        width: '100%',
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'end',
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Icon icon="mingcute:add-line" />}
                        onClick={handleOpenAdd}
                      >
                        Add New Address
                      </Button>
                    </Box>

                    <AddressFormDialog
                      open={openDialog}
                      onClose={handleClose}
                      currentAddress={currentAddress}
                      onSuccess={getUserAddress}
                    />
                  </CardContent>
                </Card>
              )}
              {/* Account Security */}
              <Card sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                <CardHeader title="Account Security" />
                <CardContent>
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
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
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        </div>

        {/* Change Password Dialog */}
        <UserChangePassword open={openPasswordDialog} onClose={handleClose} />

        {/* delete confirmation dialog  */}
        <ConfirmDialog
          open={confirmationDelete}
          onClose={() => {
            (setDeleteId(null), setConfirmationDelete(false));
          }}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          }
        />

        {/* logout confirmation dialog  */}
        <ConfirmDialog
          open={confirmationLogout}
          onClose={() => setConfirmationLogout(false)}
          title="Log out"
          content="Are you sure want to log out?"
          action={
            <Button variant="contained" color="error" onClick={handleLogout}>
              Log out
            </Button>
          }
        />
      </Box>
    </>
  );
};

export default ProfilePage;

