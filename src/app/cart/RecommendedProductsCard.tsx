import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material'
import Iconify from 'src/components/iconify'

const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).format(price);

const RecommendedProductsCard = ({ product, addToCart }: { product: any, addToCart: (product: any) => void }) => {
    return (
        <>
            <Card sx={{ height: '100%' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1rem' }}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.collection}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                            {formatPrice(product.price)}
                        </Typography>
                        {product.originalPrice && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                {formatPrice(product.originalPrice)}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        onClick={() => addToCart(product.id)}
                        startIcon={<Iconify icon="eva:shopping-cart-outline" />}
                    >
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}

export default RecommendedProductsCard