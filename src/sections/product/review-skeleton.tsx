import { Box, Container, Stack } from '@mui/material';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';

export function ReviewLoading({ ...other }: Grid2Props) {
  return (
    <Container maxWidth="xl" sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            width: '33%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <Skeleton animation="wave" sx={{ height: 16, width: 0.2 }} />
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <Skeleton animation="wave" sx={{ height: 28, width: 50 }} />
            <Skeleton animation="wave" sx={{ height: 28, width: 50 }} />
          </Box>
          <Skeleton animation="wave" sx={{ height: 16, width: 0.3 }} />
          <Skeleton animation="wave" sx={{ height: 16, width: 80 }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            width: '33%',
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                width: '100%',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Skeleton animation="wave" sx={{ height: 28, width: 0.2 }} />
              <Skeleton animation="wave" sx={{ height: 10, width: 0.4 }} />
              <Skeleton animation="wave" sx={{ height: 28, width: 30 }} />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            width: '33%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Skeleton animation="wave" sx={{ height: 48, width: 0.5 }} />
        </Box>
      </Box>
      <Grid container spacing={6} {...other}>
        <Grid
          xs={12}
          md={6}
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center',
              width: '40%',
            }}
          >
            <Skeleton variant="circular" sx={{ width: 80, height: 80 }} />
            <Skeleton animation="wave" sx={{ height: 28, width: 0.6 }} />
            <Skeleton animation="wave" sx={{ height: 28, width: 0.5 }} />
          </Box>
          <Box
            sx={{
              width: '60%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '15px',
              justifyContent: 'center',
            }}
          >
            <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
            <Skeleton animation="wave" sx={{ height: 20, width: 1 }} />
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ height: 64, width: 64, borderRadius: '5px' }}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ height: 64, width: 64, borderRadius: '5px' }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
