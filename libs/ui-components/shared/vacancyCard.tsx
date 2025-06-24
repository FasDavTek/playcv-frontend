import React from 'react';

import { Link } from 'react-router-dom';
import { Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const VacancyCard = () => {
  return (
    <Paper
      elevation={4}
      // variant="outlined"
      square={false}
      className="bg-white p-4 md:p-10"
    >
      <div className="flex justify-between">
        <h4 className="font-bold">Job Title</h4>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold text-black">
            <LocationOnIcon
              sx={{ fontSize: '17px', color: 'gray', mr: '2px' }}
            />
            Location
          </h5>
          <p className="font-light text-gray-500">Posted 5 mins ago</p>
        </div>
      </div>
      <div className="mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus dolorem
        maiores consectetur consequuntur ad recusandae rerum sapiente quam
        doloribus accusantium aliquam repellat distinctio eum.
      </div>
      <div className="flex justify-end">
        <Link className="text-base hover:underline" to="/job-board/12345">
          Read More...
        </Link>
      </div>
    </Paper>
  );
};

export default VacancyCard;
