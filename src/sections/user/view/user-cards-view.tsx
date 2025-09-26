'use client';

import { useCallback, useState } from 'react';

import { Box, Pagination, Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Label from 'src/components/label';

import { useGetUsers } from 'src/api/user';
import { useAuthToken } from 'src/auth/hooks';

import { INUserItem } from 'src/types/user';
import UserCardList from '../user-card-list';

// ----------------------------------------------------------------------



export default function UserCardsView() {
  const settings = useSettingsContext();
  const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];
  const [filters, setFilters] = useState({ status: 'all' });
  const token = useAuthToken();
  const [page, setPage] = useState<number>(1);
  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setFilters({ status: newValue });
    },
    []
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }

  const params = {
    status_filter: filters.status === 'all' ? [] : [filters.status],
    search: '',
    page,
    limit: 10,
  };

  const { data: apiUsers } = useGetUsers(params, token as string);
  const users = apiUsers?.users || [];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Users"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User' },
        ]}

        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        value={filters.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          mb: 3,
          boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                }
                color={
                  (tab.value === 'active' && 'success') ||
                  (tab.value === 'banned' && 'error') ||
                  'default'
                }
              >
                {['active', 'banned'].includes(tab.value)
                  ? users.filter((user: INUserItem) => user.status === tab.value).length
                  : users.length}
              </Label>
            }
          />
        ))}
      </Tabs>

      <UserCardList users={users} />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Pagination
          count={apiUsers?.total_pages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Container>
  );
}
