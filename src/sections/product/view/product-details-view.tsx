'use client';

import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useSnackbar } from 'src/components/snackbar';

import { getProductById, updateProductStatus } from 'src/api/product';
import { IProductAPIResponse, IProductCreateRequest, IProductStatus  } from 'src/types/product';

import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { useAuthToken } from 'src/auth/hooks';

import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsReview from '../product-details-review';
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsToolbar from '../product-details-toolbar';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:medal-ribbon-star-bold',
  },
  {
    title: '2 Day size Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:refresh-circle-bold',
  },
  {
    title: '1 Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

const product = {
  "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
  "gender": [
    "Kids"
  ],
  "images": [
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-2.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp",
    "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp"
  ],
  "reviews": [
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
      "name": "Jayvion Simon",
      "postedAt": "2025-08-02T09:52:39+00:00",
      "comment": "The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.",
      "isPurchased": true,
      "rating": 4.2,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp",
      "helpful": 9911,
      "attachments": []
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
      "name": "Lucian Obrien",
      "postedAt": "2025-08-01T08:52:39+00:00",
      "comment": "She eagerly opened the gift, her eyes sparkling with excitement.",
      "isPurchased": true,
      "rating": 3.7,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp",
      "helpful": 1947,
      "attachments": [
        "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp"
      ]
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
      "name": "Deja Brady",
      "postedAt": "2025-07-31T07:52:39+00:00",
      "comment": "The old oak tree stood tall and majestic, its branches swaying gently in the breeze.",
      "isPurchased": true,
      "rating": 4.5,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp",
      "helpful": 9124,
      "attachments": []
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
      "name": "Harrison Stein",
      "postedAt": "2025-07-30T06:52:39+00:00",
      "comment": "The aroma of freshly brewed coffee filled the air, awakening my senses.",
      "isPurchased": false,
      "rating": 3.5,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-4.webp",
      "helpful": 6984,
      "attachments": [
        "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp",
        "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp"
      ]
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
      "name": "Reece Chung",
      "postedAt": "2025-07-29T05:52:39+00:00",
      "comment": "The children giggled with joy as they ran through the sprinklers on a hot summer day.",
      "isPurchased": false,
      "rating": 0.5,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp",
      "helpful": 8488,
      "attachments": []
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6",
      "name": "Lainey Davidson",
      "postedAt": "2025-07-28T04:52:39+00:00",
      "comment": "He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.",
      "isPurchased": true,
      "rating": 3,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-6.webp",
      "helpful": 2034,
      "attachments": [
        "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp",
        "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp",
        "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp"
      ]
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
      "name": "Cristopher Cardenas",
      "postedAt": "2025-07-27T03:52:39+00:00",
      "comment": "The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.",
      "isPurchased": false,
      "rating": 2.5,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp",
      "helpful": 3364,
      "attachments": []
    },
    {
      "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
      "name": "Melanie Noble",
      "postedAt": "2025-07-26T02:52:39+00:00",
      "comment": "The waves crashed against the shore, creating a soothing symphony of sound.",
      "isPurchased": false,
      "rating": 2.8,
      "avatarUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-8.webp",
      "helpful": 8401,
      "attachments": []
    }
  ],
  "publish": "draft",
  "wishlist": false,
  "ratings": [
    {
      "name": "1 Star",
      "starCount": 9911,
      "reviewCount": 1947
    },
    {
      "name": "2 Star",
      "starCount": 1947,
      "reviewCount": 9124
    },
    {
      "name": "3 Star",
      "starCount": 9124,
      "reviewCount": 6984
    },
    {
      "name": "4 Star",
      "starCount": 6984,
      "reviewCount": 8488
    },
    {
      "name": "5 Star",
      "starCount": 8488,
      "reviewCount": 2034
    }
  ],
  "category": "Accessories",
  "available": 0,
  "priceSale": 83.74,
  "taxes": 10,
  "quantity": 80,
  "inventoryType": "out of stock",
  "tags": [
    "Technology",
    "Health and Wellness",
    "Travel",
    "Finance",
    "Education"
  ],
  "code": "38BEE270",
  "description": "\n<h6>Specifications</h6>\n<table>\n  <tbody>\n    <tr>\n      <td>Category</td>\n      <td>Mobile</td>\n    </tr>\n    <tr>\n      <td>Manufacturer</td>\n      <td>Apple</td>\n    </tr>\n    <tr>\n      <td>Warranty</td>\n      <td>12 Months</td>\n    </tr>\n    <tr>\n      <td>Serial number</td>\n      <td>358607726380311</td>\n    </tr>\n    <tr>\n      <td>Ships from</td>\n      <td>United States</td>\n    </tr>\n  </tbody>\n</table>\n\n<h6>Product details</h6>\n<ul>\n  <li>\n    <p>The foam sockliner feels soft and comfortable</p>\n  </li>\n  <li>\n    <p>Pull tab</p>\n  </li>\n  <li>\n    <p>Not intended for use as Personal Protective Equipment</p>\n  </li>\n  <li>\n    <p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p>\n  </li>\n  <li>\n    <p>Style: 921826-109</p>\n  </li>\n  <li>\n    <p>Country/Region of Origin: China</p>\n  </li>\n</ul>\n<h6>Benefits</h6>\n<ul>\n  <li>\n    <p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>\n    and durability.\n  </li>\n  <li>\n    <p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>\n    ning underfoot.\n  </li>\n  <li>\n    <p>The foam midsole feels springy and soft.</p>\n  </li>\n  <li>\n    <p>The rubber outsole adds traction and durability.</p>\n  </li>\n</ul>\n<h6>Delivery and returns</h6>\n<p>Your order of $200 or more gets free standard delivery.</p>\n<ul>\n  <li>\n    <p>Standard delivered 4-5 Business Days</p>\n  </li>\n  <li>\n    <p>Express delivered 2-4 Business Days</p>\n  </li>\n</ul>\n<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>\n\n",
  "sku": "WW75K5210YW/SV",
  "createdAt": "2025-08-02T09:52:39+00:00",
  "name": "Urban Explorer Sneakers",
  "price": 83.74,
  "coverUrl": "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp",
  "colors": [
    "#FF4842",
    "#1890FF"
  ],
  "totalRatings": 4.2,
  "totalSold": 763,
  "totalReviews": 1947,
  "newLabel": {
    "enabled": false,
    "content": "NEW"
  },
  "saleLabel": {
    "enabled": false,
    "content": "SALE"
  },
  "sizes": [
    "6",
    "7",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "13"
  ],
  "subDescription": "Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push your style full-speed ahead."
}

export default function ProductDetailsView({ id }: Props) {

  const settings = useSettingsContext();
  const token = useAuthToken();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState('description');
  const [productById, setProductById] = useState<IProductCreateRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publish, setPublish] = useState('');


  useEffect(() => {
    if (productById) {
      setPublish(productById?.status);
    }
  }, [productById]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getProductById(id, token);
        setProductById(response.data.product);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, enqueueSnackbar]);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
    try { 
      const productId = productById?._id
      const productStatus: IProductStatus = {
        status: newValue,
      };
      updateProductStatus(productId, productStatus, token);
    } catch (err) {
      console.error(err);
    }
  }, [productById, token]);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  // const renderError = (
  //   <EmptyContent
  //     filled
  //     title={`${productError?.message}`}
  //     action={
  //       <Button
  //         component={RouterLink}
  //         href={paths.dashboard.product.root}
  //         startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
  //         sx={{ mt: 3 }}
  //       >
  //         Back to List
  //       </Button>
  //     }
  //     sx={{ py: 10 }}
  //   />
  // );

  const renderProduct = productById && (
    <>
      <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${productById?._id}`)}
        liveLink={paths.dashboard.product.details(`${productById?._id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={productById as IProductCreateRequest} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary productById={productById as IProductCreateRequest} />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        {/* <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
            // {
            //   value: 'reviews',
            //   label: `Reviews (${productById?.reviews.length})`,
            // },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={productById?.description} />
        )} */}

         <ProductDetailsReview
            ratings={productById?.ratings || []}  
            reviews={productById?.reviews || []}
            totalRatings={productById?.totalRatings || 0}
            totalReviews={productById?.totalReviews || 0}
          />
      </Card>

      
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* {productLoading && renderSkeleton} */}

      {/* {productError && renderError} */}

      {productById && renderProduct}
    </Container>
  );
}
