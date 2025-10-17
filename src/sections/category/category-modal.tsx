'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';

import { ICategory } from 'src/types/category';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => void;
  category?: ICategory | null;
};

export default function CategoryModal({ open, onClose, onSave, category }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .required('Category name is required')
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name must not exceed 50 characters'),
    description: Yup.string()
      .max(200, 'Description must not exceed 200 characters')
      .optional(),
  });

  const defaultValues = {
    name: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          description: category.description || '',
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, category, reset]);

  const onSubmit = async (data: { name: string; description?: string }) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6">
          {category ? 'Edit Category' : 'New Category'}
        </Typography>
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <RHFTextField
              name="name"
              label="Category Name"
              placeholder="Enter category name"
              required
            />

            <RHFTextField
              name="description"
              label="Description"
              placeholder="Enter category description (optional)"
              multiline
              required
              rows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting || formSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || formSubmitting}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting || formSubmitting ? 'Saving...' : category ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
