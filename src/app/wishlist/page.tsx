'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Pagination,
  useTheme,
  Chip,
  Rating,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Import product data
import Iconify from 'src/components/iconify';
import { IProductItem } from 'src/types/product';
import productData from '../../../Product.json';

// ----------------------------------------------------------------------

const filterOptions = [
  { value: 'newest', label: 'Newest First', isSelected: false },
  { value: 'price-low', label: 'Price: Low to High', isSelected: false },
  { value: 'price-high', label: 'Price: High to Low', isSelected: false },
  { value: 'rating', label: 'Highest Rated', isSelected: false },
  { value: 'popular', label: 'Most Popular', isSelected: false },
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
  const [animate, setAnimate] = useState('');
  // Get unique categories from the data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(productData.map(product => product.category)));
    return ['All', ...uniqueCategories];
  }, []);


  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = productData.filter(product => {
      const matchesWishlist = product.wishlist === true;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesWishlist && matchesSearch && matchesCategory;
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
        <Box>


          {/* Products Grid */}
          {currentProducts.length > 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: 'none',
                        border: '1px solid #E0E0E0',
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
                            // padding: 1,
                            zIndex: 10,
                            minWidth: 36,
                            minHeight: 36,
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
                              right: 8,
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
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              {/* View more products */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Button variant="outlined" onClick={() => router.push(paths.user.products.root)}>
                  View more products
                </Button>
              </Box>
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
