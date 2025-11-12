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
import Alert from '@mui/material/Alert';

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
  EditProductRequest,
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
  deleteProductImage,
  deleteVariation,
  editVariations,
  getProductById,
  updateProduct,
  updateProductImage,
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
import Upload from 'src/components/upload/upload';
import { useDropzone } from 'react-dropzone';
import Avatar from '@mui/material/Avatar';

// ----------------------------------------------------------------------

const PRODUCT_DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'price', label: 'Fixed Amount' },
];

const emptyRow = (): IProductVariantRow => {
  return {
    id: uuidv4(),
    color: '',
    size: '',
    sku: '',
    price: 0,
    stock_quantity: 0,
    isLocal: true,
  };
}

const imageValidationSchema = Yup.object().shape({
  id: Yup.string().required('Image ID is required'),
  isFile: Yup.boolean().required('IsFile flag is required'),
  file: Yup.mixed().nullable(),
  url: Yup.string().nullable(),
  primary: Yup.boolean().required('Primary flag is required'),
});

const variationValidationSchema = Yup.object().shape({
  id: Yup.string().optional(),
  color: Yup.string().required('Color is required'),
  size: Yup.string().required('Size is required'),
  sku: Yup.string().required('SKU is required'),
  price: Yup.number().moreThan(0, 'Price must be greater than 0').required('Price is required'),
  stock_quantity: Yup.number()
    .min(0, 'Stock quantity cannot be negative')
    .required('Stock quantity is required'),
});

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  sku: Yup.string().required('SKU is required'),
  description: Yup.string().required('Description is required'),
  pricing: Yup.object().shape({
    price: Yup.number().moreThan(0, 'Price must be greater than 0').required('Price is required'),
    mrp: Yup.number().moreThan(0, 'MRP must be greater than 0').required('MRP is required'),
    discount_type: Yup.string().when('isDiscount', {
      is: true,
      then: (schema) => schema.required('Discount type is required when discount is enabled'),
      otherwise: (schema) => schema,
    }),
    discount_rate: Yup.string().when('isDiscount', {
      is: true,
      then: (schema) => schema
        .required('Discount rate is required when discount is enabled')
        .test('is-valid-number', 'Discount rate must be a valid number', (value) => {
          if (!value) return false;
          const num = parseFloat(value);
          return !isNaN(num) && num > 0;
        })
        .test('percentage-limit', 'Percentage discount cannot exceed 100%', function (value) {
          const { parent } = this;
          if (parent.discount_type === 'percentage' && value) {
            const num = parseFloat(value);
            return !isNaN(num) && num <= 100;
          }
          return true;
        }),
      otherwise: (schema) => schema,
    }),
    isDiscount: Yup.boolean(),
  }),
  stock_quantity: Yup.number().min(0, 'Stock quantity cannot be negative'),
  weight: Yup.number().min(0, 'Weight cannot be negative'),
  status: Yup.string().required('Status is required'),
  category_id: Yup.string().required('Category is required'),
  variations: Yup.array()
    .of(variationValidationSchema)
    .test('variation-validation', 'All variation fields are required when variations are added', function (variations) {
      if (!variations || variations.length === 0) {
        return true; // No variations is valid
      }

      // Check if any variation has empty required fields
      const hasEmptyFields = variations.some(variation =>
        !variation.color || !variation.size || !variation.sku ||
        variation.price <= 0 || variation.stock_quantity < 0
      );

      if (hasEmptyFields) {
        return this.createError({
          message: 'Please complete all fields in existing variations before adding new ones',
          path: 'variations',
        });
      }

      return true;
    }),
  productImages: Yup.array()
    .of(imageValidationSchema)
    .min(1, 'At least 1 image is required')
    .required('Images are required'),
});

const defaultValues = {
  name: '',
  sku: '',
  description: '',
  pricing: {
    price: 0,
    mrp: 0,
    discount_type: '',
    discount_rate: '',
    isDiscount: false,
  },
  stock_quantity: 0,
  weight: 0,
  status: 'published',
  category_id: '',
  productImages: [],
  variations: [],
}

export default function ProductForm() {
  const theme = useTheme();
  const router = useRouter();
  const token = useAuthToken();
  const confirm = useBoolean();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();

  // Useparams
  const params = useParams();
  const productId = params.id;

  const [actualProductData, setActualProductData] = useState<any>(null);
  const [deletingRowIndex, setDeletingRowIndex] = useState<number | null>(null);
  const { categories, categoriesLoading, categoriesError } = useGetCategories();



  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
    reValidateMode: 'onChange',
  });

  const {
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();


  const handlePublishToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('status', event.target.checked ? 'published' : 'draft');
    },
    [setValue]
  );

  const handleDiscountToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;

    // Update isDiscount field
    setValue('pricing.isDiscount', isEnabled);

    // Clear discount values when disabled
    if (!isEnabled) {
      setValue('pricing.discount_type', '');
      setValue('pricing.discount_rate', '');
    } else {
      // Set default values when enabled
      setValue('pricing.discount_type', 'percentage');
      setValue('pricing.discount_rate', '0');
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('===========================', data);
    // Create final submit data with proper null conversion
    delete data.pricing.isDiscount;
    const finalData = {
      ...data,
      pricing: {
        ...data.pricing,
        discount_type: data.pricing.discount_type === '' ? null : data.pricing.discount_type,
        discount_rate: data.pricing.discount_rate === '' ? null : parseFloat(data.pricing.discount_rate || '0'),
      }
    };

    console.log('===========================', productId,finalData);


    if (productId) {
      // data format
      // {
      //   "_id": "68ef7466eeaaa9a009ec4c06",
      //   "name": "test003",
      //   "sku": "TEST003",
      //   "description": "test003",
      //   "product_description": "<p>Latest iPhone with <strong>advanced features</strong> and <em>titanium design</em></p><ul><li>48MP Main camera</li><li>A17 Pro chip</li><li>Titanium build</li><li>Action Button</li></ul>",
      //   "price": 21,
      //   "mrp": 12,
      //   "discount_type": null,
      //   "discount_rate": 0,
      //   "stock_quantity": 5656,
      //   "weight": 1210,
      //   "status": "published",
      //   "category_id": 68dbc38cae58105f43785c17
      //   "featured": false,
      // }
      const payload: EditProductRequest = {
        "name": finalData.name,
        "sku": finalData.sku,
        "description": finalData.description,
        "product_description": "<p>Latest iPhone with <strong>advanced features</strong> and <em>titanium design</em></p><ul><li>48MP Main camera</li><li>A17 Pro chip</li><li>Titanium build</li><li>Action Button</li></ul>",
        "price": finalData.pricing.price.toString(),
        "mrp": finalData.pricing.mrp.toString(),
        "discount_type": finalData.pricing.discount_type || null,
        "discount_rate": finalData.pricing.discount_rate ? finalData.pricing.discount_rate.toString() : null,
        "stock_quantity": finalData.stock_quantity?.toString() || '',
        "weight": finalData.weight?.toString() || '',
        "status": finalData.status,
        "category_id": finalData.category_id,
      }

      try {
        const response = await updateProduct(productId as string, payload, token);
        console.log('Product created successfully!', response);

        const globalPromisesManager = [];
        const imagesToDelete = actualProductData.productImages.filter((image: any) => !finalData.productImages.some((newImage: any) => newImage.id === image.id));
        const imagesToUpload = finalData.productImages.filter((image: any) => image.isFile);
        const imagesToUpdate = finalData.productImages.filter((image: any) => !image.isFile);

        if (imagesToDelete.length > 0) {
          const deleteImagesPromises = imagesToDelete.map(async (image: any) => {
            const response = await deleteProductImage(image.id, token);
            console.log(`Image deleted successfully! ${image.id}:`, response);
            return response;
          });
          globalPromisesManager.push(...deleteImagesPromises);
        }

        if (imagesToUpload.length > 0) {
          const uploadImagesPromises = imagesToUpload.map(async (image: any) => {
            const imageData = {
              product_id: productId as string,
              is_primary: image.primary || false,
              file: image.file as File,
            };
            const response = await uploadProductImage(imageData, token);
            console.log(`Image uploaded successfully! ${image.id}:`, response);
            return response;
          });
          globalPromisesManager.push(...uploadImagesPromises);
        }

        if (imagesToUpdate.length > 0) {
          const updateImagesPromises = imagesToUpdate.map(async (image: any) => {
            const response = await updateProductImage(image.id, { is_primary: image.primary }, token);
            console.log(`Image updated successfully! ${image.id}:`, response);
            return response;
          });
          globalPromisesManager.push(...updateImagesPromises);
        }

        const variationToAdd = finalData.variations?.filter((variation: any) => variation.isLocal) ?? []
        const variationToDelete = actualProductData.variations?.filter((variation: any) => !finalData.variations?.some((newVariation: any) => newVariation.id === variation.id)) ?? []
        const variationToUpdate = finalData.variations?.filter((variation: any) => !variation.isLocal) ?? []

        if (variationToDelete.length > 0) {
          const deleteVariationsPromises = variationToDelete.map(async (variation: any) => {
            const response = await deleteVariation(productId as string, variation.id, token);
            console.log(`Variation deleted successfully! ${variation.id}:`, response);
            return response;
          });
          globalPromisesManager.push(...deleteVariationsPromises);
        }
        if (variationToUpdate.length > 0) {
          const updateVariationsPromises = variationToUpdate.map(async (variation: any) => {
            const payload = {
              "color": variation.color,
              "size": variation.size,
              "sku": variation.sku,
              "price": variation.price,
              "stock_quantity": variation.stock_quantity,
              "status": 'active',
            }
            const response = await editVariations(productId as string, variation.id, payload, token);
            console.log(`Variation updated successfully! ${variation.id}:`, response);
            return response;
          });
          globalPromisesManager.push(...updateVariationsPromises);
        }
        if (variationToAdd.length > 0) {
          const addVariationsPromises = variationToAdd.map(async (variation: any) => {
            const payload = {
              "color": variation.color,
              "size": variation.size,
              "sku": variation.sku,
              "price": variation.price,
              "stock_quantity": variation.stock_quantity,
              "status": 'active',
            }
            const response = await createVariations(productId as string, payload, token);
            console.log(`Variation added successfully! ${variation.id}:`, response);
            return response;
          });
          globalPromisesManager.push(...addVariationsPromises);
        }
        await Promise.all(globalPromisesManager);
        enqueueSnackbar('Product updated successfully!', { variant: 'success' });
        router.push(paths.dashboard.product.root);

      } catch (error) {
        console.error('Error creating product:', error);
        enqueueSnackbar(error instanceof Error ? error.message : 'Failed to create product', {
          variant: 'error',
        });
      }
    } else {
      const payload = {
        "name": finalData.name,
        "sku": finalData.sku,
        "description": finalData.description,
        "product_description": "<p>Latest iPhone with <strong>advanced features</strong> and <em>titanium design</em></p><ul><li>48MP Main camera</li><li>A17 Pro chip</li><li>Titanium build</li><li>Action Button</li></ul>",
        "category_id": finalData.category_id,
        "status": finalData.status,
        "variations": finalData.variations,
        "pricing": {
          "mrp": finalData.pricing.mrp,
          "price": finalData.pricing.price,
          "discount_type": finalData.pricing.discount_type,
          "discount_rate": finalData.pricing.discount_rate
        },
        "stock_quantity": finalData.stock_quantity,
        "weight": finalData.weight
      }

      try {
        const response = await createProduct(payload, token);
        console.log('Product created successfully!', response);
        const newProductId = response.data?.product?._id;

        if (newProductId) {
          // Upload images
          const imagesPromises = finalData.productImages.map(async (image: any, index: number) => {
            const imageData = {
              product_id: newProductId,
              is_primary: image.primary || false,
              file: image.file as File,
            };
            const response = await uploadProductImage(imageData, token);
            console.log(`Image uploaded successfully! ${index + 1}:`, response);
            return response;
          });

          await Promise.all(imagesPromises);

          enqueueSnackbar('Product created successfully!', { variant: 'success' });
          router.push(paths.dashboard.product.root);
        }
      } catch (error) {
        console.error('Error creating product:', error);
        enqueueSnackbar(error instanceof Error ? error.message : 'Failed to create product', {
          variant: 'error',
        });
      }
    }

  });

  const handleAddRow = () => {
    const currentVariations = values.variations || [];

    // If there are existing variations, validate them first
    if (currentVariations.length > 0) {
      // Check if any existing variation has empty required fields
      const hasInvalidRows = currentVariations.some(variation =>
        !variation.color || !variation.size || !variation.sku ||
        variation.price <= 0 || variation.stock_quantity < 0
      );

      if (hasInvalidRows) {
        // Trigger validation to show errors
        trigger('variations');

        // Show a user-friendly message
        enqueueSnackbar('Please complete all fields in existing variations before adding a new one', {
          variant: 'warning',
        });
        return;
      }
    }

    // If validation passes, add the new row
    setValue('variations', [...currentVariations, emptyRow()]);
  };

  const handleImageUpload = useCallback((acceptedFiles: File[]) => {
    const currentImages = values.productImages || [];
    const isFirstImage = currentImages.length === 0;

    const newImages = acceptedFiles.map((file) => ({
      id: uuidv4(),
      isFile: true,
      file: file,
      url: URL.createObjectURL(file),
      primary: false, // Will be set to true for first image if no images exist
    }));

    // If this is the first image, make it primary
    if (isFirstImage && newImages.length > 0) {
      newImages[0].primary = true;
    }

    const updatedImages = [...currentImages, ...newImages];
    setValue('productImages', updatedImages);

    // Trigger revalidation to clear any errors
    trigger('productImages');

  }, [values.productImages, setValue, trigger]);

  const handleImageDelete = useCallback((imageId: string) => {
    const currentImages = values.productImages || [];
    const imageToDelete = currentImages.find(img => img.id === imageId);
    const updatedImages = currentImages.filter((img) => img.id !== imageId);

    // If we're deleting the primary image, make the first remaining image primary
    if (imageToDelete?.primary && updatedImages.length > 0) {
      updatedImages[0].primary = true;
    }

    setValue('productImages', updatedImages);
    trigger('productImages');
  }, [values.productImages, setValue, trigger]);

  const handleSetPrimaryImage = useCallback((imageId: string) => {
    const currentImages = values.productImages || [];
    const updatedImages = currentImages.map((img) => ({
      ...img,
      primary: img.id === imageId,
    }));

    setValue('productImages', updatedImages);
    trigger('productImages');
  }, [values.productImages, setValue, trigger]);

  // Dropzone hook for file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
  });

  const handleDeleteRow = () => {
    const newVariations = values.variations?.filter((_, index) => index !== deletingRowIndex);
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
      if (productId) {
        let response = await getProductById(productId as string, token);
        response = response.data.product;

        if (response) {
          const imagesFromResponse = response?.images?.map((image: any) => ({
            id: image._id,
            url: image?.image_url,
            isFile: false,
            primary: image.is_primary,
          }));

          const variationsFromResponse = response.variations.map((variation: any) => ({
            id: variation._id,
            color: variation.color,
            size: variation.size,
            sku: variation.sku,
            price: variation.price,
            stock_quantity: variation.stock_quantity,
          }));

          const valuesFromResponse = {
            name: response.name,
            sku: response.sku,
            description: response.description,
            pricing: {
              price: response.price,
              mrp: response.mrp,
              discount_type: response.discount_type || '',
              discount_rate: response.discount_rate || '',
            },
            stock_quantity: response.stock_quantity,
            weight: response.weight,
            status: response.status,
            category_id: response.category_id._id,
            productImages: imagesFromResponse,
            variations: variationsFromResponse,
          }

          Object.keys(valuesFromResponse).forEach((key) => {
            setValue(key as keyof typeof valuesFromResponse, valuesFromResponse[key as keyof typeof valuesFromResponse]);
          });

          setValue('pricing.isDiscount', !!response.discount_type);
          setActualProductData({
            ...valuesFromResponse
          });
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };



  useEffect(() => {
    if (productId) {
      getProductDataById();
    }
  }, [productId]);

  // Show error notification if categories fail to load
  useEffect(() => {
    if (categoriesError) {
      enqueueSnackbar('Failed to load categories. Please refresh the page.', {
        variant: 'error',
      });
    }
  }, [categoriesError, enqueueSnackbar]);


  console.log('errors', errors, values);
  
  const renderVariation = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Variations
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Add color and size variations (optional)
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Product Variations" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Variations Table */}
            {values.variations && values.variations.length > 0 && (
              <Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Color
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Size
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    SKU
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Price ($)
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Stock
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Actions
                  </Typography>
                </Box>

                {values.variations.map((row, index) => {
                  const isRowIncomplete = !row.color || !row.size || !row.sku ||
                    row.price <= 0 || row.stock_quantity < 0;

                  return (
                    <Box
                      key={row.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: 2,
                        p: 2,
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 2,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {/* Color Field */}
                      <Box>
                        <RHFTextField
                          name={`variations.${index}.color`}
                          placeholder="e.g., Red"
                          size="small"
                          fullWidth
                        />
                        {errors?.variations?.[index]?.color && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.variations[index].color.message}
                          </Typography>
                        )}
                      </Box>

                      {/* Size Field */}
                      <Box>
                        <RHFTextField
                          name={`variations.${index}.size`}
                          placeholder="e.g., Large"
                          size="small"
                          fullWidth
                        />
                        {errors?.variations?.[index]?.size && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.variations[index].size.message}
                          </Typography>
                        )}
                      </Box>

                      {/* SKU Field */}
                      <Box>
                        <RHFTextField
                          name={`variations.${index}.sku`}
                          placeholder="e.g., PROD-RED-L"
                          size="small"
                          fullWidth
                        />
                        {errors?.variations?.[index]?.sku && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.variations[index].sku.message}
                          </Typography>
                        )}
                      </Box>

                      {/* Price Field */}
                      <Box>
                        <RHFTextField
                          name={`variations.${index}.price`}
                          placeholder="0.00"
                          type="number"
                          size="small"
                          fullWidth
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
                        {errors?.variations?.[index]?.price && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.variations[index].price.message}
                          </Typography>
                        )}
                      </Box>

                      {/* Stock Field */}
                      <Box>
                        <RHFTextField
                          name={`variations.${index}.stock_quantity`}
                          placeholder="0"
                          type="number"
                          size="small"
                          fullWidth
                        />
                        {errors?.variations?.[index]?.stock_quantity && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.variations[index].stock_quantity.message}
                          </Typography>
                        )}
                      </Box>

                      {/* Delete Button */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => handleClickDeleteRow(index)}
                          size="small"
                          sx={{
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: 'error.lighter',
                            }
                          }}
                          aria-label="remove variation"
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Add Variation Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleAddRow}
                disabled={(() => {
                  const currentVariations = values.variations || [];
                  if (currentVariations.length === 0) return false;

                  const hasInvalidRows = currentVariations.some(variation =>
                    !variation.color || !variation.size || !variation.sku ||
                    variation.price <= 0 || variation.stock_quantity < 0
                  );

                  return hasInvalidRows;
                })()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                }}
              >
                Add Variation
              </Button>
            </Box>

            {/* Validation Status Message */}
            {values.variations && values.variations.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {(() => {
                  const hasInvalidRows = values.variations.some(variation =>
                    !variation.color || !variation.size || !variation.sku ||
                    variation.price <= 0 || variation.stock_quantity < 0
                  );

                  if (hasInvalidRows) {
                    return (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Complete all fields in existing variations to add new ones.
                        </Typography>
                      </Alert>
                    );
                  }

                  return (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        All variations are complete. You can add more variations.
                      </Typography>
                    </Alert>
                  );
                })()}
              </Box>
            )}

            {/* General Variations Error */}
            {errors?.variations && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.variations.message}
              </Alert>
            )}

            {/* Info Message */}
            {(!values.variations || values.variations.length === 0) && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Variations are optional. Add color and size variations if your product comes in different options.
                </Typography>
              </Alert>
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
              <option value="">Select a category</option>
              {categoriesLoading ? (
                <option value="" disabled>
                  Loading categories...
                </option>
              ) : categoriesError ? (
                <option value="" disabled>
                  Error loading categories
                </option>
              ) : (
                categories.map((category) => {
                  return (
                    <option key={category._id} value={category._id}>
                      {category.name}
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
              label="MRP"
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
              control={<Switch checked={values.pricing.isDiscount} onChange={handleDiscountToggle} />}
              label="Enable discount"
            />

            {values.pricing.isDiscount && (
              <Box>
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
            Product Images
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Upload product images
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Product Images" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Upload Area */}
            <Box
              {...getRootProps()}
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: errors?.productImages
                  ? 'error.main'
                  : isDragActive
                    ? 'primary.main'
                    : 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive
                  ? 'action.hover'
                  : errors?.productImages
                    ? 'error.lighter'
                    : 'transparent',
                '&:hover': {
                  borderColor: errors?.productImages
                    ? 'error.main'
                    : 'primary.main',
                  backgroundColor: errors?.productImages
                    ? 'error.lighter'
                    : 'action.hover',
                },
              }}
            >
              <input {...getInputProps()} />
              <Stack spacing={2} alignItems="center">
                <Iconify
                  icon="eva:cloud-upload-fill"
                  width={48}
                  sx={{
                    color: errors?.productImages
                      ? 'error.main'
                      : isDragActive
                        ? 'primary.main'
                        : 'text.secondary'
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: errors?.productImages
                      ? 'error.main'
                      : 'text.primary'
                  }}
                >
                  {isDragActive
                    ? 'Drop the images here...'
                    : 'Drop images here or click to browse'
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports: JPEG, PNG, GIF, WebP
                </Typography>
              </Stack>
            </Box>

            {/* Image Preview Grid */}
            {values.productImages && values.productImages.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Uploaded Images ({values.productImages.length})
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Click on any image to set it as primary. The primary image will be used as the main product image.
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 2,
                  }}
                >
                  {values.productImages.map((image) => (
                    <Box
                      key={image.id}
                      onClick={() => handleSetPrimaryImage(image.id)}
                      sx={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: image.primary ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: image.primary ? 'primary.dark' : 'primary.main',
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <Avatar
                        src={image.url || ''}
                        variant="square"
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 1,
                        }}
                      />

                      {/* Primary Badge */}
                      {image.primary && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            px: 0.7,
                            py: 0.4,
                            borderRadius: 0.5,
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                          }}
                        >
                          Primary
                        </Box>
                      )}

                      {/* Delete Button */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageDelete(image.id);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <Iconify icon="eva:close-fill" width={16} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Error Display */}
            {errors?.productImages && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.productImages.message}
              </Typography>
            )}
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
          control={<Switch checked={values.status === 'published'} onChange={handlePublishToggle} />}
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
          {renderPricing}
          {renderAttributes}
          {renderVariation}
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
