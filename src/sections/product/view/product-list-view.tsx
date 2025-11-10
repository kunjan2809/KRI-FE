'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
  GridSortModel,
  GridFilterModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { deleteProduct, patchFeaturedStatus, useGetProducts } from 'src/api/product';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { IProductTableFilters, IProductTableFilterValue } from 'src/types/product';
import { useAuthToken } from 'src/auth/hooks';

import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
} from '../product-table-row';
import { Box } from '@mui/material';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const defaultFilters: IProductTableFilters = {
  publish: [],
  stock: [],
  search: '',
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

const SORT_MODEL = {
  field: 'created_at' as const,
  sort: 'desc' as const,
};

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();

  const token = useAuthToken();
  const confirmRows = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();


  const [tableData, setTableData] = useState<any[]>([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [sortModel, setSortModel] = useState<GridSortModel[0]>(SORT_MODEL);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [deleteRowIds, setDeleteRowIds] = useState<string[]>([]);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { products, productsLoading, productsError, pagination, reFetchProducts } = useGetProducts({
    stock_filters: filters.stock,
    status_filters: filters.publish,
    search: debouncedSearchQuery,
    sort_by: sortModel.field as 'created_at' | 'name' | 'price' | 'stock_quantity' | 'sku',
    sort_order: sortModel.sort as 'asc' | 'desc',
    page,
    limit,
  });

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
 
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);


  useEffect(() => {
    if (products && products.length) {
      setTableData(products);
    }
   
  }, [products]);


  // Use server-side data directly since filtering is handled by API
  const dataFiltered = products || [];

  const canReset = !isEqual(defaultFilters, filters);


  const handleFilters = useCallback((name: string, value: IProductTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const handleSearch = useCallback((model: GridFilterModel) => {
    setSearchQuery(model.quickFilterValues?.[0] ?? '');
    setPage(1); // Reset to first page when search changes
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setPage(1);
  }, []);

  const handleDeleteRows = useCallback(
    () => {
      const deletePromises = deleteRowIds.map((id) => deleteProduct(id, token));
      Promise.all(deletePromises).then(() => {
        enqueueSnackbar('Delete success!');
        setTableData(tableData.filter((row) => !deleteRowIds.includes(row._id)));
        setDeleteRowIds([]);
        reFetchProducts();
        confirmRows.onFalse();
      }).catch((error) => {
        enqueueSnackbar('Delete failed!', { variant: 'error' });
      });
    },
    [enqueueSnackbar, tableData, token, reFetchProducts, confirmRows, deleteRowIds]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.user.products.details(id));
    },
    [router]
  );
  const handleFeaturedToggole = async (productId: string, status: boolean) => {
    try {
     await patchFeaturedStatus(token, productId, !status)
     reFetchProducts()
    } catch (error) {
      console.log("Somthing get wrong", error)
    }

  }
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'created_at',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'stock_quantity',
      headerName: 'Stock',
      width: 160,
      type: 'singleSelect',
      valueOptions: PRODUCT_STOCK_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: PUBLISH_OPTIONS,
      renderCell: (params) => <Box>
        {params.row.featured && <Label variant="soft" color='success'>
          featured
        </Label>
        }<RenderCellPublish params={params} />
      </Box>
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="ph-star" />}
          label={params.row.featured ? 'Remove featured' : 'Make featured'}
          onClick={() => handleFeaturedToggole(params.row._id, params.row.featured)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            confirmRows.onTrue();
            setDeleteRowIds([params.row._id]);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];


  const CustomToolbar = () => (
    <GridToolbarContainer>
      <ProductTableToolbar
        filters={filters}
        onFilters={handleFilters}
        stockOptions={PRODUCT_STOCK_OPTIONS}
        publishOptions={PUBLISH_OPTIONS}
      />

      <GridToolbarQuickFilter
        placeholder="Search products..."
        debounceMs={1000}
      />

      <Stack
        spacing={1}
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        {!!selectedRowIds.length && (
          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => {
              confirmRows.onTrue();
              setDeleteRowIds(selectedRowIds.map((id) => id as string));
            }}
          >
            Delete ({selectedRowIds.length})
          </Button>
        )}

        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        {/* Status indicator */}
        {productsError && !productsLoading && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              API connection failed. Showing fallback data for demonstration.
            </Typography>
          </Alert>
        )}


        <Card>
          {canReset && (
            <ProductTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <DataGrid
            rows={dataFiltered}
            columns={columns}
            getRowHeight={() => 'auto'}
            rowCount={pagination?.total_products || 0}
            paginationMode="server"
            paginationModel={{
              page: page - 1,
              pageSize: limit,
            }}
            onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
              setPage(newPage + 1);
              setLimit(newPageSize);
            }}
            filterMode='server'
            onFilterModelChange={handleSearch}
            pageSizeOptions={[20, 50, 100]}
            disableRowSelectionOnClick
            onSortModelChange={(model) => {
              setSortModel(model[0] ?? SORT_MODEL);
            }}
            checkboxSelection
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            getRowId={(row) => row._id || row.id}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => {
              setColumnVisibilityModel(newModel);
            }}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px dashed #919eab33',
              },
            }}
            slotProps={{
              toolbar: {
                selectedRowIds,
                onDeleteRows: handleDeleteRows,
                onEditRows: () => {
                  console.info('EDIT ROWS', selectedRowIds);
                },
              },
            }}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong>{deleteRowIds.length}</strong> products?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
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
