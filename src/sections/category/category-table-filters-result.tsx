import { useState, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { ICategoryTableFilters } from 'src/types/category';

// ----------------------------------------------------------------------

type Props = {
  filters: ICategoryTableFilters;
  onFilters: (name: string, value: any) => void;
  onResetFilters: () => void;
  results: number;
  sx?: any;
};

export default function CategoryTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  sx,
}: Props) {
  const [filtersToShow, setFiltersToShow] = useState<string[]>([]);

  const handleRemoveFilter = useCallback(
    (inputValue: string) => {
      const newFilters = { ...filters };
      // Add logic to remove specific filter
      onFilters('', newFilters);
    },
    [filters, onFilters]
  );

  const handleResetAll = useCallback(() => {
    onResetFilters();
  }, [onResetFilters]);

  return (
    <Stack spacing={1.5} sx={{ p: 3, pt: 0, ...sx }}>
      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {results} results found
        </Typography>

        {filtersToShow.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            size="small"
            onDelete={() => handleRemoveFilter(filter)}
          />
        ))}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          color="error"
          size="small"
          onClick={handleResetAll}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

