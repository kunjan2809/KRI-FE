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
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  invoiceNumber: string;
  price: number;
  category: string;
  status: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function EcommerceLatestInvoices({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((invoice) => (
            <ProductItem key={invoice.id} invoice={invoice} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProductItemProps = {
  invoice: ItemProps;
};

function ProductItem({ invoice }: ProductItemProps) {
  const { invoiceNumber, price, category, status } = invoice;

  return (
    <Stack direction="row" spacing={2}>


      <ListItemText
        primary={<Stack direction="row" justifyContent="space-between"><span>Invoice number: <Link sx={{ color: 'text.primary', typography: 'subtitle2' }}>{invoiceNumber}</Link></span> <Label variant="soft" color={(status === 'paid' && 'success') || (status === 'out of date' && 'error') || 'default'}>{status}</Label> </Stack>}
        secondary={
          <Stack direction="row" justifyContent="space-between">
            <Box component="span" >
              {category}
            </Box>
            <Box component="span" >
              {fCurrency(price)}
            </Box>
          </Stack>
        }
        primaryTypographyProps={{
          noWrap: true,
        }}
        secondaryTypographyProps={{
          mt: 0.5,
        }}
      />

    </Stack>
  );
}
