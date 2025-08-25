'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../iconify';
// ----------------------------------------------------------------------

// Custom styled components for the footer
const StyledFooter = styled('footer')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  borderTop: '1px solid rgba(145, 158, 171, 0.3)',
}));


const SocialIconButton = styled(IconButton)<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: isHovered ? '#212B36' : '#f1f1f1',
  color: isHovered ? '#212B36' : '#212B36',
  transition: 'all 0.3s ease',
  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
  boxShadow: isHovered ? '0 4px 12px #f1f1f1' : 'none',
  '&:hover': {
    backgroundColor: isHovered ? '#212B36' : '#f1f1f1',
    color: isHovered ? '#fff' : '#212B36',
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#637381',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#212B36',
    textDecoration: 'underline',
    textUnderlineOffset: 4,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  fontFamily: 'serif',
  color: '#212B36',
  fontWeight: 500,
  marginBottom: theme.spacing(3),
}));


const socialLinks = [
  { icon: <Iconify icon="ant-design:instagram-filled" />, name: 'Instagram' },
  { icon: <Iconify icon="eva:facebook-fill" />, name: 'Facebook' },
  { icon: <Iconify icon="eva:linkedin-fill" />, name: 'Linkedin' },
  { icon: <Iconify icon="eva:twitter-fill" />, name: 'Twitter' },
];

const quickLinks = ['Gift cards', 'Kri Registry', 'Sitemap', 'Kri blog', 'Kri United Kingdom', 'Kri Germany', 'Kri Canada', 'Catalog', 'Contact'];
const customerCareLinks = ['Sell on Kri', 'Teams', 'Forums', 'Affiliates & Creators', 'Shipping & Returns', 'Jewelry Care', 'Terms & Privacy'];
const aboutLinks = ['Kri, Inc.', 'Policies', 'Investors', 'Careers', 'Press', 'Impact', 'Legal imprint'];

// ----------------------------------------------------------------------

export default function UserFooter() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={6}>
          {/* Column 1: Brand / Logo */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ mb: 3 }}>
              <a href="/">
                <img src="/assets/Logo-vertical.svg" alt="Lumière" width={100} />
              </a>
              <Typography
                variant="body2"
                sx={{
                  color: '#637381',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  mt: 1.5,
                }}
              >
                Timeless elegance. Crafted for you.
              </Typography>
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} md={6} lg={2}>
            <SectionTitle>Quick Links</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {quickLinks.map((link) => (
                <FooterLink key={link} href="#" underline="none">
                  {link}
                </FooterLink>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Customer Care */}
          <Grid item xs={12} md={6} lg={2}>
            <SectionTitle>Customer Care</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {customerCareLinks.map((link) => (
                <FooterLink key={link} href="#" underline="none">
                  {link}
                </FooterLink>
              ))}
            </Box>
          </Grid>

          {/* Column 3: About */}
          <Grid item xs={12} md={6} lg={2}>
            <SectionTitle>About</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {aboutLinks.map((link) => (
                <FooterLink key={link} href="#" underline="none">
                  {link}
                </FooterLink>
              ))}
            </Box>
          </Grid>

          {/* Column 4: Social Links */}
          <Grid item xs={12} md={6} lg={3}>
            <SectionTitle>Connect With Us</SectionTitle>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {socialLinks.map(({ icon, name }) => (
                <SocialIconButton
                  key={name}
                  isHovered={hoveredSocial === name}
                  onMouseEnter={() => setHoveredSocial(name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  aria-label={name}
                >
                  {icon}
                </SocialIconButton>
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#637381',
                fontSize: '0.75rem',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Follow us for daily inspiration and behind-the-scenes glimpses of our craftsmanship.
            </Typography>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            my: 6,
            background: 'linear-gradient(90deg, transparent 0%, #212B36 50%, transparent 100%)',
            border: 'none',
            width: '100%',
            height: '1px',
          }}
        />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'rgb(145, 158, 171)',
            }}
          >
            © 2025 Kri. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontSize: '0.75rem',
              color: 'rgb(145, 158, 171)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#212B36',
                }}
              />
              <span>Handcrafted with care</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#212B36',
                }}
              />
              <span>Ethically sourced</span>
            </Box>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  );
}

