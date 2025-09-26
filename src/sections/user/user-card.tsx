import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { _socials } from 'src/_mock';
import { AvatarShape } from 'src/assets/illustrations';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import { IUserStatus, INUserItem } from 'src/types/user';
import { useAuthToken } from 'src/auth/hooks';
import { updateUserStatus } from 'src/api/user';
import { Chip, Tooltip } from '@mui/material';
import { getDummyAvtarUrl } from 'src/utils/avtarData';

// ----------------------------------------------------------------------

type Props = {
  user: INUserItem;
};

export default function UserCard({ user }: Props) {
  const avatar = getDummyAvtarUrl(user.profile_icon);
  const theme = useTheme();
  const token = useAuthToken();
  const { first_name, last_name, email, mobile_number, status, _id, created_at, order_statistics } = user;
  const name = `${first_name} ${last_name}`;
  const joinDate = new Date(created_at);
  const phoneNumber = mobile_number;
  const coverUrl = avatar.coverUrl;
  const avatarUrl = avatar.avatarUrl;
  const userId = _id;

  const handleUpdateStatus = async (userStatus: IUserStatus) => {
    await updateUserStatus(userId, userStatus, token as string);
  }

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />
        {status === 'banned' && (
          <Chip
            label="Banned"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              zIndex: 11,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        )}

        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <Image
          src={coverUrl}
          alt={coverUrl}
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>

      <ListItemText
        sx={{ mt: 7, mb: 1 }}
        primary={name}
        secondary={new Date(joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2.5 }}>
        <Tooltip
          title={email}
          placement="bottom"
        >
          <IconButton
            sx={{
              color: '#212B36',
              '&:hover': {
                bgcolor: alpha('#212B36', 0.08),
              },
            }}
          >
            <Iconify icon="eva:email-fill" />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={phoneNumber}
          placement="bottom"
        >
          <IconButton
            sx={{
              color: '#212B36',
              '&:hover': {
                bgcolor: alpha('#212B36', 0.08),
              },
            }}
          >
            <Iconify icon="material-symbols:call" />
          </IconButton>
        </Tooltip>
        {status === 'active' && (
          <Tooltip
            title="click to ban user"
            placement="bottom"
          >
            <IconButton
              sx={{
                color: 'success.main',
                '&:hover': {
                  bgcolor: alpha('#212B36', 0.08),
                },
              }}
              onClick={() => handleUpdateStatus({ status: 'banned' })}
            >
              <Iconify icon="material-symbols:person-filled" />
            </IconButton>
          </Tooltip>
        )}

        {status === 'banned' && (
          <Tooltip
            title="click to activate user"
            placement="bottom"
          >
            <IconButton
              sx={{
                color: 'error.main',
                '&:hover': {
                  bgcolor: alpha('#212B36', 0.08),
                },
              }}
              onClick={() => handleUpdateStatus({ status: 'active' })}
            >
              <Iconify icon="mingcute:user-forbid-fill" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        sx={{ py: 3, typography: 'subtitle1' }}
      >
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Orders
          </Typography>
          {order_statistics?.total_orders}
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Total
          </Typography>

          {order_statistics?.total_order_value}
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Returns
          </Typography>
          {order_statistics?.returned_orders}
        </div>
      </Box>
    </Card >
  );
}
