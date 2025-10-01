'use client';

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
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { deleteCategory, useGetCategories, updateCategory, addCategory } from 'src/api/category';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { ICategory, ICategoryTableFilters, ICategoryTableFilterValue } from 'src/types/category';
import { useAuthToken } from 'src/auth/hooks';

import CategoryTableToolbar from '../category-table-toolbar';
import CategoryTableFiltersResult from '../category-table-filters-result';
import {
  RenderCellCategory,
  RenderCellCreatedAt,
  RenderCellProductCount,
} from '../category-table-row';
import CategoryModal from '../category-modal';

// ----------------------------------------------------------------------

const defaultFilters: ICategoryTableFilters = {
  // Add default filters as needed
};

const HIDE_COLUMNS = {
  // Add columns to hide by default
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

const SORT_MODEL = {
  field: 'created_at',
  sort: 'desc',
};

// ----------------------------------------------------------------------

export default function CategoryListView() {
  const { enqueueSnackbar } = useSnackbar();

  const token = useAuthToken();
  const confirmRows = useBoolean();
  const categoryModal = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  const [filters, setFilters] = useState(defaultFilters);
  const [sortModel, setSortModel] = useState<GridSortModel[0]>(SORT_MODEL as GridSortModel[0]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { categories, categoriesLoading, categoriesError, categoriesEmpty, totalCategories } = useGetCategories();

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([] as unknown as GridRowSelectionModel);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (categories && categories.length) {
      // Ensure all categories have the correct structure for DataGrid
      const formattedCategories = categories.map((category: any) => ({
        _id: category._id || category.id,
        id: category._id || category.id,
        name: category.name,
        description: category.description,
        created_at: category.created_at,
        product_count: category.product_count || 0,
      }));
      setTableData(formattedCategories);
    }
  }, [categories]);

  // Fallback data if API fails
  const fallbackCategories: any[] = [
    {
      _id: 'fallback-1',
      id: 'fallback-1',
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      created_at: new Date().toISOString(),
      product_count: 25,
    },
    {
      _id: 'fallback-2',
      id: 'fallback-2',
      name: 'Clothing',
      description: 'Fashion and apparel items',
      created_at: new Date().toISOString(),
      product_count: 50,
    },
    {
      _id: 'fallback-3',
      id: 'fallback-3',
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      created_at: new Date().toISOString(),
      product_count: 30,
    },
  ];

  // Use fallback data if API fails and no data is available
  let displayData: any[] = [];
  if (tableData.length > 0) {
    displayData = tableData;
  } else if (categoriesError && !categoriesLoading) {
    displayData = fallbackCategories;
  }

  const dataFiltered = applyFilter({
    inputData: displayData,
    filters,
  });

  const canReset = false; // No filters implemented yet

  const handleFilters = useCallback((name: string, value: ICategoryTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteCategory(id, token);
        const deleteRow = tableData.filter((row) => row._id !== id);
        setTableData(deleteRow);
        enqueueSnackbar('Category deleted successfully!');
      } catch (error) {
        enqueueSnackbar('Failed to delete category', { variant: 'error' });
      }
    },
    [enqueueSnackbar, tableData, token]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !(selectedRowIds as string[]).includes(row._id));
    setTableData(deleteRows);
    enqueueSnackbar('Categories deleted successfully!');
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (category: ICategory) => {
      setEditingCategory(category);
      categoryModal.onTrue();
    },
    [categoryModal]
  );

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    categoryModal.onTrue();
  }, [categoryModal]);

  const handleSaveCategory = useCallback(
    async (categoryData: { name: string; description?: string }) => {
      try {
        if (editingCategory) {
          // Update existing category
          await updateCategory(editingCategory._id, categoryData, token);
          const updatedData = tableData.map((item) =>
            item._id === editingCategory._id ? { ...item, ...categoryData } : item
          );
          setTableData(updatedData);
          enqueueSnackbar('Category updated successfully!');
        } else {
          // Add new category
          const response = await addCategory(categoryData, token);
          // Handle different response structures
          const newCategory = response.data?.category || response.data || response;
          // Ensure the new category has the correct structure
          const formattedCategory = {
            _id: newCategory._id || newCategory.id,
            id: newCategory._id || newCategory.id,
            name: newCategory.name,
            description: newCategory.description,
            created_at: newCategory.created_at,
            product_count: newCategory.product_count || 0,
          };
          setTableData([...tableData, formattedCategory]);
          enqueueSnackbar('Category created successfully!');
        }
        categoryModal.onFalse();
        setEditingCategory(null);
      } catch (error) {
        enqueueSnackbar('Failed to save category', { variant: 'error' });
      }
    },
    [editingCategory, enqueueSnackbar, tableData, token, categoryModal]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Category',
      flex: 1,
      minWidth: 200,
      hideable: false,
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => <RenderCellCategory params={params} />,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 300,
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || 'No description'}
        </Typography>
      ),
    },
    {
      field: 'product_count',
      headerName: 'Products',
      width: 120,
      display: 'flex',
      alignItems: 'center',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <RenderCellProductCount params={params} />,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 160,
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
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
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row._id);
          }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <CategoryTableToolbar
        filters={filters}
        onFilters={handleFilters}
      />

      <GridToolbarQuickFilter />

      <Stack
        spacing={1}
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        {!!(selectedRowIds as string[]).length && (
          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={confirmRows.onTrue}
          >
            Delete ({(selectedRowIds as string[]).length})
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
          heading="Category List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Category' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddCategory}
            >
              New Category
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
        {categoriesError && !categoriesLoading && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              API connection failed. Showing fallback data for demonstration.
            </Typography>
          </Alert>
        )}

        <Card>
          {canReset && (
            <CategoryTableFiltersResult
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
            rowCount={totalCategories || 0}
            paginationMode="server"
            paginationModel={{
              page: page - 1,
              pageSize: limit,
            }}
            onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
              setPage(newPage + 1);
              setLimit(newPageSize);
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            onSortModelChange={(model) => {
              setSortModel(model[0]);
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
            Are you sure want to delete <strong>{(selectedRowIds as string[]).length}</strong> categories?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <CategoryModal
        open={categoryModal.value}
        onClose={() => {
          categoryModal.onFalse();
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: any[];
  filters: ICategoryTableFilters;
}) {
  // Add filtering logic here when needed
  return inputData;
}
