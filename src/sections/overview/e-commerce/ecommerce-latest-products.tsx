import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import Scrollbar from 'src/components/scrollbar';
import { ColorPreview } from 'src/components/color-utils';
import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: IProductItem[];
}

export default function EcommerceLatestProducts({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProductItemProps = {
  product: IProductItem;
};

function ProductItem({ product }: ProductItemProps) {
  const { name, primary_image, price, mrp, stock_quantity } = product;

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        variant="rounded"
        alt={name}
        src={primary_image?.image_url}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <ListItemText
          primary={<Link sx={{ color: 'text.primary', typography: 'subtitle2' }}>{name}</Link>}
          secondary={
            <>
              {!!mrp && (
                <Box
                  component="span"
                  sx={{ textDecoration: 'line-through', mr: 0.5, color: 'error.main' }}
                >
                  {fCurrency(mrp)}
                </Box>
              )}

              <Box component="span" sx={{ color: 'text.secondary' }}>
                {fCurrency(price)}
              </Box>
            </>
          }
          primaryTypographyProps={{
            noWrap: true,
          }}
          secondaryTypographyProps={{
            mt: 0.5,
          }}
        />

        <ListItemText
          sx={{ textAlign: 'end' }}
          secondary={
            <>
              <Box component="span" sx={{ color: 'text.secondary', textAlign: 'end' }}>
                Stock: {stock_quantity}
              </Box>
            </>
          }
          secondaryTypographyProps={{
            mt: 0.5,
          }}
        />
      </Box>
    </Stack>
  );
}
