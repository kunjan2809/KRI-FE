'use client';

import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';


import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useAuthToken } from 'src/auth/hooks';
import { useGetOrders, deleteOrder } from 'src/api/order';
import { IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';

import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return', label: 'Return' },
  { value: 'all', label: 'All' }
];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Order', width: 116 },
  { id: 'name', label: 'Customer', width: 140 },
  { id: 'createdAt', label: 'Date', width: 140 },
  { id: 'createdAt', label: 'Address', width: 200 },
  { id: 'totalQuantity', label: 'Items', width: 80, align: 'center' },
  { id: 'totalAmount', label: 'Price', width: 100 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', label: 'Actions', width: 88 },
];

const defaultFilters: IOrderTableFilters = {
  status: "",
  payment_status: [],
  dateRange: { startDate: null, endDate: null },
  search: '',
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const { enqueueSnackbar } = useSnackbar();
  const token = useAuthToken();
  const table = useTable({ defaultOrderBy: 'created_at' });
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);



  // API parameters
  const apiParams = {
    page: currentPage,
    limit: rowsPerPage,
    order_status: filters.status.length > 0 ? filters.status : '',
    payment_status: filters.payment_status.length > 0 ? filters.payment_status[0] : '',
    start_date: filters.dateRange.startDate ? filters.dateRange.startDate.toISOString() : '',
    end_date: filters.dateRange.endDate ? filters.dateRange.endDate.toISOString() : '',
    search: debouncedSearchQuery,
    sort_by: table.orderBy as 'created_at' | 'total_amount' | 'order_status',
    sort_order: table.order as 'asc' | 'desc',
  };
  const {
    orders,
    ordersLoading,
    ordersError,
    pagination,
    ordersEmpty
  } = useGetOrders(apiParams);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    filters.status.length > 0 ||
    filters.payment_status.length > 0 ||
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    !!filters.search;

  const notFound = ordersEmpty && canReset;

  const handleFilters = useCallback(
    (name: string, value: IOrderTableFilterValue) => {
      console.log(name, value)
      setCurrentPage(1);
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setDebouncedSearchQuery('')
    setCurrentPage(1);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      if (!token) return;

      try {
        await deleteOrder(id, token);
        enqueueSnackbar('Order deleted successfully!');
        // The data will be refetched automatically by SWR
      } catch (error) {
        enqueueSnackbar('Failed to delete order', { variant: 'error' });
      }
    },
    [token, enqueueSnackbar]
  );

  const handleDeleteRows = useCallback(async () => {
    if (!token) return;

    try {
      await Promise.all(
        table.selected.map((id) => deleteOrder(id, token))
      );
      enqueueSnackbar('Orders deleted successfully!');
      table.onSelectAllRows(false, []);
      // The data will be refetched automatically by SWR
    } catch (error) {
      enqueueSnackbar('Failed to delete orders', { variant: 'error' });
    }
  }, [token, enqueueSnackbar, table]);


  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue === 'all' ? [] : [newValue]);
    },
    [handleFilters]
  );

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setCurrentPage(newPage + 1);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setCurrentPage(1);
    },
    []
  );

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Orders"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Order'
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <Tabs
            value={filters.status.length > 0 ? filters.status[0] : 'all'}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
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
                      ((tab.value === 'all' || filters.status.includes(tab.value)) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'delivered' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      (tab.value === 'shipped' && 'info') ||
                      (tab.value === 'return' && 'secondary') ||
                      'default'
                    }
                  >

                    {ordersLoading ? '...' :
                      tab.value === 'all' ? pagination?.total_orders || 0 :
                        orders.filter((order) => order.order_status === tab.value).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            setFilters={setFilters}
            onFilters={handleFilters}
            searchQuery={searchQuery}
            setSerachQuery={setSearchQuery}
            dateError={false}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              setFilters={setFilters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={orders.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={orders.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  orders.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      orders.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {orders.map((row) => (
                    <OrderTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, rowsPerPage, orders.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={pagination?.total_orders || 0}
            page={currentPage - 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
