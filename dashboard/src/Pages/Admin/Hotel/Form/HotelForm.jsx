// HotelForm.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  InputLabel,
  Select,
  FormControl,
  FormHelperText,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as Yup from "yup";
import HotelFormStep2 from "./HotelFormStep2";
import HotelFormStep3 from "./HotelFormStep3";
import HotelFormStep4 from "./HotelFormStep4";
import {
  createHotelStep1,
  updateHotelStep2,
  updateHotelStep3,
  updateHotelStep4,
  setHotelId
} from "../../../../features/hotel/hotelSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
  clearStates,
  clearCities,
} from "../../../../features/location/locationSlice";

// YE IMPORT ADD KARO - aapke leadSlice se
import { getLeadOptions, addLeadOption, deleteLeadOption } from "../../../../features/leads/leadSlice";

const steps = ["Hotel Details", "Room Details", "Mattress Cost", "Peak Cost"];


const validationSchema = Yup.object().shape({
  hotelName: Yup.string().required("Required"),
  hotelType: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  mobile: Yup.string().required("Required"),
  alternateContact: Yup.string(),
  designation: Yup.string(),
  contactPerson: Yup.string(),
  description: Yup.string(),
  cancellationPolicy: Yup.string(),
  facilities: Yup.array().min(1, "Select at least one facility"),
  country: Yup.string(),
  state: Yup.string(),
  city: Yup.string(),
  address: Yup.string(),
  pincode: Yup.string(),
  googleLink: Yup.string().url("Invalid URL"),
  policy: Yup.string(),
});

const HotelForm = ({ onSubmit, initialValues, isEdit = false }) => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [hotelId, setHotelId] = useState(null);
  const { error, success } = useSelector((state) => state.hotel);
  const { countries, states, cities, loading } = useSelector(
    (state) => state.location
  );

  // YE SELECTOR ADD KARO
  const { options } = useSelector((state) => state.leads);

  const [hotelData, setHotelData] = useState({
    step1: {}, // Hotel details
    step2: {}, // Room details
    step3: {}, // Mattress cost
    step4: {}, // Peak cost
  });

  // YE DIALOG STATE ADD KARO (PackageEntryForm jaise)
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [addMore, setAddMore] = useState("");

  // facilities dropdown options
  const [facilityOptions, setFacilityOptions] = useState([
    "24*7 Service",
    "Bathroom",
    "WiFi",
    "Bar",
    "Air Conditioning",
  ]);

  // modal state for facilities
  const [openModal, setOpenModal] = useState(false);
  const [newFacility, setNewFacility] = useState("");
  const [tempSelected, setTempSelected] = useState([]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleStepData = (step, data) => {
    setHotelData((prev) => ({ ...prev, [step]: data }));
    handleNext();
  };

  // ===== YE ADD NEW OPTION LOGIC ADD KARO (PackageEntryForm jaise) =====
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
        formik.setFieldValue("hotelType", newValue);
      } else if (currentField === "facilities") {
        formik.setFieldValue("facilities", [...formik.values.facilities, newValue]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Failed to add new option", error);
    }
  };

  const getOptionsForField = (fieldName) => {
    const filteredOptions = options
      ?.filter((opt) => opt.fieldName === fieldName)
      .map((opt) => ({ value: opt.value, label: opt.value }));

    return [
      ...(filteredOptions || []),
      { value: "__add_new", label: "+ Add New" },
    ];
  };

  // For hotel types (single select)
  const getHotelTypeOptions = () => {
    const filteredOptions = options
      ?.filter((opt) => opt.fieldName === "hotelType")
      .map((opt) => opt.value);

    return [
      ...(filteredOptions || initialHotelTypes),
      "__add_new"
    ];
  };

  const formik = useFormik({
    initialValues: {
      hotelName: "",
      hotelType: "",
      email: "",
      mobile: "",
      alternateContact: "",
      designation: "",
      contactPerson: "",
      description: "",
      cancellationPolicy: "",
      facilities: [],
      mainImage: null,
      country: "India",
      state: "",
      city: "",
      address: "",
      pincode: "",
      googleLink: "",
      policy: "",
    },
    validationSchema,
    enableReinitialize: true,
    // HotelForm.jsx - onSubmit function check karo
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();

        // ✅ Ensure ALL fields are included
        Object.keys(values).forEach((key) => {
          if (key === "facilities" || key === "hotelType") {
            formData.append(key, JSON.stringify(values[key]));
          } else if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        });

        console.log("🔹 Sending form data with keys:", Object.keys(values));

        // ✅ Step 1 API call
        const resultAction = await dispatch(createHotelStep1(formData)).unwrap();
        setHotelId(resultAction._id);
        handleNext();
      } catch (err) {
        console.error("Hotel creation failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    dispatch(fetchCountries());
    // YE ADD KARO - lead options fetch karo
    dispatch(getLeadOptions());
  }, [dispatch]);

  // ---------- Fetch States on Country Change ----------
  useEffect(() => {
    if (formik.values.country) {
      dispatch(fetchStatesByCountry(formik.values.country));
      dispatch(clearCities());
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
    } else {
      dispatch(clearStates());
      dispatch(clearCities());
    }
  }, [formik.values.country, dispatch]);

  // ---------- Fetch Cities on State Change ----------
  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      dispatch(
        fetchCitiesByState({
          countryName: formik.values.country,
          stateName: formik.values.state,
        })
      );
      formik.setFieldValue("city", "");
    } else {
      dispatch(clearCities());
    }
  }, [formik.values.state, formik.values.country, dispatch]);

  const handleAddFacility = () => {
    if (newFacility.trim() && !facilityOptions.includes(newFacility)) {
      const updatedOptions = [...facilityOptions, newFacility];
      setFacilityOptions(updatedOptions);
      formik.setFieldValue("facilities", [...tempSelected, newFacility]);
    } else {
      formik.setFieldValue("facilities", tempSelected);
    }
    setNewFacility("");
    setTempSelected([]);
    setOpenModal(false);
  };

  const renderField = (name, label, multiline = false, rows = 1) => (
    <TextField
      label={label}
      name={name}
      fullWidth
      size="small"
      required
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      multiline={multiline}
      rows={rows}
    />
  );

  return (
    <Box p={2}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Step Screens */}
      {activeStep === 0 && (
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Hotel Entry Form
          </Typography>

          {/* Hotel Details */}
          <Box border={1} borderRadius={1} p={2} mb={3}>
            <Typography variant="subtitle1">Hotel Details</Typography>
            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField("hotelName", "Hotel Name")}
              </Grid>

              {/* Hotel Type with Add New - YE CHANGE KARO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Hotel Type</InputLabel>
                  <Select
                    name="hotelType"
                    value={formik.values.hotelType}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "__add_new") {
                        handleOpenDialog("hotelType");
                      } else {
                        formik.handleChange(e);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.hotelType && Boolean(formik.errors.hotelType)
                    }
                  >
                    {getHotelTypeOptions().map((type) => (
                      type === "__add_new" ? (
                        <MenuItem key="add_new" value="__add_new" style={{ color: "#1976d2", fontWeight: 500 }}>
                          + Add New
                        </MenuItem>
                      ) : (
                        <MenuItem key={type} value={type}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <span>{type}</span>
                            {options?.find(opt => opt.fieldName === "hotelType" && opt.value === type) && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const optionToDelete = options.find(
                                    opt => opt.fieldName === "hotelType" && opt.value === type
                                  );
                                  if (optionToDelete && window.confirm(`Delete "${type}"?`)) {
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
                  {formik.touched.hotelType && formik.errors.hotelType && (
                    <FormHelperText error>
                      {formik.errors.hotelType}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>{renderField("email", "Email")}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField("mobile", "Mobile")}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField("alternateContact", "Alternate Contact")}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField("designation", "Designation")}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField("contactPerson", "Contact Person")}
              </Grid>
              <Grid size={{ xs: 12 }}>
                {renderField("description", "Hotel Description", true, 2)}
              </Grid>
              <Grid size={{ xs: 12 }}>
                {renderField("cancellationPolicy", "Cancellation Policy", true, 2)}
              </Grid>

              {/* Facilities - Multi Select with Add New - YE CHANGE KARO */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Facilities</InputLabel>
                  <Select
                    multiple
                    name="facilities"
                    value={formik.values.facilities}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.includes("__add_new")) {
                        const filtered = value.filter((v) => v !== "__add_new");
                        formik.setFieldValue("facilities", filtered);
                        handleOpenDialog("facilities");
                      } else {
                        formik.setFieldValue("facilities", value);
                      }
                    }}
                    renderValue={(selected) => selected.join(", ")}
                    error={
                      formik.touched.facilities &&
                      Boolean(formik.errors.facilities)
                    }
                  >
                    {getOptionsForField("facilities").map((option) => (
                      option.value === "__add_new" ? (
                        <MenuItem key="add_new" value="__add_new">
                          <em style={{ color: "#1976d2", fontWeight: 500 }}>+ Add New</em>
                        </MenuItem>
                      ) : (
                        <MenuItem key={option.value} value={option.value}>
                          <Checkbox
                            checked={formik.values.facilities.includes(option.value)}
                          />
                          <ListItemText
                            primary={
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <span>{option.value}</span>
                                {options?.find(opt => opt.fieldName === "facilities" && opt.value === option.value) && (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const optionToDelete = options.find(
                                        opt => opt.fieldName === "facilities" && opt.value === option.value
                                      );
                                      if (optionToDelete && window.confirm(`Delete "${option.value}"?`)) {
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
                  {formik.touched.facilities && formik.errors.facilities && (
                    <FormHelperText error>
                      {formik.errors.facilities}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Main Image Upload */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Main Image (1300px X 400px recommended)
                </Typography>
                <Button variant="outlined" component="label" fullWidth>
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    name="mainImage"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "mainImage",
                        event.currentTarget.files[0]
                      );
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Button>
                {formik.values.mainImage && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formik.values.mainImage.name}
                  </Typography>
                )}
                {formik.touched.mainImage && formik.errors.mainImage && (
                  <Typography variant="caption" color="error">
                    {formik.errors.mainImage}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Rest of your existing code remains same */}
          {/* Hotel Location */}
          <Box border={1} borderRadius={1} p={2} mb={3}>
            <Typography variant="subtitle1">Hotel Location</Typography>
            <Grid container spacing={2} mt={1}>
              {/* Country */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={formik.values.country}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("state", "");
                      formik.setFieldValue("city", "");
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.name} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.country && formik.errors.country && (
                    <FormHelperText error>{formik.errors.country}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formik.values.state}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("city", "");
                    }}
                    onBlur={formik.handleBlur}
                    disabled={!formik.values.country}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.name} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && formik.errors.state && (
                    <FormHelperText error>{formik.errors.state}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!formik.values.state}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.city && formik.errors.city && (
                    <FormHelperText error>{formik.errors.city}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Address and other fields */}
              <Grid size={{ xs: 12, sm: 8 }}>
                {renderField("address", "Address")}
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField("pincode", "Pincode")}
              </Grid>
            </Grid>
          </Box>

          {/* Social Media */}
          <Box border={1} borderRadius={1} p={2} mb={3}>
            <Typography variant="subtitle1">Social Media</Typography>
            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 12 }}>
                {renderField("googleLink", "Google Link")}
              </Grid>
            </Grid>
          </Box>

          {/* Hotel Policy */}
          <Box border={1} borderRadius={1} p={2} mb={3}>
            <Typography variant="subtitle1">Hotel Policy</Typography>
            {renderField("policy", "Hotel Policy", true, 4)}
          </Box>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting || loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 1 && (
        <HotelFormStep2 hotelId={hotelId} onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 2 && (
        <HotelFormStep3 hotelId={hotelId} onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 3 && <HotelFormStep4 hotelId={hotelId} onBack={handleBack} />}

      {/* YE DIALOG ADD KARO (PackageEntryForm jaise) */}
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

      {/* Add Facility Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Facility</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Facility Name"
            fullWidth
            size="small"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleAddFacility} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HotelForm;