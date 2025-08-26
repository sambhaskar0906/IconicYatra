import React, { useState } from "react";
import {
  Box, Stepper, Step, StepLabel, Button, Paper, Typography,
  Grid, TextField, MenuItem, Checkbox, FormControlLabel, Chip, Divider
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createHotel } from "../../../../features/hotel/hotelSlice";

const steps = ["Hotel Details", "Contact Details", "Policies & Facilities", "Location", "Social Media", "Rooms & Pricing"];

const facilitiesList = ["Wifi", "Parking", "Pool", "Restaurant", "Spa", "Gym", "Airport Pickup"];

const initialValues = {
  hotelName: "", hotelType: "", status: "Active", description: "",
  contactDetails: { email: "", mobile: "", alternateContact: "", designation: "", contactPerson: "" },
  cancellationPolicy: "", facilities: [], mainImage: null,
  location: { country: "India", state: "", city: "", address1: "", address2: "", address3: "", pincode: "", latitude: "", longitude: "" },
  socialMedia: { website: "", facebook: "", twitter: "", instagram: "", tripAdvisor: "", youtube: "" },
  rooms: []
};

// Create validation schemas for each step
const stepValidations = [
  Yup.object({
    hotelName: Yup.string().required("Required"),
    hotelType: Yup.string().required("Required"),
  }),
  Yup.object({
    contactDetails: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      mobile: Yup.string().required("Required"),
    }),
  }),
  Yup.object({
    cancellationPolicy: Yup.string().required("Required"),
  }),
  Yup.object({
    location: Yup.object({
      country: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      address1: Yup.string().required("Required"),
      pincode: Yup.string().required("Required"),
    }),
  }),
  Yup.object({}), // Social media is optional
  Yup.object({
    rooms: Yup.array().min(1, "At least one room season is required"),
  }),
];

export default function HotelForm() {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.hotel);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      // Append all simple fields
      formData.append("hotelName", values.hotelName);
      formData.append("hotelType", values.hotelType);
      formData.append("status", values.status);
      formData.append("description", values.description);
      formData.append("cancellationPolicy", values.cancellationPolicy);

      // Append facilities as array (not JSON string)
      values.facilities.forEach(facility => {
        formData.append("facilities", facility);
      });

      // Append nested objects as JSON
      formData.append("contactDetails", JSON.stringify(values.contactDetails));
      formData.append("location", JSON.stringify(values.location));
      formData.append("socialMedia", JSON.stringify(values.socialMedia));

      // Process rooms to handle images properly
      const processedRooms = values.rooms.map(room => ({
        ...room,
        roomDetails: room.roomDetails.map(roomDetail => ({
          ...roomDetail,
          // Don't send image files directly in JSON
          images: roomDetail.images ? roomDetail.images.map(img => img.name) : []
        }))
      }));

      formData.append("rooms", JSON.stringify(processedRooms));

      // Append main image
      if (values.mainImage) {
        formData.append("mainImage", values.mainImage);
      }

      // Append room images separately
      values.rooms.forEach((room, roomIndex) => {
        room.roomDetails.forEach((roomDetail, detailIndex) => {
          if (roomDetail.images && roomDetail.images.length > 0) {
            roomDetail.images.forEach((imageFile, imageIndex) => {
              formData.append(`roomImages`, imageFile);
            });
          }
        });
      });

      await dispatch(createHotel(formData)).unwrap();
      alert("Hotel created successfully!");
      resetForm();
      setActiveStep(0);
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={4}
        sx={{ p: 5, maxWidth: "1200px", mx: "auto", mt: 5, borderRadius: 4 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          🏨 Hotel Registration
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {loading && <Typography color="secondary">Submitting...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}

        <Formik
          initialValues={initialValues}
          validationSchema={stepValidations[activeStep]}
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {({ values, errors, touched, handleChange, setFieldValue, validateForm }) => (
            <Form>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* STEP 1 */}
                {activeStep === 0 && (
                  <Grid container spacing={3} my={5}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="hotelName"
                        label="Hotel Name"
                        value={values.hotelName}
                        onChange={handleChange}
                        error={touched.hotelName && Boolean(errors.hotelName)}
                        helperText={touched.hotelName && errors.hotelName}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        fullWidth
                        name="hotelType"
                        label="Hotel Type"
                        value={values.hotelType}
                        onChange={handleChange}
                        error={touched.hotelType && Boolean(errors.hotelType)}
                        helperText={touched.hotelType && errors.hotelType}
                      >
                        {["Resort", "Villa", "Boutique", "Business", "Budget", "Luxury"].map(
                          (type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                )}

                {/* STEP 2 */}
                {activeStep === 1 && (
                  <Grid container spacing={3}>
                    {Object.keys(values.contactDetails).map((field) => (
                      <Grid item xs={6} key={field}>
                        <TextField
                          fullWidth
                          name={`contactDetails.${field}`}
                          label={field.replace(/([A-Z])/g, " $1").trim()}
                          value={values.contactDetails[field]}
                          onChange={handleChange}
                          type={
                            field.toLowerCase().includes("mobile") ||
                              field.toLowerCase().includes("alternate")
                              ? "number"
                              : "text"
                          }
                          error={
                            touched.contactDetails &&
                            touched.contactDetails[field] &&
                            Boolean(errors.contactDetails && errors.contactDetails[field])
                          }
                          helperText={
                            touched.contactDetails &&
                            touched.contactDetails[field] &&
                            errors.contactDetails &&
                            errors.contactDetails[field]
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* STEP 3 */}
                {activeStep === 2 && (
                  <Box sx={{ my: 5 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <TextField
                          select
                          fullWidth
                          name="cancellationPolicy"
                          label="Cancellation Policy"
                          value={values.cancellationPolicy}
                          onChange={handleChange}
                          error={touched.cancellationPolicy && Boolean(errors.cancellationPolicy)}
                          helperText={touched.cancellationPolicy && errors.cancellationPolicy}
                        >
                          {["Non-refundable", "24hrs Free", "48hrs Free", "Flexible"].map(
                            (opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <input
                          accept="image/*"
                          id="mainImage"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file) {
                              setFieldValue("mainImage", file);
                            }
                          }}
                        />
                        <label htmlFor="mainImage">
                          <Button variant="outlined" component="span" sx={{ height: "56px", textTransform: "none" }} fullWidth>
                            Upload Main Image
                          </Button>
                        </label>

                        {values.mainImage && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected File: {values.mainImage.name}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 3 }}>
                          <Chip label="Facilities" color="primary" />
                        </Divider>

                        <Grid container spacing={2}>
                          {facilitiesList.map((fac) => {
                            const isChecked = values.facilities.includes(fac);
                            return (
                              <Grid item xs={6} sm={4} md={3} key={fac}>
                                <Paper
                                  elevation={isChecked ? 4 : 1}
                                  onClick={() => {
                                    if (isChecked) {
                                      setFieldValue(
                                        "facilities",
                                        values.facilities.filter((f) => f !== fac)
                                      );
                                    } else {
                                      setFieldValue("facilities", [...values.facilities, fac]);
                                    }
                                  }}
                                  sx={{
                                    p: 1,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    border: isChecked ? "2px solid #1976d2" : "1px solid #e0e0e0",
                                    bgcolor: isChecked ? "primary.light" : "background.paper",
                                    color: isChecked ? "primary.contrastText" : "text.primary",
                                    transition: "0.3s",
                                    "&:hover": {
                                      boxShadow: 6,
                                    },
                                  }}
                                >
                                  <Typography fontWeight="bold">{fac}</Typography>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* STEP 4 */}
                {activeStep === 3 && (
                  <Grid container spacing={3}>
                    {Object.keys(values.location).map((field) => (
                      <Grid item xs={6} key={field}>
                        <TextField
                          fullWidth
                          name={`location.${field}`}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={values.location[field]}
                          onChange={handleChange}
                          placeholder={field === "country" ? "India" : ""}
                          error={
                            touched.location &&
                            touched.location[field] &&
                            Boolean(errors.location && errors.location[field])
                          }
                          helperText={
                            touched.location &&
                            touched.location[field] &&
                            errors.location &&
                            errors.location[field]
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* STEP 5 */}
                {activeStep === 4 && (
                  <Grid container spacing={3}>
                    {Object.keys(values.socialMedia).map((field) => (
                      <Grid item xs={6} key={field}>
                        <TextField
                          fullWidth
                          name={`socialMedia.${field}`}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={values.socialMedia[field]}
                          onChange={handleChange}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* STEP 6 */}
                {activeStep === 5 && (
                  <FieldArray name="rooms">
                    {({ push, remove }) => (
                      <Box>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() =>
                            push({
                              seasonType: "",
                              validFrom: "",
                              validTill: "",
                              roomDetails: [{
                                roomType: "",
                                mealPlan: "", // CHANGED: Single mealPlan instead of mealPlans object
                                images: [],
                                mattressCost: {
                                  mealPlan: "",
                                  adult: 0,
                                  children: 0,
                                  kidWithoutMattress: 0,
                                },
                                peakCost: [],
                              }],
                            })
                          }
                        >
                          Add Room Season
                        </Button>
                        {values.rooms.map((season, seasonIndex) => (
                          <Paper
                            sx={{ p: 3, mt: 3, borderRadius: 3 }}
                            elevation={2}
                            key={seasonIndex}
                          >
                            <Grid container spacing={3}>
                              <Grid item xs={4}>
                                <TextField
                                  select
                                  fullWidth
                                  name={`rooms[${seasonIndex}].seasonType`}
                                  label="Season Type"
                                  value={season.seasonType}
                                  onChange={handleChange}
                                >
                                  {["Peak", "Off-Season", "Festival", "Weekend"].map((s) => (
                                    <MenuItem key={s} value={s}>
                                      {s}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  type="date"
                                  fullWidth
                                  name={`rooms[${seasonIndex}].validFrom`}
                                  label="Valid From"
                                  InputLabelProps={{ shrink: true }}
                                  value={season.validFrom}
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  type="date"
                                  fullWidth
                                  name={`rooms[${seasonIndex}].validTill`}
                                  label="Valid Till"
                                  InputLabelProps={{ shrink: true }}
                                  value={season.validTill}
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>

                            {/* Room Details */}
                            <FieldArray name={`rooms[${seasonIndex}].roomDetails`}>
                              {({ push, remove }) => (
                                <Box mt={2}>
                                  <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() =>
                                      push({
                                        roomType: "",
                                        mealPlan: "", // CHANGED: Single mealPlan instead of mealPlans object
                                        images: [],
                                        mattressCost: {
                                          mealPlan: "",
                                          adult: 0,
                                          children: 0,
                                          kidWithoutMattress: 0,
                                        },
                                        peakCost: [],
                                      })
                                    }
                                  >
                                    Add Room
                                  </Button>

                                  {season.roomDetails?.map((room, roomIndex) => (
                                    <Paper
                                      key={roomIndex}
                                      sx={{ p: 3, mt: 2, borderRadius: 2 }}
                                      variant="outlined"
                                    >
                                      <Typography variant="h6" gutterBottom>
                                        Room {roomIndex + 1}
                                      </Typography>

                                      <Grid container spacing={2}>
                                        {/* Room Type */}
                                        <Grid item xs={6}>
                                          <TextField
                                            select
                                            fullWidth
                                            name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].roomType`}
                                            label="Room Type"
                                            value={room.roomType}
                                            onChange={handleChange}
                                          >
                                            {["Standard", "Deluxe", "Suite", "Family", "Dormitory"].map(
                                              (opt) => (
                                                <MenuItem key={opt} value={opt}>
                                                  {opt}
                                                </MenuItem>
                                              )
                                            )}
                                          </TextField>
                                        </Grid>

                                        {/* Meal Plan (SINGLE SELECT) - CHANGED */}
                                        <Grid item xs={6}>
                                          <TextField
                                            select
                                            fullWidth
                                            name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].mealPlan`}
                                            label="Meal Plan"
                                            value={room.mealPlan}
                                            onChange={handleChange}
                                            error={
                                              touched.rooms &&
                                              touched.rooms[seasonIndex] &&
                                              touched.rooms[seasonIndex].roomDetails &&
                                              touched.rooms[seasonIndex].roomDetails[roomIndex] &&
                                              Boolean(
                                                errors.rooms &&
                                                errors.rooms[seasonIndex] &&
                                                errors.rooms[seasonIndex].roomDetails &&
                                                errors.rooms[seasonIndex].roomDetails[roomIndex] &&
                                                errors.rooms[seasonIndex].roomDetails[roomIndex].mealPlan
                                              )
                                            }
                                            helperText={
                                              touched.rooms &&
                                              touched.rooms[seasonIndex] &&
                                              touched.rooms[seasonIndex].roomDetails &&
                                              touched.rooms[seasonIndex].roomDetails[roomIndex] &&
                                              errors.rooms &&
                                              errors.rooms[seasonIndex] &&
                                              errors.rooms[seasonIndex].roomDetails &&
                                              errors.rooms[seasonIndex].roomDetails[roomIndex] &&
                                              errors.rooms[seasonIndex].roomDetails[roomIndex].mealPlan
                                            }
                                          >
                                            {["EP", "CP", "MAP", "AP"].map((opt) => (
                                              <MenuItem key={opt} value={opt}>
                                                {opt}
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </Grid>

                                        {/* Image Upload */}
                                        <Grid item xs={4}>
                                          <input
                                            accept="image/*"
                                            id={`room-image-${seasonIndex}-${roomIndex}`}
                                            type="file"
                                            multiple
                                            style={{ display: "none" }}
                                            onChange={(event) => {
                                              const files = Array.from(event.currentTarget.files);
                                              if (files.length > 0) {
                                                // Store file objects directly
                                                setFieldValue(
                                                  `rooms[${seasonIndex}].roomDetails[${roomIndex}].images`,
                                                  files
                                                );
                                              }
                                            }}
                                          />
                                          <label htmlFor={`room-image-${seasonIndex}-${roomIndex}`}>
                                            <Button variant="outlined" component="span">
                                              Upload Images
                                            </Button>
                                          </label>

                                          {room.images?.length > 0 && (
                                            <Box mt={1}>
                                              {room.images.map((img, idx) => (
                                                <Typography key={idx} variant="body2">
                                                  {img.name || img}
                                                </Typography>
                                              ))}
                                            </Box>
                                          )}
                                        </Grid>

                                        {/* Mattress Costs */}
                                        <Grid item xs={12}>
                                          <Typography variant="h6">Mattress Cost</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <TextField
                                            select
                                            fullWidth
                                            name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].mattressCost.mealPlan`}
                                            label="Meal Plan"
                                            value={room.mattressCost.mealPlan}
                                            onChange={handleChange}
                                          >
                                            {["EP", "CP", "MAP", "AP"].map((opt) => (
                                              <MenuItem key={opt} value={opt}>
                                                {opt}
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <TextField
                                            type="number"
                                            fullWidth
                                            name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].mattressCost.adult`}
                                            label="Adult"
                                            value={room.mattressCost.adult}
                                            onChange={handleChange}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <TextField
                                            type="number"
                                            fullWidth
                                            name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].mattressCost.children`}
                                            label="Children"
                                            value={room.mattressCost.children}
                                            onChange={handleChange}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <TextField
                                            type="number"
                                            fullWidth
                                            name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].mattressCost.kidWithoutMattress`}
                                            label="Kid (No Mattress)"
                                            value={room.mattressCost.kidWithoutMattress}
                                            onChange={handleChange}
                                          />
                                        </Grid>
                                      </Grid>

                                      {/* Peak Cost Section */}
                                      <FieldArray
                                        name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost`}
                                      >
                                        {({ push: pushPeak, remove: removePeak }) => (
                                          <Box mt={3}>
                                            <Typography variant="subtitle1" gutterBottom>
                                              Peak Costs
                                            </Typography>
                                            <Button
                                              size="small"
                                              variant="outlined"
                                              startIcon={<Add />}
                                              onClick={() =>
                                                pushPeak({
                                                  title: "",
                                                  validFrom: "",
                                                  validTill: "",
                                                  surcharge: 0,
                                                  note: "",
                                                  weekendSpecial: false,
                                                })
                                              }
                                            >
                                              Add Peak Cost
                                            </Button>

                                            {room.peakCost?.map((peak, peakIndex) => (
                                              <Grid
                                                container
                                                spacing={2}
                                                key={peakIndex}
                                                sx={{
                                                  mt: 1,
                                                  p: 2,
                                                  border: "1px dashed #ccc",
                                                  borderRadius: 2,
                                                }}
                                              >
                                                {/* Weekend Special Checkbox */}
                                                <Grid item xs={12}>
                                                  <FormControlLabel
                                                    control={
                                                      <Checkbox
                                                        checked={peak.weekendSpecial || false}
                                                        onChange={(e) => {
                                                          const checked = e.target.checked;
                                                          setFieldValue(
                                                            `rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].weekendSpecial`,
                                                            checked
                                                          );

                                                          if (checked) {
                                                            setFieldValue(
                                                              `rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].title`,
                                                              "Sat-Sun Special"
                                                            );

                                                            setFieldValue(
                                                              `rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].validFrom`,
                                                              ""
                                                            );
                                                            setFieldValue(
                                                              `rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].validTill`,
                                                              ""
                                                            );
                                                          }
                                                        }}
                                                      />
                                                    }
                                                    label="Sat-Sun Special"
                                                  />
                                                </Grid>

                                                {/* Conditionally Render Fields */}
                                                {!peak.weekendSpecial ? (
                                                  <>
                                                    <Grid item xs={6}>
                                                      <TextField
                                                        fullWidth
                                                        name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].title`}
                                                        label="Title"
                                                        value={peak.title}
                                                        onChange={handleChange}
                                                      />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                      <TextField
                                                        type="date"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].validFrom`}
                                                        label="Valid From"
                                                        value={peak.validFrom}
                                                        onChange={handleChange}
                                                      />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                      <TextField
                                                        type="date"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].validTill`}
                                                        label="Valid Till"
                                                        value={peak.validTill}
                                                        onChange={handleChange}
                                                      />
                                                    </Grid>
                                                  </>
                                                ) : (
                                                  <Grid item xs={12}>
                                                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                                                      Title: Sat-Sun Special
                                                    </Typography>
                                                  </Grid>
                                                )}

                                                {/* Surcharge (always visible) */}
                                                <Grid item xs={6}>
                                                  <TextField
                                                    type="number"
                                                    fullWidth
                                                    name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].surcharge`}
                                                    label="Surcharge"
                                                    value={peak.surcharge}
                                                    onChange={handleChange}
                                                  />
                                                </Grid>

                                                {/* Note */}
                                                <Grid item xs={12}>
                                                  <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    name={`rooms[${seasonIndex}].roomDetails[${roomIndex}].peakCost[${peakIndex}].note`}
                                                    label="Note"
                                                    value={peak.note}
                                                    onChange={handleChange}
                                                  />
                                                </Grid>

                                                {/* Remove Button */}
                                                <Grid item xs={12} textAlign="right">
                                                  <Button
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => removePeak(peakIndex)}
                                                  >
                                                    Remove Peak
                                                  </Button>
                                                </Grid>
                                              </Grid>
                                            ))}
                                          </Box>
                                        )}
                                      </FieldArray>

                                      {/* Remove Room */}
                                      <Box mt={2} textAlign="right">
                                        <Button
                                          color="error"
                                          variant="outlined"
                                          startIcon={<Delete />}
                                          onClick={() => remove(roomIndex)}
                                        >
                                          Remove Room
                                        </Button>
                                      </Box>
                                    </Paper>
                                  ))}
                                </Box>
                              )}
                            </FieldArray>

                            {/* Remove Season Button */}
                            <Box mt={2} textAlign="right">
                              <Button
                                color="error"
                                variant="outlined"
                                startIcon={<Delete />}
                                onClick={() => remove(seasonIndex)}
                              >
                                Remove Season
                              </Button>
                            </Box>
                          </Paper>
                        ))}
                        {errors.rooms && typeof errors.rooms === 'string' && (
                          <Typography color="error" sx={{ mt: 2 }}>
                            {errors.rooms}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </FieldArray>
                )}
              </motion.div>

              {/* Buttons */}
              <Box mt={4} display="flex" justifyContent="space-between">
                {/* Cancel Button */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setActiveStep(0)}
                >
                  Cancel
                </Button>

                <Box display="flex" gap={2}>
                  {activeStep > 0 && (
                    <Button onClick={handleBack} variant="outlined" color="secondary">
                      Back
                    </Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  )}
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </motion.div>
  );
}