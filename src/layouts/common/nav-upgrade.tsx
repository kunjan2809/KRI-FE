import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { getDummyAvtarUrl } from 'src/utils/avtarData';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useAuthContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={getDummyAvtarUrl(user?.profile_icon || '25').avatarUrl} alt={`${user?.first_name} ${user?.last_name}`} sx={{ width: 48, height: 48 }}>
            {`${user?.first_name?.charAt(0).toUpperCase()} ${user?.last_name?.charAt(0).toUpperCase()}`}
          </Avatar>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.first_name} ${user?.last_name}`}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

      </Stack>
    </Stack>
  );
}
