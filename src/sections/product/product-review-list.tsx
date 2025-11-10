import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { IProductReview } from 'src/types/product';

import ProductReviewItem from './product-review-item';
import { Reviews } from 'src/types/reviews';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  reviews: Reviews;
};

export default function ProductReviewList({ reviews }: Props) {
  const [page, setPage] = useState(1);
  const itemPerPage = 8;
  const totalPages = Math.ceil(reviews.details.length / itemPerPage);

  const startIndex = (page - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const itemsToDisplay = reviews.details.slice(startIndex, endIndex);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      {itemsToDisplay.map((review) => (
        <ProductReviewItem key={review._id} review={review} />
      ))}

      {itemsToDisplay.length>0 &&<Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />}
    </>
  );
}
