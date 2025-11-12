import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
} from '@mui/material';

export const OrderDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Skeleton animation="wave" sx={{ height: 28, width: 0.2 }} />

          <Skeleton animation="wave" sx={{ height: 22, width: 0.4, mt: '10px' }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={6}>
          <Card>
            <CardContent>
              <Skeleton animation="wave" sx={{ height: 22, width: 0.2, mb: '30px' }} />
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />

                      <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />

                      <Skeleton animation="wave" sx={{ height: 24, width: 0.2 }} />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.3 }} />

                      <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Skeleton animation="wave" sx={{ height: '150px', width: '100%' }} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Skeleton animation="wave" sx={{ height: 22, width: 0.2, mb: '30px' }} />

              <Stack spacing={3}>
                {[...Array(2)].map((_, index) => (
                  <Card key={index} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <Skeleton animation="wave" sx={{ height: '80px', width: '250px' }} />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                            <Skeleton animation="wave" sx={{ height: 22, width: 0.2, mt: 2 }} />
                            <Box sx={{ display: 'flex', gap: '10px', mt: 2 }}>
                              <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                              <Skeleton animation="wave" sx={{ height: 22, width: 0.2 }} />
                            </Box>
                          </Box>
                          <Skeleton animation="wave" sx={{ height: 34, width: 0.2 }} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Skeleton animation="wave" sx={{ height: 22, width: 0.3, mb: '30px' }} />

                  <Stack spacing={3}>
                    <Skeleton animation="wave" sx={{ height: 22, width: 0.2, ml: '20px' }} />

                    <Skeleton animation="wave" sx={{ height: 78, width: 0.2, ml: '20px' }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Skeleton animation="wave" sx={{ height: 22, width: 0.3, mb: '30px' }} />

                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.4 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton animation="wave" sx={{ height: 22, width: 0.4 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </div>
  );
};
