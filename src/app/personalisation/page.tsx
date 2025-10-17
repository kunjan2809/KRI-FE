'use client';

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';

// ----------------------------------------------------------------------

export default function PersonalisationPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          The Personalisation Shop
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Make it personal with custom engravings, monograms, and unique designs
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {[
          { name: 'Custom Jewelry', count: '150+', color: 'primary' },
          { name: 'Personalized Home Decor', count: '200+', color: 'secondary' },
          { name: 'Monogrammed Accessories', count: '100+', color: 'success' },
          { name: 'Custom Clothing', count: '80+', color: 'warning' },
        ].map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.name}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                {category.name}
              </Typography>
              <Chip
                label={category.count}
                color={category.color as any}
                variant="outlined"
                size="small"
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
