import React from 'react';
import { Typography, Grid, Box, Divider } from '@mui/material';
import PackageCard from '../../Components/PackageCard';

const packages = [
  { id: '1', dpkg: '101', title: 'Europe', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_408/pkg_408_main.png?1751611781411' },
  { id: '2', dpkg: '102', title: 'Thailand', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_75/pkg_75_main.jpg?1751613238511' },
  { id: '3', dpkg: '103', title: 'Singapore', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_315/pkg_315_main.png?1751613328441' },
  { id: '4', dpkg: '104', title: 'Singapore', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_314/pkg_314_main.png?1751613328441' },
  { id: '5', dpkg: '105', title: 'Baku', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_212/pkg_212_main.png?1751612819850' },
  { id: '6', dpkg: '106', title: 'Baku', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_211/pkg_211_main.png?1751612819850' },
  { id: '7', dpkg: '107', title: 'LADAKH', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_211/pkg_211_main.png?1751612819850' },
  { id: '8', dpkg: '108', title: 'LADAKH', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_389/pkg_389_main.jpg?1751613511735' },
  { id: '9', dpkg: '109', title: 'Malaysia', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_317/pkg_317_main.png?1751613833268' },
  { id: '10', dpkg: '110', title: 'Malaysia', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_316/pkg_316_main.png?1751613833268' },
  { id: '11', dpkg: '111', title: 'Sri Lanka', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_212/pkg_212_main.png?1751612819850' },
  { id: '12', dpkg: '201', title: 'Maharashtra', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_408/pkg_408_main.png?1751611781411' },
  { id: '13', dpkg: '202', title: 'Nepal', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_75/pkg_75_main.jpg?1751613238511' },
  { id: '14', dpkg: '203', title: 'Uttarakhand', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_315/pkg_315_main.png?1751613328441' },
  { id: '15', dpkg: '204', title: 'Rajasthan', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_314/pkg_314_main.png?1751613328441' },
  { id: '16', dpkg: '205', title: 'Madhya Pradesh', image: 'https://www.travserver.com/travelingfuns/uploads/packages/pkg_212/pkg_212_main.png?1751612819850' }
];

const AllHolidaysPackages = () => {
  return (
    <Box sx={{ px: 2, width: '100%' }}>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          ALL HOLIDAYS <span style={{ color: 'red' }}>PACKAGES</span>
        </Typography>
        <Divider sx={{ mt: 1, borderColor: '#ccc', borderBottomWidth: 5 }} />
      </Box>

      {/* Show all packages */}
      <Grid container spacing={3} sx={{ textAlign: 'center', justifyContent: 'center' }}>
        {packages.map((pkg, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 320, margin: '13px' }}>
              <PackageCard {...pkg} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllHolidaysPackages;
