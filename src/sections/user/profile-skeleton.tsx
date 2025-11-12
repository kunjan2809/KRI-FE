import { Box, Card, CardContent, Container, Divider, Grid, Skeleton, Stack } from '@mui/material';

export const ProfileHeaderSkeleton = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item>
                  <Skeleton variant="circular" sx={{ width: 120, height: 120 }} />
                </Grid>
                <Grid item xs>
                  <Skeleton animation="wave" sx={{ height: 20, width: 0.2 }} />
                  <Skeleton animation="wave" sx={{ height: 20, width: 0.3, mt: 2 }} />
                  <Skeleton animation="wave" sx={{ height: 20, width: 0.5, mt: 1 }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      </Container>
      <Card>
        <CardContent>
          <Skeleton animation="wave" sx={{ height: 20, width: 0.2, mb: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Skeleton animation="wave" sx={{ height: 32, width: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton animation="wave" sx={{ height: 32, width: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton animation="wave" sx={{ height: 32, width: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton animation="wave" sx={{ height: 32, width: 0.5 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export const ProfileAddressSkeleton = () => {
  return (
    <>
      <Card>
        <CardContent>
          <Skeleton animation="wave" sx={{ height: 20, width: 0.2, mb: 4 }} />
          <Grid container spacing={3}>
            {[...Array(2)].map((_, index) => (
              <Grid key={index} item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{width:'100%',height:'50px',display:'flex',justifyContent:'space-between'}}>
                    <Skeleton animation="wave" sx={{ height: 24, width: 0.1 }} />
                    <Box sx={{display:'flex',gap:'10px'}}>
                      <Skeleton animation="wave" sx={{ height: 24, width: '100px' }} />
                      <Skeleton animation="wave" sx={{ height: 24, width: '100px' }} />
                    </Box>
                  </CardContent>
                  <Divider sx={{ marginTop: '10px' }} />
                  <CardContent>
                    <Skeleton animation="wave" sx={{ height: 100, width:'100%' }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
