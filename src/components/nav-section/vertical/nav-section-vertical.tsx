import { memo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import NavList from './nav-list';
import { NavProps, NavGroupProps } from '../types';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function NavSectionVertical({ data, slotProps, ...other }: NavProps) {
  return (
    <Stack component="nav" id="nav-section-vertical" {...other}>
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          subheader={group.subheader}
          items={group.items}
          slotProps={slotProps}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

function Group({ subheader, items, slotProps }: NavGroupProps) {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderContent = items.map((list) => (
    <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
  ));

  return (
    <Stack sx={{ px: 2 }}>
      {subheader ? (
        <>
          <ListSubheader
            disableGutters
            disableSticky
            onClick={handleToggle}
            sx={{
              fontSize: 11,
              cursor: 'pointer',
              typography: 'overline',
              display: 'inline-flex',
              color: 'text.disabled',
              mb: `${slotProps?.gap || 4}px`,
              p: (theme) => theme.spacing(2, 1, 1, 1.5),
              transition: (theme) =>
                theme.transitions.create(['color'], {
                  duration: theme.transitions.duration.shortest,
                }),
              '&:hover': {
                color: 'text.primary',
              },
              ...slotProps?.subheader,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="subtitle2" noWrap sx={slotProps?.subheader}>
                {subheader}
              </Typography>
              <IconButton>
                <Iconify icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'} />
              </IconButton>
            </Stack>
          </ListSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </Stack>
  );
}
