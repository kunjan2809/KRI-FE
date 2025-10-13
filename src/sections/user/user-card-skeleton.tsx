import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';

// ----------------------------------------------------------------------

export default function UserCardSkeleton() {
  return (
    <Card
      sx={{
        p: 3,
        textAlign: 'center',
        transition: (theme) =>
          theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.customShadows.z20,
        },
      }}
    >
      {/* Cover Image Skeleton */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={120}
          sx={{ borderRadius: 1 }}
        />
        
        {/* Avatar Skeleton */}
        <Box
          sx={{
            left: '50%',
            bottom: -24,
            position: 'absolute',
            transform: 'translateX(-50%)',
          }}
        >
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ border: '4px solid', borderColor: 'background.paper' }}
          />
        </Box>
      </Box>

      {/* Name Skeleton */}
      <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mb: 1 }} />
      
      {/* Email Skeleton */}
      <Skeleton variant="text" width="90%" height={20} sx={{ mx: 'auto', mb: 1 }} />
      
      {/* Phone Skeleton */}
      <Skeleton variant="text" width="70%" height={20} sx={{ mx: 'auto', mb: 2 }} />

      <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

      {/* Stats Section Skeleton */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', mb: 0.5 }} />
          <Skeleton variant="text" width="40%" height={16} sx={{ mx: 'auto' }} />
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', mb: 0.5 }} />
          <Skeleton variant="text" width="40%" height={16} sx={{ mx: 'auto' }} />
        </Box>
      </Stack>

      {/* Action Buttons Skeleton */}
      <Stack direction="row" spacing={1} justifyContent="center">
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
      </Stack>
    </Card>
  );
}
