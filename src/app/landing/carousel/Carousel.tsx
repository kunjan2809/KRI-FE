"use client"

import Slider from 'react-slick';
import { useState } from 'react';
import { Box } from '@mui/material';
import { IProductItem } from 'src/types/product';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecommendedProductsCard from '../../cart/RecommendedProductsCard';


// ----------------------------------------------------------------------

interface CarouselProps {
    products: IProductItem[];
    direction: 'left' | 'right';
}

const ProductCarousel: React.FC<CarouselProps> = ({
    products,
    direction,
}) => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 3000,
        autoplaySpeed: 0,
        cssEase: "linear",
        rtl: direction === 'right',
        arrows: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <Box sx={{ '.slick-slide': {paddingBlock: '4px' } }}>
            <Slider {...settings} >
                {products.map((product: IProductItem) => (
                    <Box key={product.id} sx={{ px: 3 }}>
                        <RecommendedProductsCard product={product} addToCart={() => { }} addToWishlist={() => { }} showWishlistButton={false} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default ProductCarousel;