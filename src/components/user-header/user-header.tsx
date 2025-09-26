'use client';

import { useEffect, useState } from 'react';

import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputBase,
  Link,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Avatar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import LoginPopup from 'src/app/landing/loginPopup/LoginPopup';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getDummyAvtarUrl } from 'src/utils/avtarData';

// ----------------------------------------------------------------------

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100% !important',
  // maxWidth: '600px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: `1px solid ${theme.palette.grey[300]}`,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: '8px',
  height: 'calc(100% - 8px)',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: '4px',
  top: '4px',
  color: theme.palette.common.white,
  backgroundColor: '#212B36',
  borderRadius: '50%',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '&:focus': {
    borderColor: '#212B36',
  },
  '&:hover': {
    borderColor: '#212B36',
  },
  '&:focus-visible': {
    borderColor: '#212B36',
  },
  '&:focus-within': {
    borderColor: '#212B36',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 2),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}));

const categoryLinks = [
  { label: 'Gifts', href: '/gifts' },
  { label: 'The Personalisation Shop', href: '/personalisation' },
  { label: 'Home Favourites', href: '/home-favourites' },
  { label: 'Fashion Finds', href: '/fashion' },
  { label: 'Registry', href: '/registry' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Art & Collectibles', href: '/art-collectibles' },
  { label: 'Baby', href: '/baby' },
  { label: 'Bags & Purses', href: '/bags-purses' },
  { label: 'Bath & Beauty', href: '/bath-beauty' },
  { label: 'Books, Films & Music', href: '/books-films-music' },
  { label: 'Clothing', href: '/clothing' },
  { label: 'Craft Supplies & Tools', href: '/craft-supplies-tools' },
  { label: 'Electronics & Accessories', href: '/electronics-accessories' },
  { label: 'Home & Living', href: '/home-living' },
  { label: 'Jewellery', href: '/jewellery' },
  { label: 'Paper & Party Supplies', href: '/paper-party-supplies' },
  { label: 'Pet Supplies', href: '/pet-supplies' },
  { label: 'Shoes', href: '/shoes' },
  { label: 'Toys & Games', href: '/toys-games' },
  { label: 'Weddings', href: '/weddings' },
];

// ----------------------------------------------------------------------

export default function UserHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const router = useRouter();
  // Get user data from auth context
  const { user, authenticated, logout } = useAuthContext();
  // Determine if user is admin based on user data
  const isAdmin = authenticated && user && (
    user.is_admin === true
  );

  const handleCategoriesClose = () => {
    setAnchorEl1(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle search functionality
    console.log('Search submitted');
  };

  const handleLoginPopupClose = (): void => {
    setLoginPopupOpen(false);
  };

  const handleLoginPopupOpen = () => {
    setLoginPopupOpen(true);
  };

  const handleOrdersClick = () => {
    router.push(paths.user.cart);
  };

  const handleProfileClick = () => {
    router.push(paths.user.profile);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openProfileMenu = Boolean(anchorEl);

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      router.push(paths.dashboard.root);
    }
  }, [authenticated, isAdmin, router]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: theme.zIndex.appBar,
        }}
      >
        {/* Primary Navigation Bar */}
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              height: { xs: 64, md: 80 },
              px: { xs: 1, md: 0 },
            }}
          >
            {/* Left Side - Logo and Categories */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Logo disabledLink={false} />

              {!isMobile && (
                <>
                  <Stack direction="row" alignItems="center" spacing={1} onClick={(e) => {
                    setAnchorEl1(e.currentTarget);
                  }}>
                    <IconButton
                      size="small"
                      sx={{ color: 'text.primary' }}
                      onClick={handleMobileMenuToggle}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 20,
                          height: 2,
                          backgroundColor: 'currentColor',
                          display: 'block',
                          position: 'relative',
                          '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'currentColor',
                            left: 0,
                          },
                          '&::before': {
                            top: -6,
                          },
                          '&::after': {
                            top: 6,
                          },
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.primary',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={handleMobileMenuToggle}
                    >
                      Categories
                    </Typography>

                  </Stack>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl1}
                    open={!!anchorEl1}
                    onClose={handleCategoriesClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '8px',

                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#cccccc',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'transparent',
                          borderRadius: '4px',
                          margin: '8px',
                        },
                      },
                    }}
                  >
                    {categoryLinks.map((link) => (<MenuItem onClick={handleCategoriesClose} key={link.label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {link.label}
                      </Box>
                    </MenuItem>))}
                  </Menu>
                </>
              )}
            </Stack>

            {/* Middle Section - Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                mx: { xs: 1, md: 3 }
              }}
            >
              <Search>
                <StyledInputBase
                  placeholder="Search for anything"
                  inputProps={{ 'aria-label': 'search' }}
                />
                <SearchIconWrapper>
                  <Iconify icon="eva:search-fill" />
                </SearchIconWrapper>
              </Search>
            </Box>

            {/* Right Side - User Actions */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton size="small" sx={{ color: 'text.primary' }} onClick={() => {
                window.location.href = paths.user.wishlist;
              }}>
                <Tooltip title="Wishlist">
                  <Iconify icon="eva:heart-outline" width={24} height={24} />
                </Tooltip>
              </IconButton>

              {/* Cart Icon */}
              <IconButton
                size="small"
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  window.location.href = paths.user.cart;
                }}
              >
                <Tooltip title="Cart">
                  <Iconify icon="eva:shopping-cart-outline" width={24} height={24} />
                </Tooltip>
              </IconButton>

              {authenticated ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.primary' }}
                    onClick={handleProfileMenuClick}
                  >
                    <Tooltip title={user?.email}>
                      {/* <Iconify icon="eva:person-outline" width={24} height={24} /> */}
                      <Avatar
                        src={user?.photoURL || getDummyAvtarUrl(user?.profile_icon || '25').avatarUrl}
                        alt={user?.displayName}
                        sx={{ width: 24, height: 24 }}
                      />
                    </Tooltip>
                  </IconButton>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={openProfileMenu}
                    onClose={handleProfileMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'profile-button',
                    }}
                  >
                    <MenuItem onClick={handleProfileClick}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="eva:person-outline" />
                        Profile
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleOrdersClick}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="eva:shopping-cart-outline" />
                        Orders
                      </Box>
                    </MenuItem>
                    <MenuItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="eva:question-mark-circle-outline" />
                        Help Center
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="eva:log-out-outline" />
                        Log out
                      </Box>
                    </MenuItem>
                  </Menu>
                </Stack>
              ) : (
                <Link
                  component={RouterLink}
                  href="#"
                  onClick={handleLoginPopupOpen}
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    typography: 'body1',
                    '&:hover': { color: '#212B36' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Sign in
                </Link>
              )}

              {/* user Icon */}
              {/* <IconButton
                size="small"
                sx={{ color: 'text.primary' }}
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                }}
              >
                <Tooltip title="Profile">
                  <Iconify icon="eva:person-outline" />
                </Tooltip>
              </IconButton> */}

              {/* User Menu */}
              {/* <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:person-outline" />
                    Profile
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:shopping-cart-outline" />
                    Orders
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:question-mark-circle-outline" />
                    Help Center
                  </Box>
                </MenuItem>
                <MenuItem sx={{ color: 'error.main' }} onClick={handleClose}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:log-out-outline" />
                    Logout
                  </Box>
                </MenuItem>
              </Menu> */}

            </Stack>
          </Toolbar>
        </Container>

        {/* Secondary Navigation Bar */}
        {/* <Box
          sx={{
            backgroundColor: 'white',
            borderTop: `1px solid ${theme.palette.divider}`,
            display: { xs: 'none', md: 'block' }
          }}
        >
          <Container maxWidth="xl">
            <Stack
              direction="row"
              spacing={4}
              sx={{
                py: 1.5,
                px: 0,
                justifyContent: 'center',
                '& > *': {
                  color: 'text.primary',
                  textDecoration: 'none',
                  typography: 'body2',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }
              }}
            >
              {categoryLinks.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  href={link.href}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Container>
        </Box> */}
      </AppBar>

      <LoginPopup open={loginPopupOpen} onClose={handleLoginPopupClose} />

      {/* Mobile Menu Drawer */}
      {/* <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            p: 2,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
        </Box>
        <Divider />
        <List>
          {categoryLinks.map((link) => (
            <ListItem
              key={link.label}
              button
              component={RouterLink}
              href={link.href}
              onClick={handleMobileMenuToggle}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
      </Drawer> */}
    </>
  );
}
