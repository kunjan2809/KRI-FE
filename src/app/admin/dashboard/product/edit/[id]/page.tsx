import axios, { endpoints } from 'src/utils/axios';

import {  ProductFormView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'KRI: Product Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductEditPage({ params }: Props) {

  return <ProductFormView />;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.product.list);

//   return res.data.products.map((product: { id: string }) => ({
//     id: product.id,
//   }));
// }
