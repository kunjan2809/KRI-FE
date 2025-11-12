import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthToken } from 'src/auth/hooks';


import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

import {
  IProductCreateRequest,
  IProductAPIResponse,
  IUploadProductImage,
  IProductVariantRow,
  IProductCraeteVariation,
  IProductUpdateRequest,
} from 'src/types/product';
import { updateProduct, uploadProductImage } from 'src/api/product';
import {
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import uuidv4 from 'src/utils/uuidv4';
import { PRODUCT_VARIATION } from 'src/utils/constants';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

const PRODUCT_STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const PRODUCT_DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'price', label: 'Fixed Amount' },
];

const PRODUCT_CATEGORY_OPTIONS = [
  { value: '68ac57e6369f49730a420078', label: 'Clothing' },
  { value: '68c254ab71de36f4af862a6e', label: 'Rings' },
];

type Props = {
  productId: string;
  currentProduct?: IProductAPIResponse;
};

export default function ProductUpdateForm({ productId, currentProduct }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const token = useAuthToken();
  const confirm = useBoolean();

  const [hasDiscount, setHasDiscount] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const ProductSchema = Yup.object().shape({
  //     name: Yup.string().required('Product name is required'),
  //     sku: Yup.string().required('SKU is required'),
  //     description: Yup.string()
  //         .required('Description is required')
  //         .test('is-not-empty', 'Description is required', (value) => {
  //             if (!value) return false;
  //             // Remove HTML tags and check if there's actual content
  //             const textContent = value.replace(/<[^>]*>/g, '').trim();
  //             return textContent.length > 0;
  //         }),
  //     price: Yup.number().moreThan(0, 'Price must be greater than 0'),
  //     stock_quantity: Yup.number().min(0, 'Stock quantity cannot be negative'),
  //     color: Yup.string().required('Color is required'),
  //     weight: Yup.number().min(0, 'Weight cannot be negative'),
  //     status: Yup.string().required('Status is required'),
  //     category_id: Yup.string().required('Category is required'),
  //     discount_type: Yup.string().nullable(),
  //     discount_rate: Yup.number().when('hasDiscount', {
  //         is: true,
  //         then: (schema) => schema.min(0, 'Discount rate cannot be negative'),
  //     }),
  //     primary_image: Yup.object().shape({
  //         image_url: Yup.string().required('Primary image is required'),
  //         alt_text: Yup.string().required('Alt text is required'),
  //     })
  // });
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const variationValidationSchema = Yup.object().shape({
    id: Yup.string().required('id is required'),
    color: Yup.string().required('color is required'),
    size: Yup.string().required('size is required'),
    sku: Yup.string().required('sku is required'),
    price: Yup.number().moreThan(0, 'Price must be greater than 0').required('price is required'),
    stock_quantity: Yup.number().min(0, 'Stock quantity cannot be negative').required('stock is required'),
    status: Yup.string().required('status is required'),
  });

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    sku: Yup.string().required('SKU is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().moreThan(0, 'Price must be greater than 0'),
    mrp: Yup.number().moreThan(0, 'mrp must be greater than 0'),
    stock_quantity: Yup.number().min(0, 'Stock quantity cannot be negative'),
    weight: Yup.number().min(0, 'Weight cannot be negative'),
    status: Yup.string().required('Status is required'),
    category_id: Yup.string().required('Category is required'),
    discount_type: Yup.string().nullable(),
    discount_rate: Yup.number().when('hasDiscount', {
      is: true,
      then: (schema) => schema.min(0, 'Discount rate cannot be negative'),
    }),
    primary_image: Yup.object().shape({
      image_url: Yup.string().required('Primary image is required'),
      alt_text: Yup.string().required('Alt text is required'),
    }),
    variations: Yup.array().of(variationValidationSchema).required('Variations are required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentProduct?._id,
      name: currentProduct?.name || '',
      sku: currentProduct?.sku || '',
      description: currentProduct?.description || '',
      price: currentProduct?.price || 0,
      mrp: currentProduct?.mrp || 0,
      discount_type: currentProduct?.discount_type || null,
      discount_rate: currentProduct?.discount_rate || 0,
      stock_quantity: currentProduct?.stock_quantity || 0,
      weight: currentProduct?.weight || 0,
      status: currentProduct?.status || 'published',
      category_id: currentProduct?.category_id?._id || '',
      category_name: currentProduct?.category_id?.name || '',
      primary_image: {
        image_url: currentProduct?.primary_image?.image_url || '',
        alt_text: currentProduct?.primary_image?.alt_text || '',
        is_primary: true,
        sort_order: 1,
      },
      variations: currentProduct?.variations.map((item) => ({
        id: item.id,
        color: item.color,
        size: item.size,
        sku: item.sku,
        price: item.price,
        stock_quantity: item.stock_quantity,
        status: item.status
      })) || [],
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  // Initialize form with current product data
  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
      setHasDiscount(!!currentProduct.discount_type);
      setIsPublishing(currentProduct.status === 'published');
    }
  }, [currentProduct, defaultValues, reset]);

  const handleDiscountToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasDiscount(event.target.checked);
      if (!event.target.checked) {
        setValue('discount_type', null);
        setValue('discount_rate', 0);
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('primary_image.image_url', '');
    setValue('primary_image.alt_text', '');
    setSelectedFile(null);
  }, [setValue]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const imageUrl = URL.createObjectURL(file);
        setValue('primary_image.image_url', imageUrl);
        setValue('primary_image.alt_text', file.name);
        setSelectedFile(file);
      }
    },
    [setValue]
  );

  const handlePublishToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsPublishing(event.target.checked);
      setValue('status', event.target.checked ? 'published' : 'draft');
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!token) {
        enqueueSnackbar('Authentication required', { variant: 'error' });
        return;
      }

      setIsLoading(true);

      const productData: IProductUpdateRequest = {
        ...data,
        discount_type: hasDiscount ? data.discount_type || null : null,
        discount_rate: hasDiscount ? data.discount_rate || 0 : 0,
        price: data.price || 0,
        mrp: data.mrp || 0,
        stock_quantity: data.stock_quantity || 0,
        weight: data.weight || 0,
      };


      // Only upload image if a new file is selected
      if (selectedFile) {

        const productImageData: IUploadProductImage = {
          product_id: productId,
          image_url: data.primary_image?.image_url || '',
          is_primary: true,
          file: selectedFile || undefined,
        };
        await uploadProductImage(productId, productImageData, token);
      }
      await updateProduct(productId, productData, token);


      enqueueSnackbar('Product updated successfully!', { variant: 'success' });
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error('Error updating product:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to update product', {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  });

  const emptyRow: IProductVariantRow = {
    id: uuidv4(),
    color: '',
    size: '',
    sku: '',
    price: 0,
    stock_quantity: 0,
    status: '',
  };

  const handleAddRow = () => {
    setValue('variations', [...values.variations, emptyRow]);
  };

  const handleChange = (id: string, field: keyof IProductVariantRow, value: string | number) => {
    setValue('variations', values.variations.map((variations) => (variations.id === id ? { ...variations, [field]: value } : variations))
    );
    const index = values.variations.findIndex((row) => row.id === id);
    if (index !== -1) {
      setValue(`variations.${index}.${field}`, value);
    }

    setTimeout(() => {
      const selectedInput = document.getElementById(`${id}-${field}`);
      selectedInput && selectedInput.focus();
    }, 0);
  };

  const handleDeleteRow = (id: string) => {
    setValue('variations', values.variations.filter((item) => item.id !== id));
  };

  const renderVariation = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Variation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Variation details
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <div>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Color</StyledTableCell>
                <StyledTableCell align="center">Size</StyledTableCell>
                <StyledTableCell align="center">Sku</StyledTableCell>
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">Stock</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.variations.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    <TextField
                      {...register(`variations.${index}.color`)}
                      id={`${row.id}-color`}
                      name="color"
                      value={row.color}
                      placeholder="Pink"
                      onChange={(e) => {
                        handleChange(row.id, 'color', e.target.value);
                      }}
                      variant="standard"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      {...register(`variations.${index}.size`)}
                      id={`${row.id}-size`}
                      name="size"
                      placeholder="256GB"
                      value={row.size}
                      onChange={(e) => {
                        handleChange(row.id, 'size', e.target.value);
                      }}
                      variant="standard"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      {...register(`variations.${index}.sku`)}
                      id={`${row.id}-sku`}
                      name="sku"
                      placeholder="IPHONE15PRO-PINK-256"
                      value={row.sku}
                      onChange={(e) => {
                        handleChange(row.id, 'sku', e.target.value);
                      }}
                      variant="standard"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      {...register(`variations.${index}.price`)}
                      id={`${row.id}-price`}
                      name="price"
                      placeholder="99.99"
                      value={row.price === 0 ? '' : row.price}
                      onChange={(e) => {
                        handleChange(row.id, 'price', e.target.value);
                      }}
                      variant="standard"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      {...register(`variations.${index}.stock_quantity`)}
                      id={`${row.id}-stock_quantity`}
                      name="stock_quantity"
                      placeholder="30"
                      value={row.stock_quantity === 0 ? '' : row.stock_quantity}
                      onChange={(e) => {
                        handleChange(row.id, 'stock_quantity', e.target.value);
                      }}
                      variant="standard"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <RHFSelect
                      {...register(`variations.${index}.status`)}
                      id={`${row.id}-status`}
                      name="status"
                      native
                      label="Status"
                      InputLabelProps={{ shrink: true }}
                      value={row.status}
                      onChange={(e) => {
                        handleChange(row.id, 'status', e.target.value);
                      }}
                    >
                      {PRODUCT_VARIATION.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      onClick={confirm.onTrue}
                      sx={{ color: 'error.main' }}
                      aria-label="remove"
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>

                    <ConfirmDialog
                      open={confirm.value}
                      onClose={confirm.onFalse}
                      title="Delete"
                      content={<>Are you sure want to delete?</>}
                      action={
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            handleDeleteRow(row.id);
                            confirm.onFalse();
                          }}
                        >
                          Delete
                        </Button>
                      }
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div style={{ textAlign: 'right', marginTop: '16px', marginRight: '32px' }}>
          <Button variant="contained" onClick={handleAddRow}>
            Add New Item
          </Button>
        </div>
      </Grid>
    </>
  );

  const renderBasicInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Basic Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Essential product details
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Basic Information" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Product Name" />

            <RHFTextField name="sku" label="SKU" />

            <RHFTextField name="description" label="Description" multiline rows={4} />

            <RHFSelect
              native
              name="category_id"
              label="Category"
              InputLabelProps={{ shrink: true }}

            >
              <option value="" />
              {PRODUCT_CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </RHFSelect>

            <RHFSelect native name="status" label="Status" InputLabelProps={{ shrink: true }}>
              {PRODUCT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </RHFSelect>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderImage = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Image
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Primary product image
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Product Image" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFUpload
              multiple={false}
              thumbnail
              name="primary_image.image_url"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onUpload={() => console.info('ON UPLOAD')}
            />

            {/* <RHFTextField
                            name="primary_image.alt_text"
                            label="Alt Text"
                            placeholder="Describe the image for accessibility"
                        /> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing & Inventory
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price and stock information
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing & Inventory" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="mrp"
              label="mrp"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="price"
              label="Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Switch checked={hasDiscount} onChange={handleDiscountToggle} />}
              label="Enable discount"
            />

            {hasDiscount && (
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFSelect native name="discount_type" label="Discount Type">
                  {PRODUCT_DISCOUNT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField
                  name="discount_rate"
                  label="Discount Rate"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          {values.discount_type === 'percentage' ? '%' : '$'}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}


          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAttributes = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Attributes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Physical characteristics
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Product Attributes" />}

          <Stack spacing={3} sx={{ p: 3 }}>

            <RHFTextField
              name="weight"
              label="Weight (kg)"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="stock_quantity"
              label="Stock Quantity"
              placeholder="0"
              type="number"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch checked={isPublishing} onChange={handlePublishToggle} />}
          label="Publish immediately"
          sx={{ flexGrow: 1, pl: 3 }}
        />
       
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          component={Button}
          disabled={isSubmitting || isLoading}
        >
          Update Product
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderBasicInfo}
        {renderVariation}
        {renderImage}
        {renderPricing}
        {renderAttributes}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
