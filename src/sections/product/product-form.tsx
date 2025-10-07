import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

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
  IProductAPIResponse,
  IProductCraeteVariation,
  IProductCreateRequest,
  IProductImage,
  IProductUpdateRequest,
  IProductVariantRow,
  IUploadProductImage,
  Pricing,
} from 'src/types/product';
import {
  createProduct,
  createVariations,
  editVariations,
  getProductById,
  updateProduct,
  uploadProductImage,
} from 'src/api/product';
import { useGetCategories } from 'src/api/category';
import Button from '@mui/material/Button';
import { PRODUCT_STATUSES, PRODUCT_VARIATION } from 'src/utils/constants';
import { IconButton, TextField } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import uuidv4 from 'src/utils/uuidv4';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { Container, styled, Theme, useTheme } from '@mui/system';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

const PRODUCT_DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'price', label: 'Fixed Amount' },
];

const emptyRow: IProductVariantRow = {
  id: uuidv4(),
  color: '',
  size: '',
  sku: '',
  price: 0,
  stock_quantity: 0,
  status: 'active' as const,
};

export default function ProductForm() {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const token = useAuthToken();
  const confirm = useBoolean();
  const theme = useTheme();
  const settings = useSettingsContext();

  // Useparams
  const params = useParams();
  const productId = params.id;

  const [hasDiscount, setHasDiscount] = useState(false);
  const [isPublishing, setIsPublishing] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [deletingRowIndex, setDeletingRowIndex] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<IProductAPIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Fetch categories from API
  const { categories, categoriesLoading, categoriesError } = useGetCategories();
  console.log('categories', categories);
  console.log('currentProduct', currentProduct);

  const imageValidationSchema = Yup.object().shape({
    image_url: Yup.string().required('Image URL is required'),
    is_primary: Yup.boolean(),
  });

  const variationValidationSchema = Yup.object().shape({
    id: Yup.string().optional(),
    color: Yup.string().required('color is required'),
    size: Yup.string().required('size is required'),
    sku: Yup.string().required('sku is required'),
    price: Yup.number().moreThan(0, 'Price must be greater than 0').required('price is required'),
    stock_quantity: Yup.number()
      .moreThan(0, 'Stock quantity cannot be negative')
      .required('stock is required'),
    status: Yup.string().required('status is required'),
  });

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    sku: Yup.string().required('SKU is required'),
    description: Yup.string().required('Description is required'),
    pricing: Yup.object().shape({
      price: Yup.number().moreThan(0, 'Price must be greater than 0'),
      mrp: Yup.number().moreThan(0, 'mrp must be greater than 0'),
      discount_type: Yup.string().nullable(),
      discount_rate: Yup.number().when('hasDiscount', {
        is: true,
        then: (schema) => schema.min(0, 'Discount rate cannot be negative'),
      }),
    }),
    stock_quantity: Yup.number().min(0, 'Stock quantity cannot be negative'),
    weight: Yup.number().min(0, 'Weight cannot be negative'),
    status: Yup.string().required('Status is required'),
    category_id: Yup.string().required('Category is required'),
    variations: Yup.array()
      .of(variationValidationSchema)
      .min(1, 'At least one variation is required')
      .required('Variations are required'),

    primary_image: Yup.array()
      .of(imageValidationSchema)
      .min(3, 'At least 3 images are required')
      .required('Images are required'),
  });

  // Transform categories for select options
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    [categories]
  );

  const defaultValues = useMemo(
    () => ({
      name: '',
      sku: '',
      description: '',
      pricing: {
        price: 0,
        mrp: 0,
        discount_type: 'percentage',
        discount_rate: 0,
      },
      stock_quantity: 0,
      weight: 0,
      status: 'published',
      category_id: '',
      primary_image: [],
      variations: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
    reValidateMode: 'onChange',
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log('values', values);
  console.log('errors', errors);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.primary_image || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          image_url: URL.createObjectURL(file),
        })
      );

      setValue('primary_image', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.primary_image]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      // const filtered = values.primary_image && values.primary_image?.filter((file) => file !== inputFile);
      // setValue('primary_image', filtered);
    },
    [setValue, values.primary_image]
  );

  const handleDiscountToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasDiscount(event.target.checked);
      if (!event.target.checked) {
        setValue('pricing.discount_type', '');
        setValue('pricing.discount_rate', 0);
      } else if (event.target.checked && currentProduct) {
        setValue('pricing.discount_type', currentProduct.discount_type);
        setValue('pricing.discount_rate', currentProduct.discount_rate);
      }
    },
    [setValue, currentProduct]
  );

  const handlePublishToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsPublishing(event.target.checked);
      setValue('status', event.target.checked ? 'published' : 'draft');
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
    if (productId) {
      // Edit code here
      const updateProductData: IProductUpdateRequest = {
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: data.pricing.price,
        discount_type: data.pricing.discount_type,
        mrp: data.pricing.mrp,
        discount_rate: data.pricing.discount_rate,
        stock_quantity: data.stock_quantity,
        weight: data.weight,
        status: data.status,
        category_id: data.category_id,
        // primary_image: {
        //   _id:
        //   product_id:
        //   image_url:
        //   is_primary:
        // };
      };

      // put API call for product data
      if (typeof productId === 'string') {
        await updateProduct(productId, updateProductData, token);
      }

      // Write logic to find deleted variations
      // Delete API call

      const tempDeleteData: string[] = [];

      currentProduct?.variations.forEach((oldVariation)=>{
        const index = data.variations.findIndex((newVariation)=>{
          return newVariation.id === oldVariation._id
        })
        if(index === -1){
          tempDeleteData.push(oldVariation._id);
        }
      })

     const deleteVariation = tempDeleteData.forEach((variation)=>{
          console.log('variation', variation)
      })


      // POST API call

      // currentProduct?.variations.forEach((variation) => {
      //   console.log('variation_id', variation?._id)

      //   data.variations.forEach(async (item) => {
      //     const variationCreate: IProductCraeteVariation = {
      //       color: item.color,
      //       sku: item.sku,
      //       size: item.size,
      //       price: item.price,
      //       status: item.status,
      //       stock_quantity: item.stock_quantity,
      //     };
      //     if (typeof productId === 'string') {
      //       variation?._id
      //         ? await editVariations(productId, variation._id, variationCreate, token)
      //         : await createVariations(productId, variationCreate, token);
      //     }
      // })     
      // });

      // Write logic to find changes added variations
      // PUT api call for others

      router.push(paths.dashboard.product.root);
    } else {
      try {
        const productData: IProductCreateRequest = {
          ...data,
          pricing: {
            mrp: data.pricing.mrp || 0,
            price: data.pricing.price || 0,
            discount_type: hasDiscount ? data.pricing.discount_type : null,
            discount_rate: hasDiscount ? data.pricing.discount_rate : 0,
          },
          stock_quantity: data.stock_quantity || 0,
          weight: data.weight || 0,
        };

        const newVariationData = productData.variations.map((product) => ({
          ...product,
          stock: product.stock_quantity,
        }));
        const { variations, ...productWithoutVariations } = productData;
        const newProductData = { ...productWithoutVariations, variations: newVariationData };

        const response = await createProduct(newProductData, token);
        const productId = response.data.product._id;

        const variationsData = data.variations.forEach(async (item) => {
          const variationCreate: IProductCraeteVariation = {
            color: item.color,
            sku: item.sku,
            size: item.size,
            price: item.price,
            status: item.status,
            stock_quantity: item.stock_quantity,
          };
          await createVariations(productId, variationCreate, token);
        });

        if (selectedFile) {
          const productImageData: IUploadProductImage = {
            product_id: '',
            image_url: '',
            is_primary: true,
            file: selectedFile || undefined,
          };
          // await uploadProductImage(productId, productImageData, token);
        }

        // enqueueSnackbar('Product created successfully!', { variant: 'success' });
        // reset();
        router.push(paths.dashboard.product.root);
      } catch (error) {
        console.error('Error creating product:', error);
        enqueueSnackbar(error instanceof Error ? error.message : 'Failed to create product', {
          variant: 'error',
        });
      }
    }
  });

  const handleAddRow = () => {
    setValue('variations', [...values.variations, emptyRow]);
  };

  const handleDeleteRow = () => {
    const newVariations = values.variations.filter((_, index) => index !== deletingRowIndex);
    setValue(`variations`, newVariations);
    confirm.onFalse();
  };

  const handlePricingChange = (field: keyof Pricing, value: string | number) => {
    setValue(`pricing.${field}`, value);
  };

  const handleClickDeleteRow = (index: number) => {
    setDeletingRowIndex(index);
    confirm.onTrue();
  };

  const getProductDataById = async () => {
    try {
      if (typeof productId === 'string') {
        const response = await getProductById(productId, token);
        setCurrentProduct(response.data.product);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  useEffect(() => {
    if (productId) {
      // API call
      getProductDataById();

      // Get product details
      // Set form values
      // setValue
    }
  }, [productId]);

  useEffect(() => {
    if (currentProduct) {
      const formKeys = [
        'name',
        'sku',
        'description',
        'stock_quantity',
        'weight',
        'status',
      ] as const;

      const pricingKeys = ['price', 'mrp', 'discount_type', 'discount_rate'] as const;
      const variationKeys = ['color', 'sku', 'size', 'price', 'stock_quantity', 'status'] as const;

      formKeys.forEach((key) => setValue(key, currentProduct[key]));
      setValue('category_id', currentProduct.category_id._id);
      pricingKeys.forEach((key) => {
        setValue(`pricing.${key}`, currentProduct[key]);
      });
      variationKeys.forEach((variationKey) =>
        currentProduct.variations.forEach((variation, index) =>
          setValue(`variations.${index}.${variationKey}`, variation[variationKey])
        )
      );
      setHasDiscount(!!(currentProduct.discount_type && currentProduct.discount_rate));
    }
  }, [currentProduct]);

  // Show error notification if categories fail to load
  useEffect(() => {
    if (categoriesError) {
      enqueueSnackbar('Failed to load categories. Please refresh the page.', {
        variant: 'error',
      });
    }
  }, [categoriesError, enqueueSnackbar]);

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
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <table>
              <tr>
                <th>Color</th>
                <th>Size</th>
                <th>Sku</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

              {values.variations.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <RHFTextField
                      name={`variations.${index}.color`}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          '& ::placeholder': {
                            textAlign: 'center',
                          },
                        },
                      }}
                      placeholder="Pink"
                      variant="standard"
                    />
                  </td>
                  <td>
                    <RHFTextField
                      name={`variations.${index}.size`}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          '& ::placeholder': {
                            textAlign: 'center',
                          },
                        },
                      }}
                      placeholder="256GB"
                      variant="standard"
                    />
                  </td>
                  <td>
                    <RHFTextField
                      name={`variations.${index}.sku`}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          '& ::placeholder': {
                            textAlign: 'center',
                          },
                        },
                      }}
                      placeholder="IPHONE15PROPINK256"
                      variant="standard"
                    />
                  </td>
                  <td>
                    <RHFTextField
                      name={`variations.${index}.price`}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          '& ::placeholder': {
                            textAlign: 'center',
                          },
                        },
                      }}
                      value={row.price === 0 ? '' : row.price}
                      placeholder="99.99"
                      variant="standard"
                      type="number"
                    />
                  </td>
                  <td>
                    <RHFTextField
                      name={`variations.${index}.stock_quantity`}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          '& ::placeholder': {
                            textAlign: 'center',
                          },
                        },
                      }}
                      value={row.stock_quantity === 0 ? '' : row.stock_quantity}
                      placeholder="30"
                      variant="standard"
                      type="number"
                    />
                  </td>
                  <td>
                    <RHFSelect
                      name={`variations.${index}.status`}
                      native
                      label="Status"
                      InputLabelProps={{ shrink: true }}
                      value={row.status}
                      onChange={(e) => {
                        setValue(`variations.${index}.status`, e.target.value);
                      }}
                    >
                      {PRODUCT_VARIATION.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </td>
                  <td>
                    <IconButton
                      onClick={() => handleClickDeleteRow(index)}
                      sx={{ color: 'error.main' }}
                      aria-label="remove"
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </table>
            <div style={{ textAlign: 'right', marginTop: '16px', marginRight: '32px' }}>
              <Button variant="contained" onClick={handleAddRow}>
                Add New Item
              </Button>
            </div>
            {errors?.variations && (
              <div style={{ color: theme.palette.error.main, fontSize: 12, padding: '0px 16px' }}>
                {' '}
                {errors.variations.message}
              </div>
            )}
          </Stack>
        </Card>
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
              disabled={categoriesLoading}
              placeholder="Select a category"
            >
              {categoriesLoading ? (
                <option value="" disabled>
                  Loading categories...
                </option>
              ) : categoriesError ? (
                <option value="" disabled>
                  Error loading categories
                </option>
              ) : (
                categoryOptions.map((category) => {
                  return (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  );
                })
              )}
            </RHFSelect>

            <RHFSelect native name="status" label="Status" InputLabelProps={{ shrink: true }}>
              {PRODUCT_STATUSES.map((status) => (
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

  const renderPricing = (
    <>
      {mdUp && (
        <>
          <Grid md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Pricing & Inventory
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Price and stock information
            </Typography>
          </Grid>
        </>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing & Inventory" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="pricing.mrp"
              label="mrp"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => handlePricingChange('mrp', e.target.value)}
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
              name="pricing.price"
              label="Price"
              placeholder="0.00"
              type="number"
              onChange={(e) => handlePricingChange('price', e.target.value)}
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
                <RHFSelect
                  native
                  name="pricing.discount_type"
                  label="Discount Type"
                  onChange={(e) => handlePricingChange('discount_type', e.target.value)}
                >
                  {PRODUCT_DISCOUNT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField
                  name="pricing.discount_rate"
                  label="Discount Rate"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handlePricingChange('discount_rate', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          {values.pricing.discount_type === 'percentage' ? '%' : '$'}
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
              onChange={(e) => setValue('stock_quantity', Number(e.target.value))}
            />
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
              multiple
              thumbnail
              name="primary_image"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
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
          disabled={isSubmitting}
        >
          {productId ? 'Update Product' : 'Create Product'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderBasicInfo}
          {renderImage}
          {renderVariation}
          {renderPricing}
          {renderAttributes}
          {renderActions}
        </Grid>
      </FormProvider>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete?</>}
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
