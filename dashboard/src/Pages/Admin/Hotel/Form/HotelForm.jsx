// src/pages/CreateHotel.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createHotel, clearMessages } from "../../../../features/hotel/hotelSlice";
import { useNavigate } from "react-router-dom";

const steps = [
  "Basic Info",
  "Contact Details",
  "Location",
  "Facilities & Images",
  "Rooms",
];

const CreateHotel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.hotel);

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    hotelName: "",
    hotelType: [],
    status: "",
    description: "",
    cancellationPolicy: "",
    contactDetails: {
      email: "",
      mobile: "",
      alternateContact: "",
      designation: "",
      contactPerson: "",
    },
    location: {
      country: "",
      state: "",
      city: "",
      address1: "",
      pincode: "",
    },
    facilities: [],
    mainImage: null,
    socialMedia: { googleLink: "" },
    rooms: [
      {
        seasonType: "",
        validFrom: "",
        validTill: "",
        roomDetails: [
          {
            roomType: [],
            mealPlan: "",
            images: [],
            mattressCost: {
              mealPlan: "",
              adult: 0,
              children: 0,
              kidWithoutMattress: 0,
            },
            peakCost: [],
          },
        ],
      },
    ],
  });

  // ✅ Input Change Handler
  const handleChange = (e, parent = null) => {
    const { name, value } = e.target;
    if (parent) {
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Facilities Add
  const handleAddFacility = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, e.target.value.trim()],
      }));
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    const payload = new FormData();

    // Prepare rooms properly
    const rooms = formData.rooms.map((r) => ({
      ...r,
      validFrom: r.validFrom ? new Date(r.validFrom) : null,
      validTill: r.validTill ? new Date(r.validTill) : null,
      roomDetails: r.roomDetails.map((rd) => ({
        ...rd,
        peakCost: rd.peakCost.map((pc) => ({
          ...pc,
          validFrom: pc.validFrom ? new Date(pc.validFrom) : null,
          validTill: pc.validTill ? new Date(pc.validTill) : null,
        })),
        // remove images from JSON, handle separately
        images: undefined,
      })),
    }));

    // Append mainImage
    if (formData.mainImage) {
      payload.append("mainImage", formData.mainImage);
    }

    // Append rooms as JSON
    payload.append("rooms", JSON.stringify(rooms));

    // Append other fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "mainImage" && key !== "rooms") {
        if (typeof value === "object") {
          payload.append(key, JSON.stringify(value));
        } else {
          payload.append(key, value);
        }
      }
    });

    // Append room images separately
    formData.rooms.forEach((r, i) => {
      r.roomDetails.forEach((rd, j) => {
        rd.images.forEach((file) => {
          payload.append(`roomImages`, file); // backend can use multer.array('roomImages')
        });
      });
    });

    dispatch(createHotel(payload));
  };


  // ✅ Success / Error Handler
  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearMessages());
      navigate("/hotel");
    }
    if (error) {
      alert(error);
      dispatch(clearMessages());
    }
  }, [success, error, navigate, dispatch]);

  // ✅ Stepper Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Hotel Name"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Hotel Type</InputLabel>
                <Select
                  multiple
                  name="hotelType"
                  value={formData.hotelType}
                  onChange={(e) =>
                    setFormData({ ...formData, hotelType: e.target.value })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((val) => (
                        <Chip key={val} label={val} />
                      ))}
                    </Box>
                  )}
                >
                  {["Resort", "Hotel", "Homestay", "Villa"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Cancellation Policy"
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );

      case 1: // Contact Details
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.contactDetails.email}
                onChange={(e) => handleChange(e, "contactDetails")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={formData.contactDetails.mobile}
                onChange={(e) => handleChange(e, "contactDetails")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contactPerson"
                value={formData.contactDetails.contactPerson}
                onChange={(e) => handleChange(e, "contactDetails")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.contactDetails.designation}
                onChange={(e) => handleChange(e, "contactDetails")}
              />
            </Grid>
          </Grid>
        );

      case 2: // Location
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.location.country}
                onChange={(e) => handleChange(e, "location")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.location.state}
                onChange={(e) => handleChange(e, "location")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.location.city}
                onChange={(e) => handleChange(e, "location")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address"
                name="address1"
                value={formData.location.address1}
                onChange={(e) => handleChange(e, "location")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={formData.location.pincode}
                onChange={(e) => handleChange(e, "location")}
              />
            </Grid>
          </Grid>
        );

      case 3: // Facilities & Images
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Add Facility (Press Enter)"
                onKeyDown={handleAddFacility}
              />
              <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                {formData.facilities.map((f, i) => (
                  <Chip
                    key={i}
                    label={f}
                    onDelete={() =>
                      setFormData((prev) => ({
                        ...prev,
                        facilities: prev.facilities.filter((x) => x !== f),
                      }))
                    }
                  />
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="outlined" component="label">
                Upload Main Image
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setFormData({ ...formData, mainImage: e.target.files[0] })
                  }
                />
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Google Link"
                name="googleLink"
                value={formData.socialMedia.googleLink}
                onChange={(e) => handleChange(e, "socialMedia")}
              />
            </Grid>
          </Grid>
        );

      case 4: // Rooms
        const seasonOptions = ["Summer", "Winter", "Monsoon"];
        const mealPlanOptions = ["CP", "MAP", "AP", "EP"];
        const roomTypes = ["Single", "Double", "Triple", "Suite"];

        return (
          <Grid container spacing={2}>
            {/* Season */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Season Type</InputLabel>
                <Select
                  name="seasonType"
                  value={formData.rooms[0].seasonType}
                  onChange={(e) => {
                    const rooms = [...formData.rooms];
                    rooms[0].seasonType = e.target.value;
                    setFormData({ ...formData, rooms });
                  }}
                >
                  {seasonOptions.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Room Type */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  multiple
                  value={formData.rooms[0].roomDetails[0].roomType}
                  onChange={(e) => {
                    const rooms = [...formData.rooms];
                    rooms[0].roomDetails[0].roomType = e.target.value;
                    setFormData({ ...formData, rooms });
                  }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {roomTypes.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Meal Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Meal Plan</InputLabel>
                <Select
                  value={formData.rooms[0].roomDetails[0].mealPlan}
                  onChange={(e) => {
                    const rooms = [...formData.rooms];
                    rooms[0].roomDetails[0].mealPlan = e.target.value;
                    // Sync mattressCost
                    rooms[0].roomDetails[0].mattressCost.mealPlan = e.target.value;
                    setFormData({ ...formData, rooms });
                  }}
                >
                  {mealPlanOptions.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Mattress Cost */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Adult Mattress Cost"
                value={formData.rooms[0].roomDetails[0].mattressCost.adult}
                onChange={(e) => {
                  const rooms = [...formData.rooms];
                  rooms[0].roomDetails[0].mattressCost.adult = Number(e.target.value);
                  setFormData({ ...formData, rooms });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Children Mattress Cost"
                value={formData.rooms[0].roomDetails[0].mattressCost.children}
                onChange={(e) => {
                  const rooms = [...formData.rooms];
                  rooms[0].roomDetails[0].mattressCost.children = Number(e.target.value);
                  setFormData({ ...formData, rooms });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Kid Without Mattress Cost"
                value={formData.rooms[0].roomDetails[0].mattressCost.kidWithoutMattress}
                onChange={(e) => {
                  const rooms = [...formData.rooms];
                  rooms[0].roomDetails[0].mattressCost.kidWithoutMattress = Number(e.target.value);
                  setFormData({ ...formData, rooms });
                }}
              />
            </Grid>

            {/* Peak Cost */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  const rooms = [...formData.rooms];
                  rooms[0].roomDetails[0].peakCost.push({
                    title: "",
                    validFrom: "",
                    validTill: "",
                    surcharge: 0,
                    note: "",
                  });
                  setFormData({ ...formData, rooms });
                }}
              >
                Add Peak Cost
              </Button>

              {formData.rooms[0].roomDetails[0].peakCost.map((pc, idx) => (
                <Grid container spacing={1} key={idx} mt={1}>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={pc.title}
                      onChange={(e) => {
                        const rooms = [...formData.rooms];
                        rooms[0].roomDetails[0].peakCost[idx].title = e.target.value;
                        setFormData({ ...formData, rooms });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      type="date"
                      fullWidth
                      label="Valid From"
                      value={pc.validFrom}
                      onChange={(e) => {
                        const rooms = [...formData.rooms];
                        rooms[0].roomDetails[0].peakCost[idx].validFrom = e.target.value;
                        setFormData({ ...formData, rooms });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      type="date"
                      fullWidth
                      label="Valid Till"
                      value={pc.validTill}
                      onChange={(e) => {
                        const rooms = [...formData.rooms];
                        rooms[0].roomDetails[0].peakCost[idx].validTill = e.target.value;
                        setFormData({ ...formData, rooms });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Surcharge"
                      value={pc.surcharge}
                      onChange={(e) => {
                        const rooms = [...formData.rooms];
                        rooms[0].roomDetails[0].peakCost[idx].surcharge = Number(e.target.value);
                        setFormData({ ...formData, rooms });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Note"
                      value={pc.note}
                      onChange={(e) => {
                        const rooms = [...formData.rooms];
                        rooms[0].roomDetails[0].peakCost[idx].note = e.target.value;
                        setFormData({ ...formData, rooms });
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid size={{ xs: 12 }} textAlign="center">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.rooms[0].seasonType ||
                  !formData.rooms[0].roomDetails[0].mealPlan
                }
              >
                {loading ? "Saving..." : "Create Hotel"}
              </Button>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Create Hotel
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box mt={3}>{renderStepContent(activeStep)}</Box>

      {/* Step Buttons */}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CreateHotel;
