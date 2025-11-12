import Skeleton from '@mui/material/Skeleton';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import { Box, Card, CardActions, CardContent, Container } from '@mui/material';

export function SuggestionCardLoading({ ...other }: Grid2Props) {
  return (
    <Container maxWidth="xl" sx={{ py: 10 }}>
      <Grid container spacing={6} {...other}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '25px' }}>
          {[...Array(4)].map((_, index) => (
           <Card sx={{ width:'100%'}}>
              <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />
              <CardContent>
                <Skeleton animation="wave" sx={{height:24,width:0.5}} style={{ marginBottom: 10 }} />
                <Skeleton animation="wave" sx={{height:20,width:0.4}} style={{ marginBottom: 12 }}/>
                <Box sx={{display:'flex',justifyContent:'space-between',width:'100%'}} style={{ marginBottom: 10 }}>
                <Skeleton animation="wave" sx={{height:24,width:0.3}}/>
                <Skeleton animation="wave" sx={{height:20,width:0.3}}/>
                </Box>
              </CardContent>

              <CardActions sx={{display:'flex',justifyContent:'center'}}>
                <Skeleton animation="wave" variant="rectangular" sx={{height:36,width:'90%',borderRadius:'10px'}} />
              </CardActions>
            </Card>
          ))}
        </Box>
      </Grid>
    </Container>
  );
}
