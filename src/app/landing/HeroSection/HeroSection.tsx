
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import bgImage from '../../../../public/assets/hero-section.webp';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
const HeroSection = () => {
    const router = useRouter();
    return (
        <Box
            sx={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #000000)',
            }}
        >
            {/* Background Image with Jewelry */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        width: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url(${bgImage.src})`,
                    }}
                >
                    {/* Luxury Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, rgba(0,0,0,0.2))',
                        }}
                    />
                </Box>
            </Box>

            {/* Hero Content */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        px: { xs: 3, md: 6 },
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: '768px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Main Heading */}
                        <Typography
                            component="h1"
                            sx={{
                                fontSize: { xs: '3.75rem', md: '4.5rem', lg: '6rem' },
                                fontWeight: 300,
                                color: '#fff',
                                mb: 4,
                                lineHeight: 1.1,
                                animation: 'fadeIn 1s ease-in-out',
                                letterSpacing: '-0.025em',
                            }}
                        >
                            <Box component="span" sx={{ display: 'block', fontWeight: 200 }}>
                                Grace in
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    display: 'block',
                                    background: (theme) => `linear-gradient(to right, #fff, #212B36)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: 400,
                                }}
                            >
                                Every Glint
                            </Box>
                        </Typography>

                        {/* Premium CTA Buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 3,
                                animation: 'fadeIn 1s ease-in-out',
                            }}
                        >
                            <Button
                                size="large"
                                startIcon={
                                    <Iconify icon="mdi:crown" width={22} />
                                }
                                sx={{
                                    backgroundColor: '#fff',
                                    color: '#212B36',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    '&:hover .MuiButton-startIcon': {
                                        transform: 'rotate(12deg)',
                                    }, '&:hover ': {
                                        color: '#212B36',
                                        backgroundColor: '#dfdfdf',
                                    },
                                }}
                                onClick={() => router.push(paths.user.products.root)}
                            >
                                View Collection
                            </Button>

                            <Button
                                size="large"
                                startIcon={<Iconify icon="mdi:sparkles" width={20} />}
                                onClick={() => router.push(paths.user.products.root)}
                                sx={{
                                    color: '#fff',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    border: '1px solid #fff',
                                    '&:hover .MuiButton-startIcon': {
                                        transform: 'rotate(12deg)',
                                    },
                                }}
                            >
                                Custom Design
                            </Button>
                        </Box>

                        {/* Luxury Stats */}
                        <Box
                            sx={{
                                mt: 10,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: 'rgba(255, 255, 255, 0.7)',
                                animation: 'fadeIn 1s ease-in-out',
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '1.875rem',
                                        fontWeight: 300,
                                        color: '#fbbf24',
                                        mb: 0.5,
                                    }}
                                >
                                    25+
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 300,
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Years Crafting
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: '1px',
                                    height: '3rem',
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                }}
                            />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '1.875rem',
                                        fontWeight: 300,
                                        color: '#fbbf24',
                                        mb: 0.5,
                                    }}
                                >
                                    1000+
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 300,
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Unique Pieces
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: '1px',
                                    height: '3rem',
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                }}
                            />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '1.875rem',
                                        fontWeight: 300,
                                        color: '#fbbf24',
                                        mb: 0.5,
                                    }}
                                >
                                    100%
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 300,
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Authentic Gold
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* Subtle Sparkle Effects */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '0',
                            left: '44px',
                            color: '#dfdfdf99', // 60% opacity
                            animation: 'sparkle-pulse 2s infinite',
                            animationDelay: '0.7s',
                        }}
                    >
                        <Iconify icon="mdi:sparkles" width={16} />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '15%',
                            left: '33.333333%',
                            color: '#dfdfdf66', // 40% opacity
                            animation: 'sparkle-pulse 2s infinite',
                            animationDelay: '1s',
                        }}
                    >
                        <Iconify icon="mdi:sparkles" width={12} />
                    </Box>
                </Box>
            </Box>



            {/* Global styles for animations */}
            <Box
                component="style"
                sx={{
                    '& + style': {
                        display: 'none',
                    },
                }}
            >
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes sparkle-pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                `}
            </Box>
        </Box>
    );
};

export default HeroSection;