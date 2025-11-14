'use client';

import { useState, useEffect } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { Address, CartItem } from 'src/types/cart';
import Iconify from 'src/components/iconify';
import {
  updateItemQuantity,
  removeItemFromCart,
  getAllAddress,
  getDefalutAddress,
  postNewAddress,
  placeOrder,
  CheckoutPayload,
} from 'src/api/cart';
import { useAuthToken } from 'src/auth/hooks';
import { aW } from '@fullcalendar/core/internal-common';
// ----------------------------------------------------------------------

// interface CartItem {
//   id: string;
//   name: string;
//   description: string;
//   material: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface Address {
//   id: string;
//   type: 'home' | 'office' | 'other';
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   isDefault: boolean;
// }

interface CheckoutPopupProps {
  open: boolean;
  onClose: () => void;
  cartData: CartItem[];
  onUpdateCart: (updatedCart: CartItem[]) => void;
  onCheckoutComplete: (orderData: any) => void;
}

const steps = ['Review Items', 'Select Address', 'Payment Method', 'Payment Details'];

const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives' },
  {
    value: 'upi',
    label: 'UPI Payment',
    description: 'Pay using UPI apps like PhonePe, Google Pay',
  },
  { value: 'credit', label: 'Credit Card', description: 'Visa, Mastercard, American Express' },
  { value: 'debit', label: 'Debit Card', description: 'Pay directly from your bank account' },
];

const onlinePaymentMethods = [
  { value: 'upi', label: 'UPI', icon: 'logos:phonepe' },
  { value: 'visa', label: 'Visa', icon: 'logos:visa' },
  { value: 'mastercard', label: 'Mastercard', icon: 'logos:mastercard' },
  { value: 'amex', label: 'American Express', icon: 'logos:american-express' },
];

export default function CheckoutPopup({
  open,
  onClose,
  cartData,
  onUpdateCart,
  onCheckoutComplete,
}: CheckoutPopupProps) {
  const token = useAuthToken();
  const [activeStep, setActiveStep] = useState(0);
  const [localCartData, setLocalCartData] = useState<CartItem[]>(cartData);
  const [alladdress, setAllAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState<string>('');
  const [isAddNewAddress, setIsAddNewAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    full_name: '',
    mobile_number: '',
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Payment form states
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const fecthAllAddressApi = async () => {
    try {
      const response = await getAllAddress(token);
      setAllAddresses(response.data.addresses);
      const defaultAddress = await getDefalutAddress(token);
      setSelectedAddress(defaultAddress.data.address);
    } catch (error) {
      console.log('somting went wrong', error);
    }
  };
  useEffect(() => {
    if (token) {
      fecthAllAddressApi();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Update local cart data when cartData prop changes
  useEffect(() => {
    setLocalCartData(cartData);
  }, [cartData]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  // Card number formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  // Expiry date formatting
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // CVV formatting
  const formatCVV = (value: string) =>
    value
      .replace(/\s+/g, '')
      .replace(/[^0-9]/gi, '')
      .substring(0, 4);

  // UPI ID validation
  const isValidUpiId = (upiIdValue: string) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiIdValue);
  };

  // Card validation
  const isValidCard = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
    const cardNumberDigits = cardNumber.replace(/\s/g, '');
    return (
      cardNumberDigits.length >= 13 &&
      cardNumberDigits.length <= 19 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0
    );
  };

  // Calculate totals
  const subtotal = localCartData.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = localCartData.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
     setLocalCartData(updatedCart);
    await updateItemQuantity(itemId, token, newQuantity);
   
    onUpdateCart(updatedCart);
  };

  const removeItem = async (itemId: string) => {
    const updatedCart = localCartData.filter((item) => item.id !== itemId);
    await removeItemFromCart(itemId, token);
    setLocalCartData(updatedCart);
    onUpdateCart(updatedCart);
  };

  const handleNext = () => {
    if (activeStep === 0 && localCartData.length === 0) {
      return; // Can't proceed with empty cart
    }
    if (activeStep === 1 && !selectedAddress) {
      return; // Must select address
    }
    if (activeStep === 2 && !paymentMethod) {
      return; // Must select payment method
    }
    if (activeStep === 3 && paymentMethod !== 'cod' && !onlinePaymentMethod) {
      return; // Must select online payment method
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setPaymentMethod('');
    setOnlinePaymentMethod('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addNewAddress = async () => {
    setIsAddNewAddress(true);
    const address: Address = {
      ...newAddress,
      is_default:true,
    } as Address;

    // In real app, save to backend
    try {
      const res = await postNewAddress(token, address);
      if (res.success) {
        setIsAddNewAddress(false);
        fecthAllAddressApi();
      }
    } catch (error) {
      console.log('somting went wrong', error);
    } finally {
      setIsAddNewAddress(false);
    }

    setSelectedAddress(address);
    setShowNewAddressForm(false);
    setNewAddress({
      full_name: '',
      mobile_number: '',
      address_line_1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
    });
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const orderData: CheckoutPayload = {
      cart_item_ids: localCartData.map((value) => value.id),
      shipping_address_id: selectedAddress!._id,
      payment_method: paymentMethod,

      // onlinePaymentMethod: paymentMethod !== 'cod' ? onlinePaymentMethod : null,
      // paymentDetails: (() => {
      //   if (paymentMethod === 'upi') {
      //     return { upiId };
      //   }
      //   if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      //     return {
      //       cardNumber: cardDetails.cardNumber.replace(/\s/g, '').slice(-4).padStart(cardDetails.cardNumber.replace(/\s/g, '').length, '*'),
      //       cardholderName: cardDetails.cardholderName,
      //       expiryDate: cardDetails.expiryDate,
      //     };
      //   }
      //   return null;
      // })(),
    };
    try {
      const res = await placeOrder(token, orderData);
      if (res.success) {
        setIsProcessing(false);
        onCheckoutComplete(orderData);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsProcessing(false);
    }

    handleClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Review your items ({localCartData.length} items)
            </Typography>

            {localCartData.length === 0 ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your cart is empty. Please add items before checkout.
              </Alert>
            ) : (
              <Stack spacing={2}>
                {localCartData.map((item) => (
                  <Card
                    key={item.id}
                    sx={{ p: 2, border: '1px solid rgba(100, 116, 139, 0.2)', boxShadow: 'none' }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <CardMedia
                          component="img"
                          height="80"
                          image={item.product.primary_image?.image_url}
                          alt={item.product.name}
                          sx={{ objectFit: 'cover', borderRadius: 1 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.product.category.name}
                        </Typography>
                        <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{display:'flex',alignItems:'center',gap:'20px'}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Iconify icon="eva:minus-outline" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                            }
                            size="small"
                            sx={{ width: 60 }}
                            inputProps={{ style: { textAlign: 'center' } }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Iconify icon="eva:plus-outline" />
                          </IconButton>
                          </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                <Card sx={{ p: 2, bgcolor: 'grey.50', boxShadow: 'none' }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Subtotal</Typography>
                      <Typography>{formatPrice(subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Shipping</Typography>
                      <Typography color="success.main">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Tax</Typography>
                      <Typography>{formatPrice(tax)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight="bold">
                        Total
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {formatPrice(total)}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Stack>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Select Delivery Address
            </Typography>
            <Stack spacing={2}>
              {alladdress.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Your address is empty. Please add address before checkout.
                </Alert>
              )}
              {alladdress.map((address) => (
                  <Card
                    key={address._id}
                    sx={{
                      p: 2,
                      boxShadow: 'none',
                      cursor: 'pointer',
                      border: selectedAddress?._id === address._id ? 2 : 1,
                      borderColor:
                        selectedAddress?._id === address._id ? 'primary.main' : 'grey.300',
                    }}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {address.full_name}
                          </Typography>
                          {/* <Chip
                          label={address.type}
                          size="small"
                          color={address.type === 'home' ? 'primary' : 'secondary'}
                        /> */}
                          {address.is_default && (
                            <Chip label="Default" size="small" color="success" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {address.formatted_address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.city}, {address.state} {address.postal_code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.mobile_number}
                        </Typography>
                      </Box>
                      <Radio
                        checked={selectedAddress?._id === address._id}
                        onChange={() => setSelectedAddress(address)}
                      />
                    </Box>
                  </Card>
                ))}
              {showNewAddressForm && (
                <Card sx={{ p: 3, mt: 2, boxShadow: 'none' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Add New Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          Full Name
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Full Name"
                          size="small"
                          value={newAddress.full_name}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, full_name: e.target.value })
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          Phone Number
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Phone Number"
                          size="small"
                          value={newAddress.mobile_number}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, mobile_number: e.target.value })
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          Address
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Address"
                          size="small"
                          multiline
                          rows={2}
                          value={newAddress.address_line_1}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, address_line_1: e.target.value })
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          City
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="City"
                          size="small"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          State
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="State"
                          size="small"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          ZIP Code
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="ZIP Code"
                          size="small"
                          value={newAddress.postal_code}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, postal_code: e.target.value })
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="subtitle2" fontWeight="medium" >
                            Country
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Country"
                            size="small"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          />
                        </Box>
                      </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={addNewAddress}
                          disabled={
                            !newAddress.address_line_1 ||
                            !newAddress.mobile_number ||
                            !newAddress.address_line_1 ||
                            isAddNewAddress
                          }
                        >
                          Add Address
                        </Button>
                        <Button variant="outlined" onClick={() => setShowNewAddressForm(false)}>
                          Cancel
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              )}
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() => setShowNewAddressForm(true)}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add New Address
              </Button>
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Select Payment Method
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Stack spacing={2}>
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.value}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: paymentMethod === method.value ? 2 : 1,
                        borderColor: paymentMethod === method.value ? 'primary.main' : 'grey.300',
                        boxShadow: 'none',
                      }}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Radio
                          checked={paymentMethod === method.value}
                          onChange={() => setPaymentMethod(method.value)}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {method.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 3:
        if (paymentMethod === 'cod') {
          return (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Cash on Delivery
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                You will pay {formatPrice(total)} when your order arrives at the selected address.
              </Alert>
              <Card sx={{ p: 3, boxShadow: 'none', border: '1px solid rgba(100, 116, 139, 0.4)' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Order Summary
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Items ({localCartData.length})</Typography>
                    <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2" color="success.main">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">{formatPrice(tax)}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {formatPrice(total)}
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Delivery to: {selectedAddress?.formatted_address}, {selectedAddress?.city}
                </Typography>
              </Card>
            </Box>
          );
        }

        if (paymentMethod === 'upi') {
          return (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                UPI Payment
              </Typography>

              <Card
                sx={{
                  p: 3,
                  mb: 3,
                  boxShadow: 'none',
                  border: '1px solid rgba(100, 116, 139, 0.4)',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 0.5 }}>
                    Enter UPI ID
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="yourname@paytm or yourname@phonepe"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    error={upiId.length > 0 && !isValidUpiId(upiId)}
                    helperText={
                      upiId.length > 0 && !isValidUpiId(upiId)
                        ? 'Please enter a valid UPI ID'
                        : 'Enter your UPI ID (e.g., yourname@paytm)'
                    }
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You will be redirected to your UPI app to complete the payment of{' '}
                  {formatPrice(total)}.
                </Alert>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Iconify icon="eva:shield-outline" color="success.main" />
                  <Typography variant="body2" color="text.secondary">
                    Secure payment powered by UPI
                  </Typography>
                </Box>
              </Card>

              <Card sx={{ p: 2, bgcolor: 'grey.50', boxShadow: 'none' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Payment Amount
                </Typography>
                <Typography variant="h5" color="primary.main">
                  {formatPrice(total)}
                </Typography>
              </Card>
            </Box>
          );
        }

        if (paymentMethod === 'credit' || paymentMethod === 'debit') {
          return (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {paymentMethod === 'credit' ? 'Credit Card' : 'Debit Card'} Payment
              </Typography>

              <Card
                sx={{
                  p: 3,
                  mb: 3,
                  boxShadow: 'none',
                  border: '1px solid rgba(100, 116, 139, 0.4)',
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                  Card Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Card Number
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        error={
                          cardDetails.cardNumber.length > 0 &&
                          cardDetails.cardNumber.replace(/\s/g, '').length < 13
                        }
                        helperText={
                          cardDetails.cardNumber.length > 0 &&
                          cardDetails.cardNumber.replace(/\s/g, '').length < 13
                            ? 'Please enter a valid card number'
                            : ''
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Card Holder
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="John Doe"
                        value={cardDetails.cardholderName}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cardholderName: e.target.value })
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Expiry Date
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiryDate: formatExpiryDate(e.target.value),
                          })
                        }
                        error={
                          cardDetails.expiryDate.length > 0 && cardDetails.expiryDate.length !== 5
                        }
                        helperText={
                          cardDetails.expiryDate.length > 0 && cardDetails.expiryDate.length !== 5
                            ? 'MM/YY format'
                            : ''
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        CVV
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cvv: formatCVV(e.target.value) })
                        }
                        error={cardDetails.cvv.length > 0 && cardDetails.cvv.length < 3}
                        helperText={
                          cardDetails.cvv.length > 0 && cardDetails.cvv.length < 3
                            ? '3-4 digits'
                            : ''
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
                  Your card details are encrypted and secure. We do not store your card information.
                </Alert>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Iconify icon="eva:shield-outline" color="success.main" />
                  <Typography variant="body2" color="text.secondary">
                    Secured by 256-bit SSL encryption
                  </Typography>
                </Box>
              </Card>

              <Card sx={{ p: 2, bgcolor: 'grey.50', boxShadow: 'none' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Payment Amount
                </Typography>
                <Typography variant="h5" color="primary.main">
                  {formatPrice(total)}
                </Typography>
              </Card>
            </Box>
          );
        }

        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Select Payment Option
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={onlinePaymentMethod}
                onChange={(e) => setOnlinePaymentMethod(e.target.value)}
              >
                <Grid container spacing={2}>
                  {onlinePaymentMethods.map((method) => (
                    <Grid item xs={6} sm={3} key={method.value}>
                      <Card
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          boxShadow: 'none',
                          textAlign: 'center',
                          border: onlinePaymentMethod === method.value ? 2 : 1,
                          borderColor:
                            onlinePaymentMethod === method.value ? 'primary.main' : 'grey.300',
                        }}
                        onClick={() => setOnlinePaymentMethod(method.value)}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Radio
                            checked={onlinePaymentMethod === method.value}
                            onChange={() => setOnlinePaymentMethod(method.value)}
                          />
                          <Iconify icon={method.icon} width={40} height={40} />
                          <Typography variant="body2" fontWeight="bold">
                            {method.label}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            {onlinePaymentMethod && (
              <Card sx={{ p: 3, mt: 3, boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment Details
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You will be redirected to a secure payment page to complete your{' '}
                  {onlinePaymentMethod.toUpperCase()} payment.
                </Typography>
                <Typography variant="h6" color="primary.main">
                  Amount: {formatPrice(total)}
                </Typography>
              </Card>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepOptional = (step: number) => step === 3 && paymentMethod === 'cod';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2">
            Checkout
          </Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                optional={
                  isStepOptional(index) ? <Typography variant="caption">Optional</Typography> : null
                }
              >
                {label}
              </StepLabel>
              <StepContent>
                {renderStepContent(index)}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleCheckout : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={
                        (index === 0 && localCartData.length === 0) ||
                        (index === 1 && !selectedAddress) ||
                        (index === 2 && !paymentMethod) ||
                        (index === 3 &&
                          paymentMethod === 'upi' &&
                          (!upiId || !isValidUpiId(upiId))) ||
                        (index === 3 &&
                          (paymentMethod === 'credit' || paymentMethod === 'debit') &&
                          !isValidCard()) ||
                        (index === 3 &&
                          paymentMethod !== 'cod' &&
                          paymentMethod !== 'upi' &&
                          paymentMethod !== 'credit' &&
                          paymentMethod !== 'debit' &&
                          !onlinePaymentMethod) ||
                        isProcessing
                      }
                    >
                      {(() => {
                        if (isProcessing) {
                          return <CircularProgress size={20} color="inherit" />;
                        }
                        if (index === steps.length - 1) {
                          return 'Complete Order';
                        }
                        return 'Next';
                      })()}
                    </Button>
                    <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={isProcessing}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
