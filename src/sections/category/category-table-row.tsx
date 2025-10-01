import { formatDistanceToNow } from 'date-fns';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { GridRenderCellParams } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

export function RenderCellCategory({ params }: { params: GridRenderCellParams }) {
  const categoryName = params.row.name || '';
  const firstChar = categoryName.charAt(0).toUpperCase() || '?';
  
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: '#ff6b35', // Orange color similar to the image
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '12px', // Rounded square shape
        }}
      >
        {firstChar}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" noWrap>
          {categoryName}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {categoryName.split(' ')[0]} {/* Show first word as sub-label */}
        </Typography>
      </Box>
    </Stack>
  );
}

export function RenderCellCreatedAt({ params }: { params: GridRenderCellParams }) {
  const dateValue = params.value;
  
  if (!dateValue) {
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );
  }

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return (
        <Typography variant="body2" color="text.secondary">
          Invalid Date
        </Typography>
      );
    }
    
    return (
      <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(date, { addSuffix: true })}
      </Typography>
    );
  } catch (error) {
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );
  }
}

export function RenderCellProductCount({ params }: { params: GridRenderCellParams }) {
  return (
    <Chip
      label={params.value || 0}
      size="small"
      color="primary"
      variant="outlined"
    />
  );
}

