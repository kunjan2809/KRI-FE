import { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { Suggestion } from 'src/types/product';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import LoginPopup from '../landing/loginPopup/AuthPopup';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

interface RecommendedProductsCardProps {
  product: Suggestion;
  addToCart: (productId: string, variationId?: string) => void;
  addToWishlist: (productId: string, wishlist: boolean) => void;
  showWishlistButton?: boolean;
}

const RecommendedProductsCard = ({
  product,
  addToCart,
  addToWishlist,
  showWishlistButton = true,
}: RecommendedProductsCardProps) => {
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);
  const [wishlist, setWishlist] = useState(product.wishlist);
  const { authenticated } = useAuthContext();
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isFrom, setIsFrom] = useState({ cart: false, wishlist: false });

  const handleClick = () => {
    if (!authenticated) {
      setIsFrom((prev) => ({ ...prev, wishlist: true }));
      setLoginPopupOpen(true);
    } else {
      setAnimate(true);
      setWishlist(!wishlist);
      addToWishlist(product._id, wishlist);
      setTimeout(() => setAnimate(false), 500);
    }
  };

  const handleAddToCart = (productId: string) => {
    if (!authenticated) {
      (setIsFrom((prev) => ({ ...prev, cart: true })), setLoginPopupOpen(true));
    } else addToCart(productId);
  };

  const handleLoginPopupClose = (): void => {
    setLoginPopupOpen(false);
    setIsFrom((prev) => ({ ...prev, cart: false, wishlist: false }));
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          border: '1px solid #E0E0E0',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
          '.add-wishlist-btn': {
            ...(wishlist
              ? {
                  opacity: 1,
                  top: 5,
                  right: 5,
                  transition: 'all 0.1s ease',
                }
              : {
                  opacity: 0,
                  top: '25%',
                  transition: 'all 0.1s ease',
                }),
          },
          '&:hover .add-wishlist-btn': {
            opacity: 1,
            top: 5,
            right: 5,
            transition: 'all 0.1s ease',
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={
            product.image
              ? product.image
              : 'https://nraasmart.orderz.app/images/item_placeholder.jpg'
          }
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />

        {/* <Button
                onClick={() => addToCart(product.id)}
                sx={{ position: 'absolute', top: 5, right: 5, padding: 1, minWidth: 36, minHeight: 36, borderRadius: '50%', 'svg':{stroke: 'white',}}}
                variant="contained"
            >
                <Iconify icon="eva:heart-fill" width={24} />
            </Button> */}
        {showWishlistButton && (
          <Box
            className="add-wishlist-btn"
            onClick={handleClick}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              // padding: 1,
              minWidth: 36,
              minHeight: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: 'white',
              svg: {
                transition: 'transform 0.3s ease, color 0.3s ease',
                color: 'white',
                stroke: '#212B36',
                ...(wishlist && {
                  transition: 'color 0.3s ease',
                  color: 'red',
                  stroke: 'red',
                }),
                ...(animate && {
                  animation: 'beat 0.5s ease',
                  color: 'red',
                  stroke: 'white',
                }),
              },
              '@keyframes beat': {
                '0%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.25)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
            }}
          >
            <Iconify icon="eva:heart-fill" width={24} />
          </Box>
        )}
        <CardContent sx={{ p: 2, height: `calc(100% - 200)` }}>
          <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1rem', margin: 'auto' }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.collection}
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {formatPrice(product.price)}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => addToCart(product.id, product.variations[0]?._id)}
            startIcon={<Iconify icon="eva:shopping-cart-outline" />}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      {loginPopupOpen && (
        <LoginPopup
          open={loginPopupOpen}
          onClose={handleLoginPopupClose}
          title={isFrom.cart || isFrom.wishlist ? 'Login' : undefined}
          description={
            isFrom.cart
              ? 'Please login to check cart'
              : isFrom.wishlist
                ? 'Please login to check wishlist'
                : undefined
          }
        />
      )}
    </>
  );
};

export default RecommendedProductsCard;
