import { display } from '@mui/system';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Paper, { PaperProps } from '@mui/material/Paper';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import { Box, Card, CardActions, CardContent, CardMedia, Container, Typography } from '@mui/material';


// ----------------------------------------------------------------------

interface productCardSkeleton {
  rowCount?: number;
  colCount?: number;
  sx?: string;
  Grid2Props?: Grid2Props;
}


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


export function ProductCardSkeleton({ sx, rowCount = 1, colCount = 4, ...other }: productCardSkeleton,) {

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid spacing={3}>
        {[...Array(rowCount)].map((_) => (
          <Grid xs={12} sm={6} md={4} lg={3} spacing={6} {...other} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '25px' }}>
              {[...Array(colCount)].map((data) => (
                <Card sx={{ width: '100%', height: '100%', paddingBottom: '4px' }}>
                  <Skeleton sx={{ height: '250px' }} animation="wave" variant="rectangular" />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Skeleton animation="wave" sx={{ height: 18, width: 0.3 }} />
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.5 }} />
                    <Skeleton animation="wave" sx={{ height: 18, width: 0.4 }} />
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
                    <Skeleton animation="wave" sx={{ height: 18, width: 0.3, marginTop: '10px' }} />
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
                    <Skeleton animation="wave" variant="rectangular" sx={{ height: 36, width: '40%', borderRadius: '10px' }} />
                    <Skeleton animation="wave" variant="rectangular" sx={{ height: 36, width: '40%', borderRadius: '10px' }} />
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
     <Skeleton animation="wave" variant="rectangular" sx={{ height: 36, width: 158, borderRadius: '10px' }} />
      </Box> */}
    </Container>
  );
}

// product slider skeleton 

export function ProductSuggestionSlider({ sx, rowCount = 2, colCount = 4, ...other }: productCardSkeleton) {
  console.log('rowCount', rowCount)
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid spacing={3}>
        {[...Array(rowCount)].map((_) => (
          <Grid xs={12} sm={6} md={4} lg={3} spacing={6} {...other} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '25px' }}>
              {[...Array(colCount)].map((data) => (
                <Card sx={{ width: '100%', height: '100%', paddingBottom: '4px' }}>
                  <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />
                  <CardContent>
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.5 }} style={{ marginBottom: 10 }} />
                    <Skeleton animation="wave" sx={{ height: 20, width: 0.4 }} style={{ marginBottom: 12 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} style={{ marginBottom: 10 }}>
                      <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
                      <Skeleton animation="wave" sx={{ height: 20, width: 0.3 }} />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Skeleton animation="wave" variant="rectangular" sx={{ height: 36, width: '90%', borderRadius: '10px' }} />
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}


export function ProductCartPageSkeleton({ sx, ...other }: Grid2Props) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid spacing={4}>
        <Grid xs={12} lg={8}>
          <Stack spacing={3}>
            <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={3}>
                  <Skeleton sx={{ height: 120, padding: 10, margin: 2 }} animation="wave" variant="rectangular" />
                </Grid>
                <Grid xs={12} sm={9}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
                    <Skeleton animation="wave" sx={{ height: 10, width: 0.3 }} />
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
                    <Skeleton animation="wave" sx={{ height: 10, width: 0.3 }} />
                  </Box>
                </Grid>
              </Grid>
            </Card>
            {/* Promo Code */}
            <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Skeleton animation="wave" sx={{ height: 24, width: 0.2 }} />
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton animation="wave" sx={{ height: 24, width: 0.6 }} />
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>

    </Container>
  );
}

// order page skelton

export function OrderListSkeleton({ sx, ...other }: Grid2Props) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* <Grid item xs={12} sm={12} md={12} lg={6} gap={2}> */}
        {[...Array(4)].map((_, index) => (
          <Grid xs={12} sm={12} md={12} lg={6} >
            <Card key={index} sx={{ p: 3 }}>
              <Grid container spacing={3}>

                <Grid xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Skeleton animation="wave" sx={{ height: 24, width: 0.4,mb:'30px' }} />

                        <Skeleton animation="wave" sx={{ height: 24, width: 0.2 }} />

                      </Box>
                      {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.order_items}
                            </Typography> */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Skeleton animation="wave" sx={{ height: 22, width: 0.5 }} />

                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />


                      </Box>

                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />

                      </Box>


                      {/* Action Links */}
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end' }}>
                        <Skeleton animation="wave" sx={{ height: 28, width: 0.2 }} />

                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )
        )}
        {/* </Grid> */}
      </Grid>

    </Container>
  );
}

export function ProductSkeleton({ sx, ...other }: Grid2Props) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
          <Skeleton sx={{ height: 32, width: 110 }} />
          <Skeleton sx={{ height: 32, width: 110 }} />
          <Skeleton sx={{ height: 32, width: 110 }} />
          <Skeleton sx={{ height: 32, width: 110 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton sx={{ height: 22, width: 56 }} />
          <Skeleton sx={{ height: 22, width: 56 }} />
        </Box>
      </Box>
      <Grid spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={4} lg={3} spacing={6} {...other}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '25px' }}>
            {[...Array(4)].map((_, index) => (
              <Card sx={{ width: '100%', height: '100%', paddingBottom: '4px' }}>
                <Skeleton sx={{ height: '250px' }} animation="wave" variant="rectangular" />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <Skeleton animation="wave" sx={{ height: 18, width: 0.3 }} />
                  <Skeleton animation="wave" sx={{ height: 24, width: 0.5 }} />
                  <Skeleton animation="wave" sx={{ height: 18, width: 0.4 }} />
                  <Skeleton animation="wave" sx={{ height: 24, width: 0.3 }} />
                  <Skeleton animation="wave" sx={{ height: 18, width: 0.3, marginTop: '10px' }} />
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
                  <Skeleton animation="wave" variant="rectangular" sx={{ height: 36, width: '40%', borderRadius: '10px' }} />
                  <Skeleton animation="wave" variant="rectangular" sx={{ height: 36, width: '40%', borderRadius: '10px' }} />
                </CardActions>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
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
