import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Paper, { PaperProps } from '@mui/material/Paper';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import { Box, Container } from '@mui/material';

// ----------------------------------------------------------------------

export function ProductItemSkeleton({ sx, ...other }: PaperProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Stack sx={{ p: 1 }}>
        <Skeleton sx={{ paddingTop: '100%' }} />
      </Stack>

      <Stack spacing={2} sx={{ p: 3, pt: 2 }}>
        <Skeleton sx={{ width: 0.5, height: 16 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row">
            <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
            <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
            <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
          </Stack>
          <Skeleton sx={{ width: 40, height: 16 }} />
        </Stack>
      </Stack>
    </Paper>
  );
}

// ----------------------------------------------------------------------

export function ProductDetailsLoading({ ...other }: Grid2Props) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6} {...other}>
        <Grid xs={12} md={6}>
          <Skeleton animation="wave" sx={{ height: 618 }} />
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <Skeleton animation="wave" sx={{ height: 16, width: 0.2 }} />
            <Skeleton animation="wave" sx={{ height: 16, width: 0.4 }} />
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1 }} />
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1 }} />
            <Skeleton animation="wave" sx={{ height: 120 }} />
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1 ,marginTop:'10px'}} />
            <Box sx={{display:'flex',gap:'10px'}}>
            <Skeleton animation="wave" sx={{ height: 30, width: 0.1 }} />
            <Skeleton animation="wave" sx={{ height: 30, width: 0.1 }} />
            </Box>
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1,marginTop:'10px' }} />
            <Box sx={{display:'flex',gap:'10px'}}>
            <Skeleton animation="wave" sx={{ height: 30, width: 0.1 }} />
            <Skeleton animation="wave" sx={{ height: 30, width: 0.1 }} />
            </Box>
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1 ,marginTop:'10px'}} />
            <Box sx={{display:'flex',gap:'10px',alignItems:'center'}}>
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1 }} />
            <Skeleton animation="wave" sx={{ height: 30, width: 0.1 }} />
            <Skeleton animation="wave" sx={{ height: 16, width: 0.1 }} />
            </Box>
            <Box sx={{display:'flex',justifyContent:'space-between',width:'100%',marginTop:'20px'}}>
            <Skeleton animation="wave" variant='rectangular' sx={{ height: 48, width: '49%',borderRadius:'10px' }} />
            <Skeleton animation="wave" variant='rectangular' sx={{ height: 48, width: '49%',borderRadius:'10px' }} />
            </Box>

          </Stack>
        </Grid>

        {/* <Grid xs={12}>
          <Stack direction="row" alignItems="center">
            {[...Array(3)].map((_, index) => (
              <Stack
                key={index}
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ width: 1 }}
              >
                <Skeleton variant="circular" sx={{ width: 80, height: 80 }} />
                <Skeleton sx={{ height: 16, width: 160 }} />
                <Skeleton sx={{ height: 16, width: 80 }} />
              </Stack>
            ))}
          </Stack>
        </Grid> */}
      </Grid>
    </Container>
  );
}
