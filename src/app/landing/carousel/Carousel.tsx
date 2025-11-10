"use client"

import Slider from 'react-slick';
import { useState } from 'react';
import "slick-carousel/slick/slick.css";
import { useSnackbar } from 'notistack';
import "slick-carousel/slick/slick-theme.css";

import { Box } from '@mui/material';

import { AddToCart } from 'src/api/cart';
import { useAuthToken } from 'src/auth/hooks';

import { Suggestion, } from 'src/types/product';

import RecommendedProductsCard from '../../cart/RecommendedProductsCard';
// ----------------------------------------------------------------------

interface CarouselProps {
    products: Suggestion[];
    direction: 'left' | 'right;'
}

const ProductCarousel: React.FC<CarouselProps> = ({ products, direction, }) => {
    // hookes 
    const { enqueueSnackbar } = useSnackbar()
    const token = useAuthToken()
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

    const addToCart = async (productId: string) => {
        try {
            const response = await AddToCart(token, productId)
            if (response.success) {
                enqueueSnackbar(response.message, { variant: "success" })
            }
        } catch (error) {
            console.log("Somthing want wrong", error)
        }
    };

    return (
        <Box sx={{ '.slick-slide': { paddingBlock: '4px' } }}>
            <Slider {...settings} >
                {products.map((product: Suggestion) => {
                    const producat = {
                        ...product,
                        image: product.primary_image?.image_url,
                        originalPrice: product.mrp,
                        id: product._id
                    }
                    return (
                        <Box key={product.id} sx={{ px: 3 }}>
                            <RecommendedProductsCard product={producat} addToCart={addToCart} addToWishlist={() => { }} showWishlistButton={false} />
                        </Box>
                    )
                })}
            </Slider>
        </Box>
    );
};

export default ProductCarousel;