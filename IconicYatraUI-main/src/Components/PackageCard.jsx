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


const PackageCard = ({ image, title, location, onClick, onQueryClick }) => {
  return (
    <Card sx={{ width: 308, borderRadius: 2, boxShadow: 10, backgroundPosition: 'center' }}>
      <CardActionArea
        onClick={onClick}
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
              e.stopPropagation();
              onQueryClick();
            }}
          >
            Send Query
          </Button>
        </Box>
      </CardActionArea>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="#000">
          {title}
        </Typography>

        {location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

PackageCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string,
  onClick: PropTypes.func,
  onQueryClick: PropTypes.func,
};

export default PackageCard;
