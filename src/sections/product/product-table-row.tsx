import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import ListItem from '@mui/material/ListItem';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {fCurrency(params.row.price)}
    </Box>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Box sx={{ display: 'flex',justifyContent: 'center', alignItems: 'center',height:'100%',flexDirection:'column',gap:'10px'}}>
        {params.row.featured && (
        <Label variant="soft" color="success" sx={{width:'100%'}}>
          featured
        </Label>
      )}
      <Label variant="soft" color={(params.row.status === 'published' && 'info') || 'default'} sx={{width:'100%'}}>
        {params.row.status}
      </Label>
    </Box>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <ListItem
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <ListItemText
        primary={fDate(params.row.created_at)}
        secondary={fTime(params.row.created_at)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    </ListItem>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  const stockQuantity = params.row.stock_quantity || 0;

  // Determine stock level and color
  const getStockLevel = () => {
    if (stockQuantity === 0) return { level: 'Out of Stock', color: 'error' as const };
    if (stockQuantity <= 50) return { level: 'Low Stock', color: 'warning' as const };
    return { level: 'In Stock', color: 'success' as const };
  };

  const { level, color } = getStockLevel();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
        <LinearProgress
          value={stockQuantity === 0 ? 0 : Math.min((stockQuantity / 100) * 100, 100)}
          variant="determinate"
          color={color as 'error' | 'warning' | 'success'}
          sx={{ mb: 1, height: 6, maxWidth: 80 }}
        />
        <Box sx={{ fontWeight: 'medium' }}>{stockQuantity ?? ''} units</Box>
      </Stack>
    </Box>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
  const router = useRouter();
  const imageUrl =
    params.row.all_images?.find((image: any) => image.is_primary)?.image_url ||
    params.row.all_images?.[0]?.image_url ||
    params.row.coverUrl;

  const handleNavigate = () => {
    router.push(paths.user.products.details(params.row._id));
  };
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={imageUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={handleNavigate}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.category_id?.name || params.row.category || 'No Category'}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
