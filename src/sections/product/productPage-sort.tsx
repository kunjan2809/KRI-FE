import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Checkbox, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------
interface Filter {
  value: string,
  isSelected: boolean,
  label: string,
}
type Props = {
  onSort: (filter: Filter) => void;
  sortOptions: {
    value: string;
    label: string;
    isSelected: boolean,
  }[];
};

export default function ProductPageSort({ onSort, sortOptions }: Props) {
  const popover = usePopover();


  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        Sort By
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200 }}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.isSelected}
            onClick={() => {
              popover.onClose();
              onSort(option);
            }}
          >
            <Checkbox checked={option.isSelected} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
