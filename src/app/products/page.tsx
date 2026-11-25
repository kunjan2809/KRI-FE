'use client';

import React, { useState, useEffect, useMemo } from 'react';

import {
  Box,
  Grid,
  Card,
  Chip,
  List,
  Link,
  Stack,
  Radio,
  Button,
  Rating,
  Slider,
  MenuItem,
  Collapse,
  Checkbox,
  ListItem,
  Container,
  CardMedia,
  Typography,
  InputLabel,
  Pagination,
  CardContent,
  FormControl,
  FilledInput,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  InputAdornment,
  ListItemButton,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

import { AddToCart } from 'src/api/cart';
import { useAuthToken } from 'src/auth/hooks';
import { useGetCategories, useGetVariation } from 'src/api/category';
import { getProduct, GetProductParama } from 'src/api/product';
import { addWishlist, removeWishlist } from 'src/api/wishlist';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// Import product data

import ProductPageSort from 'src/sections/product/productPage-sort';
import { ProductCardSkeleton } from 'src/sections/product/product-skeleton';

import { Product, PaginationPayload } from 'src/types/product';
import { VariationOption } from 'src/types/category';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import LoginPopup from '../landing/loginPopup/AuthPopup';

const filterExpandedOptions = [
  { value: 'category', label: 'Category', isExpanded: true },
  { value: 'price', label: 'Price', isExpanded: true },
  { value: 'colours', label: 'Colours', isExpanded: true },
];

const filterOptions = [
  { value: 'newest_first', label: 'Newest First', isSelected: false },
  { value: 'low_to_high', label: 'Price: Low to High', isSelected: false },
  { value: 'highest_rated', label: 'Highest Rated', isSelected: false },
];
// filterOptions interface
interface Filter {
  value: string;
  isSelected: boolean;
  label: string;
}

export default function ProductsPage() {
  const { categories } = useGetCategories();
  const { variation } = useGetVariation();
  // hookes
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated } = useAuthContext();
  const token = useAuthToken();

  const [isProductLoading, setIsProductLoading] = useState(true);
  const [productData, setProductData] = useState<Product[]>([]);
  const [pagenation, setPagenation] = useState<PaginationPayload | null>(null);
  const [productFilters, setProductFilters] = useState(filterOptions);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    color: [] as string[],
    priceRange: [0, 1000],
    currentPage: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(filterExpandedOptions);
  const [animate, setAnimate] = useState('');
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isFrom, setIsFrom] = useState({ cart: false, wishlist: false });

  // gobal genric function for filters
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function for setparms value for all filter
  const setUrlParmas = (update: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(update).forEach(([key, value]) => {
      if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        value.map((e, index) => (index === 0 ? params.set(key, e) : params.append(key, e)));
      } else {
        params.set(key, String(value));
      }
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilter = (filter: Filter) => {
    const { value, isSelected } = filter;
    const newParams: Record<string, any> = {};
    switch (value) {
      case 'newest_first':
      case 'highest_rated':
        newParams[value] = isSelected ? null : true;
        break;

      default:
        newParams.price_sort = isSelected ? '' : value;
        break;
    }
    setUrlParmas(newParams);
    setProductFilters((prev) =>
      prev.map((f) => (f.value === value ? { ...f, isSelected: !f.isSelected } : f))
    );
  };

  const handleSliderChangeCommitted = (newValue: number[]) => {
    updateFilter('priceRange', newValue);
    setUrlParmas({ min_price: newValue[0].toString(), max_price: newValue[1].toString() });
  };

  const handlePriceRangeChange = (index: number, value: string) => {
    const newmaricValue = Number(value);
    setFilters((prev) => {
      const newpricevalue = [...prev.priceRange];
      newpricevalue[index] = newmaricValue;
      return {
        ...prev,
        priceRange: newpricevalue,
      };
    });
  };

  const handleCategory = (category_Id: string) => {
    const updatedCtegory =
      filters.category === category_Id ? (filters.category = '') : (filters.category = category_Id);
    updateFilter('category', updatedCtegory);
    setUrlParmas({ categoryId: updatedCtegory });
  };

  const handleCheckBox = (color: string) => {
    const updateColor = filters.color.includes(color)
      ? filters.color.filter((c) => c !== color)
      : [...filters.color, color];
    updateFilter('color', updateColor);
    setUrlParmas({ color: updateColor });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(value));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToWishlist = async (event: React.MouseEvent<HTMLDivElement>, product: Product) => {
    event.stopPropagation();
    if (!authenticated) {
      setIsFrom((prev) => ({ ...prev, wishlist: true }));
      setLoginPopupOpen(true);
    } else {
      setAnimate(product._id);
      if (product.is_in_wishlist) {
        await removeWishlist(product._id, token);
        product.is_in_wishlist = false;
      } else {
        await addWishlist(product._id, token);
        product.is_in_wishlist = true;
      }
      setTimeout(() => setAnimate(''), 500);
    }
  };

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: string,
    variationId: string
  ) => {
    event.stopPropagation();
    try {
      const response = variationId ? await AddToCart(token, productId, variationId) : await AddToCart(token, productId) 
      if (response.success) {
        enqueueSnackbar(response.message, { variant: 'success' });
      }
    } catch (error) {
      console.log('Somthing get wrong', error);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(paths.user.products.details(productId));
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterExpanded = (filter: string) => {
    setFilterExpanded(
      filterExpanded.map((f) => (f.value === filter ? { ...f, isExpanded: !f.isExpanded } : f))
    );
  };

  const handleResetFilters = () => {
    router.push(`${pathname}`);
    setFilters(filters);
  };

  const handleLoginPopupClose = (): void => {
    setLoginPopupOpen(false);
    setIsFrom((prev) => ({ ...prev, cart: false, wishlist: false }));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  // Fetching Product...
  const fetchProduct = async () => {
    setIsProductLoading(true);
    try {
      let queryParams: GetProductParama = {};

      const newestFirst = productFilters.find(
        (item) => item.value === 'newest_first' && item.isSelected === true
      );
      if (newestFirst) queryParams.newest_first = true;

      const higestRated = productFilters.find(
        (item) => item.value === 'highest_rated' && item.isSelected === true
      );
      if (higestRated) queryParams.highest_rated = true;

      const priceSort = productFilters.find(
        (item) => item.value === 'low_to_high' && item.isSelected === true
      );
      if (priceSort) queryParams.price_sort = 'low_to_high';
      // Send the query to api

      queryParams = {
        ...queryParams,
        category_id: filters.category,
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        page: filters.currentPage,
        search: filters.searchTerm,
        color: filters.color.toString(),
      };
      const response = await getProduct(token, queryParams);
      if (response.success) {
        setIsProductLoading(false);
        setProductData(response.data.products);
        setPagenation(response.data.pagination);
      }
    } finally {
      setIsProductLoading(false);
    }
  };

  useEffect(() => {
    const search = searchParams.get('searchStr') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const colors = searchParams.getAll('color');
    const page = Number(searchParams.get('page')) || 1;
    const minPrice = Number(searchParams.get('min_price')) || 0;
    const maxPrice = Number(searchParams.get('max_price')) || 1000;
    setFilters({
      searchTerm: search,
      category: categoryId,
      color: colors,
      currentPage: page,
      priceRange: [minPrice, maxPrice],
    });

    const newestFirst = Boolean(searchParams.get('newest_first')) || false;
    const priceSort = searchParams.get('price_sort') || '';
    const higestRated = Boolean(searchParams.get('highest_rated')) || false;

    setProductFilters((prev) => {
      let tmpState = [...prev];

      tmpState = tmpState.map((item) => {
        if (item.value === 'newest_first') {
          return {
            ...item,
            isSelected: newestFirst,
          };
        }
        if (item.value === 'highest_rated') {
          return {
            ...item,
            isSelected: higestRated,
          };
        }
        if (item.value === 'low_to_high') {
          return {
            ...item,
            isSelected: priceSort.includes('low_to_high'),
          };
        }
        return item;
      });

      return tmpState;
    });
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProduct();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, productFilters]);

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: showFilters ? '20%' : '0%',
              minWidth: showFilters ? '200px' : '0',
              pr: 4,
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {showFilters && (
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                      Filters
                    </Typography>
                    <Link
                      underline="hover"
                      sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'text.secondary' }}
                      onClick={() => handleResetFilters()}
                    >
                      Reset
                    </Link>
                  </Box>
                }
              >
                <ListItemButton
                  onClick={() => handleFilterExpanded('category')}
                  sx={{ justifyContent: 'space-between', borderRadius: '8px' }}
                >
                  <ListItemText primary="Category" />
                  <Iconify
                    icon={
                      filterExpanded.find((f) => f.value === 'category')?.isExpanded
                        ? 'eva:arrow-ios-upward-fill'
                        : 'eva:arrow-ios-downward-fill'
                    }
                  />
                </ListItemButton>
                <Collapse
                  in={filterExpanded.find((f) => f.value === 'category')?.isExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  {categories.map((category) => (
                    <List component="div" disablePadding key={category._id}>
                      <ListItemButton
                        selected={filters.category === category._id}
                        sx={{ pl: 4, borderRadius: '8px' }}
                        onClick={() => handleCategory(category._id)}
                      >
                        <ListItemText primary={category.name} />
                      </ListItemButton>
                    </List>
                  ))}
                </Collapse>
                <ListItemButton
                  onClick={() => handleFilterExpanded('price')}
                  sx={{ justifyContent: 'space-between', mt: 1, borderRadius: '8px' }}
                >
                  <ListItemText primary="Price" />
                  <Iconify
                    icon={
                      filterExpanded.find((f) => f.value === 'price')?.isExpanded
                        ? 'eva:arrow-ios-upward-fill'
                        : 'eva:arrow-ios-downward-fill'
                    }
                  />
                </ListItemButton>
                <Collapse
                  in={filterExpanded.find((f) => f.value === 'price')?.isExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      px: 4,
                      '.MuiSlider-colorPrimary': {
                        color: '#212B36',
                      },
                    }}
                  >
                    <Slider
                      min={0}
                      max={2000}
                      step={10}
                      getAriaLabel={() => 'Price range'}
                      value={filters.priceRange}
                      sx={{}}
                      onChange={(event, newValue) =>
                        updateFilter('priceRange', newValue as number[])
                      }
                      onChangeCommitted={(event, newvalue) =>
                        handleSliderChangeCommitted(newvalue as number[])
                      }
                      valueLabelDisplay="auto"
                      getAriaValueText={() =>
                        `${filters.priceRange[0]} - ${filters.priceRange[1]} $`
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="filled-min-price">Min Price</InputLabel>
                        <FilledInput
                          id="filled-min-price"
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          value={filters.priceRange[0]}
                          type="number"
                          onChange={(event) => {
                            handlePriceRangeChange(0, event.target.value);
                          }}
                          inputProps={{
                            min: 0,
                            max: 1000,
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="filled-max-price">Max Price</InputLabel>
                        <FilledInput
                          id="filled-max-price"
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          value={filters.priceRange[1]}
                          type="number"
                          onChange={(event) => {
                            handlePriceRangeChange(1, event.target.value);
                          }}
                          inputProps={{
                            min: 0,
                            max: 1000,
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Box>
                </Collapse>
                <ListItemButton
                  onClick={() => handleFilterExpanded('colours')}
                  sx={{ justifyContent: 'space-between', mt: 1, borderRadius: '8px' }}
                >
                  <ListItemText primary="Colors" />
                  <Iconify
                    icon={
                      filterExpanded.find((f) => f.value === 'colours')?.isExpanded
                        ? 'eva:arrow-ios-upward-fill'
                        : 'eva:arrow-ios-downward-fill'
                    }
                  />
                </ListItemButton>
                <Collapse
                  in={filterExpanded.find((f) => f.value === 'colours')?.isExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <div role="group" aria-labelledby="colours-group">
                    <List
                      sx={{
                        '.MuiButtonBase-root, .MuiSvgIcon-fontSizeSmall ': {
                          color: '#212B36',
                        },
                      }}
                    >
                      {variation?.colors?.map((color) => (
                        <ListItem sx={{ py: 0 }}>
                          <Checkbox
                            checked={filters.color.includes(color)}
                            onChange={() => handleCheckBox(color)}
                          />
                          <ListItemText primary={color} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Collapse>
              </List>
            )}
          </Box>
          <Box sx={{ width: showFilters ? '80%' : '100%', transition: 'width 0.3s ease-in-out' }}>
            {/* Search and Filters */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
            >
              <Stack direction="row" spacing={1} flexShrink={0} gap={2}>
                {showFilters ? (
                  <Chip
                    key={1}
                    label="Hide filters"
                    icon={<Iconify icon="eva:funnel-outline" />}
                    onClick={() => handleShowFilters()}
                    onDelete={() => handleShowFilters()}
                  />
                ) : (
                  <Chip
                    key={1}
                    label="Show filters"
                    icon={<Iconify icon="eva:funnel-outline" />}
                    variant="outlined"
                    onClick={() => handleShowFilters()}
                  />
                )}

                {productFilters.map((filter) =>
                  filter.isSelected ? (
                    <Chip
                      key={filter.value}
                      label={filter.label}
                      onClick={() => handleFilter(filter)}
                      onDelete={() => handleFilter(filter)}
                    />
                  ) : (
                    <Chip
                      key={filter.value}
                      label={filter.label}
                      variant="outlined"
                      onClick={() => handleFilter(filter)}
                    />
                  )
                )}
              </Stack>
              <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {productData.length} items
                </Typography>
                <ProductPageSort onSort={handleFilter} sortOptions={productFilters} />
              </Box>
            </Box>
            <>
              {/* Products Grid */}

              {isProductLoading ? (
                <ProductCardSkeleton colCount={showFilters ? 3 : 4} />
              ) : (
                <>
                  {productData.length > 0 ? (
                    <>
                      {isProductLoading ? (
                        <ProductCardSkeleton colCount={showFilters ? 3 : 4} />
                      ) : (
                        <>
                          <Grid container spacing={3} sx={{ mb: 4 }}>
                            {productData.map((product) => (
                              <Grid
                                item
                                xs={12}
                                sm={showFilters ? 12 : 6}
                                md={showFilters ? 6 : 4}
                                lg={showFilters ? 4 : 3}
                                key={product._id}
                              >
                                <Card
                                  sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    border: '1px solid #E0E0E0',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                    },
                                    '.add-wishlist-btn': {
                                      ...(product.is_in_wishlist
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
                                  onClick={() => handleProductClick(product._id)}
                                >
                                  <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                      component="img"
                                      height="250"
                                      image={
                                        product.primary_image
                                          ? product.primary_image.image_url
                                          : 'https://nraasmart.orderz.app/images/item_placeholder.jpg'
                                      }
                                      alt={product.name}
                                      sx={{ objectFit: 'cover' }}
                                    />
                                    <Box
                                      className="add-wishlist-btn"
                                      onClick={(event) =>
                                        handleAddToWishlist(event, product as Product)
                                      }
                                      sx={{
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                        zIndex: 10,
                                        width: 36,
                                        height: 36,
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
                                          ...(product.is_in_wishlist && {
                                            transition: 'color 0.3s ease',
                                            color: 'red',
                                            stroke: 'red',
                                          }),
                                          ...(animate === product._id && {
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
                                    {/* {product.newLabel?.enabled && (
                            <Chip
                              label={product.newLabel.content}
                              color="primary"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                fontWeight: 'bold',
                                backgroundColor: '#212B36',
                              }}
                            />
                          )}
                          {product.saleLabel?.enabled && (
                            <Chip
                              label={product.saleLabel.content}
                              color="error"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                fontWeight: 'bold',
                              }}
                            />
                          )} */}
                                  </Box>
                                  <CardContent sx={{ p: 2 }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mb: 1 }}
                                    >
                                      {product.category_name}
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      component="h3"
                                      sx={{ mb: 1, lineHeight: 1.3, fontSize: '1rem' }}
                                    >
                                      {product.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Rating
                                        value={product.average_rating}
                                        size="small"
                                        readOnly
                                        sx={{ mr: 1 }}
                                      />
                                      <Typography variant="body2" color="text.secondary">
                                        ({product.total_reviews})
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="h6"
                                        color="primary.main"
                                        fontWeight="bold"
                                      >
                                        {formatPrice(product.price)}
                                      </Typography>
                                    </Box>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 1, fontSize: '0.875rem' }}
                                    >
                                      {0} sold
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 1,
                                      }}
                                    >
                                      <Button
                                        variant="outlined"
                                        onClick={(event) =>
                                          handleAddToCart(
                                            event,
                                            product._id,
                                            product?.variations[0]?._id
                                          )
                                        }
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                      >
                                        <Iconify icon="eva:shopping-cart-outline" width={20} />
                                        Add to cart
                                      </Button>

                                      <Button
                                        variant="contained"
                                        onClick={() => handleProductClick(product._id)}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                      >
                                        <Iconify icon="eva:eye-outline" width={20} />
                                        view product
                                      </Button>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>

                          {/* Pagination */}
                          {pagenation!.total_pages > 1 && (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                mt: 4,
                              }}
                            >
                              <Pagination
                                count={pagenation?.total_pages}
                                page={filters.currentPage}
                                onChange={handlePageChange}
                                size="large"
                                showFirstButton
                                showLastButton
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                        No products found
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Try adjusting your search or filter criteria
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </>
          </Box>
        </Box>
      </Container>
      {loginPopupOpen && (
        <LoginPopup
          open={loginPopupOpen}
          onClose={handleLoginPopupClose}
          title={isFrom.cart || isFrom.wishlist ? 'Login' : undefined}
          description={
            isFrom.cart
              ? 'Please  login to check cart'
              : isFrom.wishlist
                ? 'Please login to check wishlist'
                : undefined
          }
        />
      )}
    </>
  );
}
