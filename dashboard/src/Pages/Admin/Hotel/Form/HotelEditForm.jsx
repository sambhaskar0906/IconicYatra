// src/pages/hotel/HotelEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateHotel, getHotelForEdit } from "../../../../features/hotel/hotelSlice";
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
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormHelperText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ ADD THESE IMPORTS - leadSlice se
import { getLeadOptions, addLeadOption, deleteLeadOption } from "../../../../features/leads/leadSlice";

// ✅ ADD LOCATION IMPORTS - HotelForm jaise
import {
  fetchCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
  clearStates,
  clearCities,
} from "../../../../features/location/locationSlice";

const HotelEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotel: hotelData, loading, error } = useSelector((state) => state.hotel);

  // ✅ ADD LEAD OPTIONS SELECTOR
  const { options } = useSelector((state) => state.leads);

  // ✅ ADD LOCATION SELECTORS - HotelForm jaise
  const { countries, states, cities, loading: locationLoading } = useSelector(
    (state) => state.location
  );

  const [formData, setFormData] = useState(null);
  const [newMainImage, setNewMainImage] = useState(null);

  // ✅ ADD DIALOG STATE (HotelForm jaise)
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [addMore, setAddMore] = useState("");

  // Original options (fallback ke liye)
  const initialHotelTypes = ["3 star", "4 star", "5 star", "Budget", "Luxury", "Boutique", "Resort"];
  const initialFacilityOptions = ["24*7 Service", "Bathroom", "WiFi", "Bar", "Air Conditioning", "Restaurant", "Parking", "Pool", "Spa", "Gym"];

  const statusOptions = ["Active", "Inactive"];

  // ✅ USE EFFECT FOR LEAD OPTIONS - HotelForm jaise
  useEffect(() => {
    dispatch(getLeadOptions());
  }, [dispatch]);

  // ✅ USE EFFECT FOR COUNTRIES - HotelForm jaise
  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  // ✅ FETCH STATES WHEN COUNTRY CHANGES - HotelForm jaise
  useEffect(() => {
    if (formData?.location?.country) {
      dispatch(fetchStatesByCountry(formData.location.country));
      dispatch(clearCities());

      // Reset state and city when country changes
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          state: "",
          city: ""
        }
      }));
    } else {
      dispatch(clearStates());
      dispatch(clearCities());
    }
  }, [formData?.location?.country, dispatch]);

  // ✅ FETCH CITIES WHEN STATE CHANGES - HotelForm jaise
  useEffect(() => {
    if (formData?.location?.country && formData?.location?.state) {
      dispatch(
        fetchCitiesByState({
          countryName: formData.location.country,
          stateName: formData.location.state,
        })
      );

      // Reset city when state changes
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          city: ""
        }
      }));
    } else {
      dispatch(clearCities());
    }
  }, [formData?.location?.state, formData?.location?.country, dispatch]);

  // ✅ GET HOTEL TYPE OPTIONS WITH ADD NEW
  const getHotelTypeOptions = () => {
    const filteredOptions = options
      ?.filter((opt) => opt.fieldName === "hotelType")
      .map((opt) => opt.value);

    return [
      ...(filteredOptions || initialHotelTypes),
      "__add_new"
    ];
  };

  // ✅ GET FACILITY OPTIONS WITH ADD NEW
  const getFacilityOptions = () => {
    const filteredOptions = options
      ?.filter((opt) => opt.fieldName === "facilities")
      .map((opt) => opt.value);

    return [
      ...(filteredOptions || initialFacilityOptions),
      "__add_new"
    ];
  };

  // ✅ ADD NEW ITEM DIALOG HANDLERS (HotelForm jaise)
  const handleOpenDialog = (field) => {
    setCurrentField(field);
    setAddMore("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddNewItem = async () => {
    if (!addMore.trim()) return;

    try {
      const newValue = addMore.trim();
      const backendField = currentField;

      await dispatch(addLeadOption({ fieldName: backendField, value: newValue })).unwrap();

      // Fetch updated lead options from backend
      await dispatch(getLeadOptions()).unwrap();

      // Update form field based on current field
      if (currentField === "hotelType") {
        setFormData(prev => ({
          ...prev,
          hotelType: newValue
        }));
      } else if (currentField === "facilities") {
        setFormData(prev => ({
          ...prev,
          facilities: [...prev.facilities, newValue]
        }));
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Failed to add new option", error);
    }
  };

  // ✅ USE getHotelForEdit API - CORRECT API CALL
  useEffect(() => {
    if (id) {
      dispatch(getHotelForEdit(id));
    }
  }, [dispatch, id]);

  // ✅ SET FORM DATA WHEN HOTEL DATA LOADS
  useEffect(() => {
    if (hotelData) {
      setFormData({
        hotelName: hotelData.hotelName || "",
        hotelType: Array.isArray(hotelData.hotelType) ? hotelData.hotelType[0] : hotelData.hotelType || "",
        status: hotelData.status || "Active",
        description: hotelData.description || "",
        cancellationPolicy: hotelData.cancellationPolicy || "",
        contactDetails: {
          email: hotelData.contactDetails?.email || "",
          mobile: hotelData.contactDetails?.mobile || "",
          alternateContact: hotelData.contactDetails?.alternateContact || "",
          designation: hotelData.contactDetails?.designation || "",
          contactPerson: hotelData.contactDetails?.contactPerson || ""
        },
        location: {
          country: hotelData.location?.country || "India",
          state: hotelData.location?.state || "",
          city: hotelData.location?.city || "",
          address: hotelData.location?.address || "",
          pincode: hotelData.location?.pincode || ""
        },
        socialMedia: {
          googleLink: hotelData.socialMedia?.googleLink || ""
        },
        facilities: hotelData.facilities || [],
        policy: hotelData.policy || ""
      });
    }
  }, [hotelData]);

  // ✅ HANDLE FORM CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ HANDLE ADD NEW OPTION FOR HOTEL TYPE
    if (name === "hotelType" && value === "__add_new") {
      handleOpenDialog("hotelType");
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };

  const handleFacilitiesChange = (event) => {
    const {
      target: { value },
    } = event;

    // ✅ HANDLE ADD NEW OPTION FOR FACILITIES
    if (value.includes("__add_new")) {
      const filtered = value.filter((v) => v !== "__add_new");
      setFormData(prev => ({
        ...prev,
        facilities: typeof filtered === 'string' ? filtered.split(',') : filtered,
      }));
      handleOpenDialog("facilities");
      return;
    }

    setFormData(prev => ({
      ...prev,
      facilities: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMainImage(file);
    }
  };

  // ✅ HANDLE FORM SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData || !id) return;

    const submitFormData = new FormData();

    // ✅ BASIC FIELDS
    submitFormData.append("hotelName", formData.hotelName);
    submitFormData.append("hotelType", JSON.stringify([formData.hotelType]));
    submitFormData.append("status", formData.status);
    submitFormData.append("description", formData.description);
    submitFormData.append("cancellationPolicy", formData.cancellationPolicy);
    submitFormData.append("policy", formData.policy);

    // ✅ NESTED OBJECTS - PROPERLY STRINGIFY
    submitFormData.append("contactDetails", JSON.stringify(formData.contactDetails));
    submitFormData.append("location", JSON.stringify(formData.location));
    submitFormData.append("socialMedia", JSON.stringify(formData.socialMedia));
    submitFormData.append("facilities", JSON.stringify(formData.facilities));

    // ✅ MAIN IMAGE - ONLY IF NEW IMAGE SELECTED
    if (newMainImage) {
      submitFormData.append("mainImage", newMainImage);
    }

    console.log("🔹 Submitting form data for hotel:", id);

    // ✅ DISPATCH UPDATE ACTION
    dispatch(updateHotel({ id, formData: submitFormData }))
      .unwrap()
      .then(() => {
        console.log("✅ Hotel updated successfully");
        navigate("/hotel");
      })
      .catch((err) => {
        console.error("❌ Hotel update failed:", err);
      });
  };

  // ✅ LOADING STATE
  if (loading || locationLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate("/hotel")} sx={{ mt: 2 }}>
          Back to Hotel List
        </Button>
      </Container>
    );
  }

  // ✅ NO DATA STATE
  if (!formData || !hotelData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading hotel data...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Edit Hotel - {hotelData.hotelName}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Hotel Info */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Hotel Info
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Hotel Name"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* ✅ UPDATED HOTEL TYPE WITH ADD NEW OPTION */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth required>
                <InputLabel>Hotel Type</InputLabel>
                <Select
                  label="Hotel Type"
                  name="hotelType"
                  value={formData.hotelType}
                  onChange={handleChange}
                >
                  {getHotelTypeOptions().map((option) => (
                    option === "__add_new" ? (
                      <MenuItem key="add_new" value="__add_new" style={{ color: "#1976d2", fontWeight: 500 }}>
                        + Add New
                      </MenuItem>
                    ) : (
                      <MenuItem key={option} value={option}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span>{option}</span>
                          {options?.find(opt => opt.fieldName === "hotelType" && opt.value === option) && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                const optionToDelete = options.find(
                                  opt => opt.fieldName === "hotelType" && opt.value === option
                                );
                                if (optionToDelete && window.confirm(`Delete "${option}"?`)) {
                                  dispatch(deleteLeadOption(optionToDelete._id));
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </div>
                      </MenuItem>
                    )
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Cancellation Policy"
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Hotel Policy"
                name="policy"
                value={formData.policy}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          {/* Main Image */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Main Image
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {hotelData.mainImage && (
              <Box mb={2}>
                <Typography variant="subtitle2">Current Image:</Typography>
                <Card sx={{ maxWidth: 250, mt: 1 }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={`http://localhost:5000${hotelData.mainImage}`}
                    alt="Hotel Main"
                  />
                </Card>
              </Box>
            )}

            <Button variant="outlined" component="label">
              {newMainImage ? "Change Selected Image" : "Upload New Main Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {newMainImage && (
              <Typography variant="body2" sx={{ mt: 1, color: 'green' }}>
                New image selected: {newMainImage.name}
              </Typography>
            )}
          </Box>

          {/* Contact Details */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactDetails.contactPerson}
                  onChange={(e) => handleNestedChange(e, 'contactDetails')}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Designation"
                  name="designation"
                  value={formData.contactDetails.designation}
                  onChange={(e) => handleNestedChange(e, 'contactDetails')}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={formData.contactDetails.mobile}
                  onChange={(e) => handleNestedChange(e, 'contactDetails')}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Alternate Contact"
                  name="alternateContact"
                  value={formData.contactDetails.alternateContact}
                  onChange={(e) => handleNestedChange(e, 'contactDetails')}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.contactDetails.email}
                  onChange={(e) => handleNestedChange(e, 'contactDetails')}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* ✅ UPDATED LOCATION WITH API DATA - HotelForm jaise */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Location
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.location.address}
                  onChange={(e) => handleNestedChange(e, 'location')}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Country Dropdown */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={formData.location.country}
                    onChange={(e) => handleNestedChange(e, 'location')}
                    label="Country"
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.name} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* State Dropdown */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.location.state}
                    onChange={(e) => handleNestedChange(e, 'location')}
                    label="State"
                    disabled={!formData.location.country}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.name} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* City Dropdown */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formData.location.city}
                    onChange={(e) => handleNestedChange(e, 'location')}
                    label="City"
                    disabled={!formData.location.state}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={formData.location.pincode}
                  onChange={(e) => handleNestedChange(e, 'location')}
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
              name="googleLink"
              value={formData.socialMedia.googleLink}
              onChange={(e) => handleNestedChange(e, 'socialMedia')}
              fullWidth
              placeholder="https://www.google.com"
            />
          </Box>

          {/* ✅ UPDATED FACILITIES WITH ADD NEW OPTION */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Facilities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl fullWidth>
              <InputLabel>Facilities</InputLabel>
              <Select
                multiple
                value={formData.facilities}
                onChange={handleFacilitiesChange}
                input={<OutlinedInput label="Facilities" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {getFacilityOptions().map((facility) => (
                  facility === "__add_new" ? (
                    <MenuItem key="add_new" value="__add_new">
                      <em style={{ color: "#1976d2", fontWeight: 500 }}>+ Add New</em>
                    </MenuItem>
                  ) : (
                    <MenuItem key={facility} value={facility}>
                      <Checkbox checked={formData.facilities.indexOf(facility) > -1} />
                      <ListItemText
                        primary={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <span>{facility}</span>
                            {options?.find(opt => opt.fieldName === "facilities" && opt.value === facility) && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const optionToDelete = options.find(
                                    opt => opt.fieldName === "facilities" && opt.value === facility
                                  );
                                  if (optionToDelete && window.confirm(`Delete "${facility}"?`)) {
                                    dispatch(deleteLeadOption(optionToDelete._id));
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                        }
                      />
                    </MenuItem>
                  )
                ))}
              </Select>
            </FormControl>
            <Box mt={1}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.facilities.map((facility, index) => (
                  <Chip
                    key={index}
                    label={facility}
                    onDelete={() => {
                      const newFacilities = formData.facilities.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, facilities: newFacilities }));
                    }}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Submit Buttons */}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => navigate("/hotel")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || locationLoading}
            >
              {(loading || locationLoading) ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* ✅ ADD NEW ITEM DIALOG (HotelForm jaise) */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New {currentField}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label={`New ${currentField}`}
            value={addMore}
            onChange={(e) => setAddMore(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddNewItem} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HotelEditForm;