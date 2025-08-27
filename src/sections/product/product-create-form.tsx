import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

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

import { IProductCreateRequest } from 'src/types/product';
import { createProduct } from 'src/api/product';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

const PRODUCT_STATUS_OPTIONS = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
];

const PRODUCT_DISCOUNT_TYPE_OPTIONS = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' },
];

const PRODUCT_CATEGORY_OPTIONS = [
    { value: '68ac57e6369f49730a420078', label: 'Clothing' }
];  

export default function ProductCreateForm() {
    const router = useRouter();
    const mdUp = useResponsive('up', 'md');
    const { enqueueSnackbar } = useSnackbar();
    const token = useAuthToken();

    const [hasDiscount, setHasDiscount] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const ProductSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        sku: Yup.string().required('SKU is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().moreThan(0, 'Price must be greater than 0'),
        stock_quantity: Yup.number().min(0, 'Stock quantity cannot be negative'),
        color: Yup.string().required('Color is required'),
        weight: Yup.number().min(0, 'Weight cannot be negative'),
        status: Yup.string().required('Status is required'),
        category_id: Yup.string().required('Category is required'),
        discount_type: Yup.string().nullable(),
        discount_rate: Yup.number().when('hasDiscount', {
            is: true,
            then: (schema) => schema.min(0, 'Discount rate cannot be negative'),
        }),
    });

    // const primary_image = Yup.object().shape({
    //     image_url: Yup.string().required('Primary image is required'),
    //     alt_text: Yup.string().required('Alt text is required'),
    // });

    // const primary_image = {
    //     image_url: '',
    //     alt_text: '',
    //     is_primary: true,
    //     sort_order: 1,
    // }

    const defaultValues = useMemo(
        () => ({
            name: '',
            sku: '',
            description: '',
            price: 0,
            discount_type: null,
            discount_rate: 0,
            stock_quantity: 0,
            color: '',
            weight: 0,
            status: 'draft',
            category_id: '',
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(ProductSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                const imageUrl = URL.createObjectURL(file);
                // setValue('primary_image.image_url', imageUrl);
                // setValue('primary_image.alt_text', file.name);
            }
        },
        []
    );

    const handleRemoveFile = useCallback(() => {
        // setValue('primary_image.image_url', '');
        // setValue('primary_image.alt_text', '');
    }, []);

    const handleDiscountToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setHasDiscount(event.target.checked);
        if (!event.target.checked) {
            setValue('discount_type', null);
            setValue('discount_rate', 0);
        }
    }, [setValue]);

    const handlePublishToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPublishing(event.target.checked);
        setValue('status', event.target.checked ? 'published' : 'draft');
    }, [setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (!token) {
                enqueueSnackbar('Authentication required', { variant: 'error' });
                return;
            }

            const productData: IProductCreateRequest = {
                ...data,
                discount_type: hasDiscount ? data.discount_type : null,
                discount_rate: hasDiscount ? data.discount_rate : 0,
                price: data.price || 0,
                stock_quantity: data.stock_quantity || 0,
                weight: data.weight || 0,
            };

            await createProduct(productData, token);

            enqueueSnackbar('Product created successfully!', { variant: 'success' });
            reset();
            router.push(paths.dashboard.product.root);
        } catch (error) {
            console.error('Error creating product:', error);
            enqueueSnackbar(error instanceof Error ? error.message : 'Failed to create product', {
                variant: 'error'
            });
        }
    });

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

                        <RHFSelect native name="category_id" label="Category" InputLabelProps={{ shrink: true }}>
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
                        <RHFTextField name="color" label="Color" />

                        <RHFTextField
                            name="weight"
                            label="Weight (kg)"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
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
                            multiple={false}
                            thumbnail
                            name="primary_image.image_url"
                            maxSize={3145728}
                            onDrop={handleDrop}
                            onRemove={handleRemoveFile}
                            onUpload={() => console.info('ON UPLOAD')}
                        />

                        <RHFTextField
                            name="primary_image.alt_text"
                            label="Alt Text"
                            placeholder="Describe the image for accessibility"
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

                <LoadingButton type="submit" variant="contained" size="large" component={Button} disabled={isSubmitting}>
                    Create Product
                </LoadingButton>
            </Grid>
        </>
    );

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                {renderBasicInfo}
                {renderPricing}
                {renderAttributes}
                {/* {renderImage} */}
                {renderActions}
            </Grid>
        </FormProvider>
    );
}
