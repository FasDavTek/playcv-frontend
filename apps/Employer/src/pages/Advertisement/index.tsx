// import React, { useState } from 'react';

// import { Link, useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardMedia, Typography } from '@mui/material';
// import { Modal } from '@mui/material';
// import { z } from 'zod';

// import { Button } from '@video-cv/ui-components';
// import CreateAdvertModal from './modals/CreateAdvert';

// const Advertisement = () => {
//   const [openModal, setOpenModal] = useState<'createAdvert' | null>(null);
//   const navigate = useNavigate();

//   const closeModal = () => {
//     setOpenModal(null);
//   };

//   const openModalFn = () => {
//     navigate('/employer/advertisement/create');
//   };

//   return (
//     <section className="ce-px ce-py">
//       <div className="">
//         <Button onClick={openModalFn} variant='black' label="Add Advert" />
//       </div>
//       {/* TODO: add filters */}
//       <div className="p-4 grid md:grid-cols-4 gap-4">
//         <AdvertCard />
//         <AdvertCard />
//         <AdvertCard />
//         <AdvertCard />
//       </div>
//       {/* <Modal
//         className="overflow-scroll pt-[50px] block"
//         open={openModal === 'createAdvert'}
//         onClose={closeModal}
//       >
//         <CreateAdvertModal onClose={closeModal} />
//       </Modal> */}
//     </section>
//   );
// };

// export default Advertisement;

// const AdvertCard = () => {
//   const navigate = useNavigate();
//   return (
//     <Card
//       sx={{
//         width: { xs: '100%', sm: '100%', md: '100%' },
//         boxShadow: 'none',
//         borderRadius: 2,
//       }}
//     >
//       <Link to={`/advertisement/manage/1`}>
//         <CardMedia
//           image={'https://i.ytimg.com/vi/3cbnNwxtUUA/hqdefault_live.jpg'}
//           title={'Title'}
//           sx={{ width: { xs: '100%' }, height: 180 }}
//         />
//       </Link>
//       <CardContent sx={{ backgroundColor: '#1E1E1E', height: '106px' }}>
//         <Link to={'#'}>
//           <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
//             {"Sample Video Title".slice(0, 30)}
//           </Typography>

//         </Link>
//         <div className="flex justify-end mt-2 gap-2">
//           <Button
//             onClick={() => navigate(`/advertisement/view/${original.id}`)}
//             variant="success"
//             label="manage"
//             className="!px-1 !py-1.5 text-white"
//           />
//           <Button
//             variant="tertiary"
//             label="suspend"
//             className="!px-1 !py-1.5"
//           />
//           <Button variant="red" label="Delete" className="!px-1 !py-1.5" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };











import React, { useState } from 'react';
import { Button, Table } from '@video-cv/ui-components'; // Import your Table component
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@video-cv/utils';

// Define your ad data type
type Advert = {
  id: string;
  adName: string;
  fileUrl: string;
  createdAt: string;
  status: string;
  action: 'action';
};

// Mock data
const initialData = [
  {
    id: '1',
    adName: 'Summer Sale',
    fileUrl: 'https://example.com/summer-sale.png',
    createdAt: '2024-06-01T10:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    adName: 'Winter Collection',
    fileUrl: 'https://example.com/winter-collection.png',
    createdAt: '2024-11-15T12:00:00Z',
    status: 'suspended',
  },
  {
    id: '3',
    adName: 'Spring Promo',
    fileUrl: 'https://example.com/spring-promo.png',
    createdAt: '2024-03-21T09:30:00Z',
    status: 'active',
  },
];

const columnHelper = createColumnHelper<Advert>();

const Advertisement = () => {
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();

  const handleStatusToggle = (id: string) => {
    setData((prevData) =>
      prevData.map((ad) =>
        ad.id === id
          ? { ...ad, status: ad.status === 'active' ? 'suspended' : 'active' }
          : ad
      )
    );
  };

  const columns = [
    columnHelper.accessor('adName', {
      header: 'Ad Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fileUrl', {
      header: 'Ad Link',
      cell: (info) => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">View Ad</a>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center rounded-full text-white ${
            info.getValue() === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {info.getValue() === 'active' ? 'Active' : 'Suspended'}
        </span>
      ),
    }),
    columnHelper.accessor('action', {
      cell: ({ row: { original } }) => {
        const handleView = () => {
          navigate(`/employer/advertisement/view/${original.id}`);
        };

        const handleStatusClick = () => {
          handleStatusToggle(original.id);
        };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="Manage" onClick={handleView} />
            {original.status === 'active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusClick} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusClick} />
            )}
          </div>
        );
      },
      header: 'Action',
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-4">
        <Button
          label="Create Ad"
          variant="black"
          onClick={() => navigate('/employer/advertisement/create')}
        />
      </div>
      <Table loading={false} data={data} columns={columns} tableHeading="All Ads" />
    </div>
  );
};

export default Advertisement;
