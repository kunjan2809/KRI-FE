'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
  useTheme,
  InputAdornment,
  Chip,
  Rating,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
  Checkbox,
  ListItem,
  Slider,
  FilledInput,
  FormControlLabel,
  Radio,
  Link,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Import product data
import ProductSort from 'src/sections/product/product-sort';
import Iconify from 'src/components/iconify';
import { IProductItem } from 'src/types/product';
import productData from '../../../Product.json';

// ----------------------------------------------------------------------

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const filterOptions = [
  { value: 'newest', label: 'Newest First', isSelected: false },
  { value: 'price-low', label: 'Price: Low to High', isSelected: false },
  { value: 'price-high', label: 'Price: High to Low', isSelected: false },
  { value: 'rating', label: 'Highest Rated', isSelected: false },
  { value: 'popular', label: 'Most Popular', isSelected: false },
];
const filterExpandedOptions = [
  { value: 'category', label: 'Category', isExpanded: true },
  { value: 'price', label: 'Price', isExpanded: true },
  { value: 'colours', label: 'Colours', isExpanded: true },
];
export default function ProductsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [productFilters, setProductFilters] = useState(filterOptions);
  const [showFilters, setShowFilters] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(filterExpandedOptions);
  const [filterPriceValue, setFilterPriceValue] = useState([0, 1000]);
  const [animate, setAnimate] = useState('');
  // Get unique categories from the data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(productData.map(product => product.category)));
    return ['All', ...uniqueCategories];
  }, []);


  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = productData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.totalRatings - a.totalRatings);
        break;
      case 'popular':
        filtered.sort((a, b) => b.totalSold - a.totalSold);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handleProductClick = (productId: string) => {
    router.push(paths.user.products.details(productId));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
  };

  const handleAddToWishlist = (event: React.MouseEvent<HTMLDivElement>, product: IProductItem) => {
    event.stopPropagation();
    setAnimate(product.id);
    if (product.wishlist) {
      product.wishlist = false;
    } else {
      product.wishlist = true;
    }
    setTimeout(() => setAnimate(''), 500);
  };

  const handleAddToCart = (productId: string) => {
    console.log('Adding to cart:', productId);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleFilter = (filter: string) => {
    setProductFilters(productFilters.map(f => f.value === filter ? { ...f, isSelected: !f.isSelected } : f));
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterExpanded = (filter: string) => {
    setFilterExpanded(filterExpanded.map(f => f.value === filter ? { ...f, isExpanded: !f.isExpanded } : f));
  };

  const handleResetFilters = () => {
    setFilterExpanded(filterExpandedOptions);
    setFilterPriceValue([0, 1000]);
    setProductFilters(filterOptions);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      {/* <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Discover Unique Products
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Explore our curated collection of handcrafted and unique items from talented creators
        </Typography>
      </Box> */}
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 1, width: showFilters ? '20%' : '0%', minWidth: showFilters ? '200px' : '0', pr: 4, transition: 'all 0.3s ease-in-out' }}>
          {showFilters && (
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    Filters
                  </Typography>
                  <Link underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'text.secondary' }} onClick={() => handleResetFilters()}>
                    Reset
                  </Link>
                </Box>
              }
            >
              <ListItemButton onClick={() => handleFilterExpanded('category')} sx={{ justifyContent: 'space-between', borderRadius: '8px' }}>
                <ListItemText primary="Category" />
                <Iconify
                  icon={filterExpanded.find(f => f.value === 'category')?.isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                />
              </ListItemButton>
              <Collapse in={filterExpanded.find(f => f.value === 'category')?.isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4, borderRadius: '8px' }}>
                    <ListItemText primary="All categories" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4, borderRadius: '8px' }}>
                    <ListItemText primary="Jewellery" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4, borderRadius: '8px' }}>
                    <ListItemText primary="Weddings" />
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItemButton onClick={() => handleFilterExpanded('price')} sx={{ justifyContent: 'space-between', mt: 1, borderRadius: '8px' }}>
                <ListItemText primary="Price" />
                <Iconify
                  icon={filterExpanded.find(f => f.value === 'price')?.isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                />
              </ListItemButton>
              <Collapse in={filterExpanded.find(f => f.value === 'price')?.isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{
                  display: 'flex', flexDirection: 'column', px: 4,
                  '.MuiSlider-colorPrimary': {
                    color: '#212B36',
                  }
                }}>
                  <Slider
                    min={0}
                    max={2000}
                    step={10}
                    getAriaLabel={() => 'Price range'}
                    value={filterPriceValue}
                    sx={{
                    }}
                    onChange={(event, newValue) => setFilterPriceValue(newValue as number[])}
                    valueLabelDisplay="auto"
                    getAriaValueText={() => `${filterPriceValue[0]} - ${filterPriceValue[1]} $`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel htmlFor="filled-min-price">Min Price</InputLabel>
                      <FilledInput
                        id="filled-min-price"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        value={filterPriceValue[0]}
                        type="number"
                        onChange={(event) => setFilterPriceValue([Number(event.target.value), filterPriceValue[1]])}
                        inputProps={{
                          min: 0,
                          max: 2000,
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth variant="filled">
                      <InputLabel htmlFor="filled-max-price">Max Price</InputLabel>
                      <FilledInput
                        id="filled-max-price"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        value={filterPriceValue[1]}
                        type="number"
                        onChange={(event) => setFilterPriceValue([filterPriceValue[0], Number(event.target.value)])}
                        inputProps={{
                          min: 0,
                          max: 2000,
                        }}
                      />
                    </FormControl>
                  </Box>
                </Box>
              </Collapse>
              <ListItemButton onClick={() => handleFilterExpanded('colours')} sx={{ justifyContent: 'space-between', mt: 1, borderRadius: '8px' }}>
                <ListItemText primary="Colours" />
                <Iconify
                  icon={filterExpanded.find(f => f.value === 'colours')?.isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                />
              </ListItemButton>
              <Collapse in={filterExpanded.find(f => f.value === 'colours')?.isExpanded} timeout="auto" unmountOnExit>
                <div role="group" aria-labelledby="colours-group">
                  <List sx={{
                    '.MuiButtonBase-root, .MuiSvgIcon-fontSizeSmall ': {
                      color: '#212B36',
                    }
                  }}>
                    <ListItem sx={{ py: 0 }}>
                      <Checkbox defaultChecked />
                      <ListItemText primary="Red" />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                      <Checkbox />
                      <ListItemText primary="Blue" />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                      <Checkbox />
                      <ListItemText primary="Green" />
                    </ListItem>
                  </List>
                </div>
              </Collapse>
            </List>
          )}
        </Box>
        <Box sx={{ width: showFilters ? '80%' : '100%', transition: 'width 0.3s ease-in-out' }}>
          {/* Search and Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Stack direction="row" spacing={1} flexShrink={0} gap={2}>
              {showFilters ?
                (
                  <Chip
                    key={1}
                    label="Hide filters"
                    onClick={() => handleShowFilters()}
                    onDelete={() => handleShowFilters()}
                  />
                ) :
                (
                  <Chip
                    key={1}
                    label="Show filters"
                    variant="outlined"
                    onClick={() => handleShowFilters()}
                  />
                )}
              {productFilters.map((filter) => (
                filter.isSelected ?
                  (
                    <Chip
                      key={filter.value}
                      label={filter.label}
                      onClick={() => handleFilter(filter.value)}
                      onDelete={() => handleFilter(filter.value)}
                    />
                  ) :
                  (
                    <Chip
                      key={filter.value}
                      label={filter.label}
                      variant="outlined"
                      onClick={() => handleFilter(filter.value)}
                    />
                  )
              ))}
            </Stack>
            <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredAndSortedProducts.length} items
              </Typography>
              <ProductSort sort={sortBy} onSort={setSortBy} sortOptions={sortOptions} />
            </Box>
          </Box>

          {/* Products Grid */}
          {currentProducts.length > 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={showFilters ? 12 : 6} md={showFilters ? 6 : 4} lg={showFilters ? 4 : 3} key={product.id}>
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
                          ...(product.wishlist ? {
                            opacity: 1,
                            top: 5,
                            right: 5,
                            transition: 'all 0.1s ease',
                          } : {
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
                      onClick={() => handleProductClick(product.id)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={product.coverUrl}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box
                          className='add-wishlist-btn'
                          onClick={(event) => handleAddToWishlist(event, product as IProductItem)}
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
                            'svg': {
                              transition: 'transform 0.3s ease, color 0.3s ease',
                              color: 'white',
                              stroke: '#212B36',
                              ...(product.wishlist && {
                                transition: 'color 0.3s ease',
                                color: 'red',
                                stroke: 'red',
                              }),
                              ...(animate === product.id && {
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
                        {product.newLabel?.enabled && (
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
                        )}
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.category}
                        </Typography>
                        <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3, fontSize: '1rem' }}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.totalRatings} size="small" readOnly sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            ({product.totalReviews})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            {formatPrice(product.price)}
                          </Typography>
                          {product.priceSale && product.priceSale !== product.price && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              {formatPrice(product.priceSale)}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {product.tags.slice(0, 2).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
                          {product.totalSold} sold
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Button variant="outlined" onClick={() => handleAddToCart(product.id)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Iconify icon="eva:shopping-cart-outline" width={20} />
                            Add to cart
                          </Button>

                          <Button variant="contained" onClick={() => handleProductClick(product.id)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
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
        </Box>
      </Box>
    </Container>
  );
}
