import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PackageCard = ({ image, title, onClick }) => {
  return (
    <Card sx={{ width: 308, borderRadius: 2, boxShadow: 10, backgroundPosition: 'center' }}>
      <CardActionArea
        onClick={onClick}
        sx={{ position: 'relative' }}
      >
        <CardMedia component="img" height="260" image={image} alt={title} />
        <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
          <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>
            Send Query
          </Button>
        </Box>
      </CardActionArea>

      <CardContent
        sx={{
          backgroundColor: '#222',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};




export default PackageCard;
