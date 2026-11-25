import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Select, SelectChangeEvent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import { getDummyAvtarUrl } from 'src/utils/avtarData';

import { useAuthToken } from 'src/auth/hooks';
import { updateOrderStatus } from 'src/api/order';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { Order, ShippingAddressId } from 'src/types/order';

// ----------------------------------------------------------------------

type Props = {
  row: Order;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {

  const { user_id, order_status, _id, total_amount, shipping_address_id, created_at, order_items, order_number } = row;
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();
  const token = useAuthToken()

  const [status, setStatus] = useState<string>(order_status);
  const [editingCell, setEditingCell] = useState<{ rowId: string, filed: string } | null>(null);


  const handleStatusChange = async (newStatus: string, orderId: string) => {
    try {
      await updateOrderStatus(orderId, { order_status: newStatus }, token)
      setStatus(newStatus)
    } catch (error) {
      console.log("Sommthing went wrong", error)
    }
    setEditingCell(null)
  }

  const addressData = (data: ShippingAddressId) => {
    const addressParts = [
      data?.address_line_1,
      data?.address_line_2,
      data?.landmark,
      data?.city,
      data?.state,
      data?.postal_code,
      data?.country
    ];

    const filtered = addressParts.filter(part => part && part.trim() !== '');

    return filtered.length > 0 ? filtered.join(', ') : '-';
  };


  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {_id}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Avatar alt={`${user_id?.first_name} ${user_id?.last_name}`} src={getDummyAvtarUrl(user_id?.profile_icon).avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={`${user_id?.first_name} ${user_id?.last_name}`}
            secondary={user_id?.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(created_at)}
          secondary={fTime(created_at)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center" sx={{ width: '100%' }}>{addressData(shipping_address_id)}</TableCell>
      <TableCell align="center"> {order_items.reduce((acc, item) => acc + item.quantity, 0)} </TableCell>

      <TableCell> {fCurrency(total_amount)} </TableCell>

      <TableCell
        onClick={() => setEditingCell({ rowId: _id, filed: order_status })}
      >
        {editingCell && editingCell.rowId === _id && editingCell.filed === order_status ? (
          <Select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value, _id)}
            autoFocus
            onBlur={() => setEditingCell(null)} // Exit edit on blur
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="return">Return</MenuItem>
          </Select>
        ) : (
          <Label
            variant="soft"
            color={
              (status === 'shipped' && 'info') ||
              (status === 'pending' && 'warning') ||
              (status === 'cancelled' && 'error') ||
              (status === 'delivered' && 'success') ||
              (status === 'return' && 'secondary') ||
              'default'
            }
          >
            {status}
          </Label>
        )}

      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow >
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {order_items?.map((item) => {
              const { name} = item.product_id
              return (
                <Stack
                  key={_id}
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                    },
                  }}
                >
                  <Avatar
                    src={item.primary_image?.image_url}
                    variant="rounded"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />

                  <ListItemText
                    primary={name}
                    secondary={order_number}
                    primaryTypographyProps={{
                      typography: 'body2',
                    }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <Box>x{item.quantity}</Box>

                  <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.price)}</Box>
                </Stack>
              )
            })}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
