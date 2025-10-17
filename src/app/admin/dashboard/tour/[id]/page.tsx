import { _tours } from 'src/_mock/_tour';

import { TourDetailsView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'KRI: Tour Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function TourDetailsPage({ params }: Props) {
  const { id } = params;

  return <TourDetailsView id={id} />;
}

// export async function generateStaticParams() {
//   return _tours.map((tour) => ({
//     id: tour.id,
//   }));
// }
