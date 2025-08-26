// src/pages/hotel/HotelEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateHotel, fetchHotels } from "../../../../features/hotel/hotelSlice";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Chip,
  Divider,
  Grid,
  Box,
  Card,
  CardMedia,
  MenuItem
} from "@mui/material";

const HotelEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState(null);

  const hotelTypes = ["Resort", "Villa", "Boutique", "Business", "Budget", "Luxury"];
  const statusOptions = ["Active", "Inactive"];
  const cancellationOptions = ["Non-refundable", "24hrs Free", "48hrs Free", "Flexible"];
  const facilityOptions = ["Wifi", "Parking", "Pool", "Restaurant", "Spa", "Gym", "Airport Pickup"];
  const seasonOptions = ["Peak", "Off-Season", "Festival", "Weekend"];
  const roomTypes = ["Standard", "Deluxe", "Suite", "Family", "Dormitory"];
  const mealPlans = ["EP", "CP", "MAP", "AP"];

  useEffect(() => {
    dispatch(fetchHotels()).then((res) => {
      const hotel = res.payload.find((h) => h._id === id);
      if (hotel) setHotelData(hotel);
    });
  }, [dispatch, id]);

  const handleChange = (e, path) => {
    const keys = path.split(".");
    setHotelData((prev) => {
      let copy = { ...prev };

      if (keys.length === 1) {
        copy[keys[0]] = e.target.value;
      } else if (keys.length === 2) {
        copy[keys[0]] = { ...copy[keys[0]], [keys[1]]: e.target.value };
      } else if (keys.length === 3) {
        copy[keys[0]] = {
          ...copy[keys[0]],
          [keys[1]]: { ...copy[keys[0][keys[1]]], [keys[2]]: e.target.value },
        };
      } else if (keys.length === 4) {
        copy[keys[0]] = {
          ...copy[keys[0]],
          [keys[1]]: {
            ...copy[keys[0][keys[1]]],
            [keys[2]]: { ...copy[keys[0][keys[1]][keys[2]]], [keys[3]]: e.target.value },
          },
        };
      }

      return copy;
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();

    // Basic fields
    formData.append("hotelName", hotelData.hotelName);
    formData.append("hotelType", hotelData.hotelType);
    formData.append("status", hotelData.status);
    formData.append("description", hotelData.description);
    formData.append("cancellationPolicy", hotelData.cancellationPolicy);

    // Contact, Location, Social Media, Facilities, Rooms
    formData.append("contactDetails", JSON.stringify(hotelData.contactDetails));
    formData.append("location", JSON.stringify(hotelData.location));
    formData.append("socialMedia", JSON.stringify(hotelData.socialMedia));
    formData.append("facilities", JSON.stringify(hotelData.facilities));
    formData.append("rooms", JSON.stringify(hotelData.rooms));

    // Main Image
    if (hotelData.mainImage instanceof File) {
      formData.append("mainImage", hotelData.mainImage);
    }

    // Room Images
    hotelData.rooms.forEach((room) => {
      room.roomDetails.forEach((detail) => {
        detail.images?.forEach((img) => {
          if (img instanceof File) formData.append("roomImages", img);
        });
      });
    });

    dispatch(updateHotel({ id, formData }))
      .unwrap()
      .then(() => navigate("/hotel"))
      .catch((err) => console.error("Update failed:", err));
  };

  if (!hotelData) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Edit Hotel
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* Hotel Info */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Hotel Info
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Hotel Name"
              value={hotelData.hotelName}
              onChange={(e) => handleChange(e, "hotelName")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Category"
              value={hotelData.hotelType}
              onChange={(e) => handleChange(e, "hotelType")}
              fullWidth
            >
              {hotelTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Status"
              value={hotelData.status}
              onChange={(e) => handleChange(e, "status")}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              value={hotelData.description}
              onChange={(e) => handleChange(e, "description")}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Cancellation Policy"
              value={hotelData.cancellationPolicy}
              onChange={(e) => handleChange(e, "cancellationPolicy")}
              fullWidth
            >
              {cancellationOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Main Image */}
        {hotelData.mainImage && (
          <Box mt={3}>
            <Typography variant="subtitle1">Main Image</Typography>
            <Card sx={{ maxWidth: 250, mt: 1 }}>
              <CardMedia
                component="img"
                height="150"
                image={
                  hotelData.mainImage instanceof File
                    ? URL.createObjectURL(hotelData.mainImage)
                    : `http://localhost:5000${hotelData.mainImage}`
                }
                alt="Hotel Main"
              />
            </Card>

            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload New Main Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setHotelData((prev) => ({ ...prev, mainImage: file }));
                }}
              />
            </Button>
          </Box>
        )}

        {/* Contact Info */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Contact Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Contact Person"
                value={hotelData.contactDetails.contactPerson}
                onChange={(e) => handleChange(e, "contactDetails.contactPerson")}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Mobile"
                value={hotelData.contactDetails.mobile}
                onChange={(e) => handleChange(e, "contactDetails.mobile")}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Email"
                value={hotelData.contactDetails.email}
                onChange={(e) => handleChange(e, "contactDetails.email")}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        {/* Location Info */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Location
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Address"
                value={hotelData.location.address1}
                onChange={(e) => handleChange(e, "location.address1")}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="City"
                value={hotelData.location.city}
                onChange={(e) => handleChange(e, "location.city")}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="State"
                value={hotelData.location.state}
                onChange={(e) => handleChange(e, "location.state")}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Pincode"
                value={hotelData.location.pincode}
                onChange={(e) => handleChange(e, "location.pincode")}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Country"
                value={hotelData.location.country}
                onChange={(e) => handleChange(e, "location.country")}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        {/* Social Media */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Social Media
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Google Link"
            value={hotelData.socialMedia.googleLink}
            onChange={(e) => handleChange(e, "socialMedia.googleLink")}
            fullWidth
          />
        </Box>

        {/* Facilities */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Facilities
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {hotelData.facilities.map((f, idx) => (
              <Chip
                key={idx}
                label={f}
                color="primary"
                onDelete={() =>
                  setHotelData((prev) => ({
                    ...prev,
                    facilities: prev.facilities.filter((_, i) => i !== idx),
                  }))
                }
                sx={{ mb: 1 }}
              />
            ))}
            <TextField
              size="small"
              placeholder="Add Facility"
              onKeyDown={(e) => {
                const val = e.target.value.trim();
                if (e.key === "Enter" && val && facilityOptions.includes(val)) {
                  setHotelData((prev) => ({
                    ...prev,
                    facilities: [...prev.facilities, val],
                  }));
                  e.target.value = "";
                }
              }}
            />
          </Stack>
        </Box>

        {/* Rooms */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Rooms
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {hotelData.rooms.map((room, rIdx) => (
            <Box key={rIdx} mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
              <TextField
                select
                label="Season Type"
                value={room.seasonType}
                onChange={(e) => handleChange(e, `rooms.${rIdx}.seasonType`)}
                fullWidth
                sx={{ mb: 1 }}
              >
                {seasonOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="subtitle1" fontWeight="bold">
                {new Date(room.validFrom).toLocaleDateString()} -{" "}
                {new Date(room.validTill).toLocaleDateString()}
              </Typography>

              {room.roomDetails.map((rd, dIdx) => (
                <Box key={dIdx} mt={2}>
                  <TextField
                    select
                    label="Room Type"
                    value={rd.roomType}
                    onChange={(e) => handleChange(e, `rooms.${rIdx}.roomDetails.${dIdx}.roomType`)}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    {roomTypes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Meal Plan"
                    value={rd.mealPlan}
                    onChange={(e) => handleChange(e, `rooms.${rIdx}.roomDetails.${dIdx}.mealPlan`)}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    {mealPlans.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Typography variant="body2" color="text.secondary">
                    Mattress (Adult: ₹{rd.mattressCost.adult}, Child: ₹{rd.mattressCost.children})
                  </Typography>

                  {/* Room Images */}
                  <Stack direction="row" spacing={2} mt={1}>
                    {rd.images?.map((img, iIdx) => (
                      <Card key={iIdx} sx={{ maxWidth: 150 }}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={img instanceof File ? URL.createObjectURL(img) : `http://localhost:5000${img}`}
                          alt="Room"
                        />
                      </Card>
                    ))}
                  </Stack>

                  <Button variant="outlined" component="label" size="small" sx={{ mt: 1 }}>
                    Add Room Images
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          setHotelData((prev) => {
                            const copy = { ...prev };
                            copy.rooms[rIdx].roomDetails[dIdx].images = [
                              ...(copy.rooms[rIdx].roomDetails[dIdx].images || []),
                              ...files,
                            ];
                            return copy;
                          });
                        }
                      }}
                    />
                  </Button>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        {/* Submit */}
        <Box mt={4} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HotelEditForm;
