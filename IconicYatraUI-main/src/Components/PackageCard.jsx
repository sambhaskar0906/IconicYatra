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

const PackageCard = ({ image, title, onClick, onQueryClick }) => {
  return (
    <Card sx={{ width: 308, borderRadius: 2, boxShadow: 10, backgroundPosition: 'center' }}>
      <CardActionArea
        onClick={onClick} // Card click
        sx={{ position: 'relative' }}
      >
        <CardMedia component="img" height="260" image={image} alt={title} />

        {/* Send Query button */}
        <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onQueryClick(); // Trigger query
            }}
          >
            Send Query
          </Button>
        </Box>
      </CardActionArea>

      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#000',
        }}
      >
        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2" fontWeight="bold" color="#000">
          {title}
        </Typography>

      </CardContent>
    </Card>
  );
};

PackageCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onQueryClick: PropTypes.func,
};

export default PackageCard;
