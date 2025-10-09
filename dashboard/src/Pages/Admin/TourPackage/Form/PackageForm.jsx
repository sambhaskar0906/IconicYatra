import React, { useState, useEffect } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Typography,
  Autocomplete,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
  clearStates,
  clearCities,
  fetchDomesticCities,
  fetchInternationalCities
} from "../../../../features/location/locationSlice";
import { getLeadOptions, addLeadOption, deleteLeadOption } from "../../../../features/leads/leadSlice";
import DeleteIcon from "@mui/icons-material/Delete";

const PackageEntryForm = ({ onNext, initialData }) => {
  const [tourType, setTourType] = useState(initialData?.tourType || "Domestic");
  const [allCities, setAllCities] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [stayLocationList, setStayLocationList] = useState(initialData?.stayLocations || []);
  const [selectedCountry, setSelectedCountry] = useState(initialData?.destinationCountry || "");
  const [searchText, setSearchText] = useState("");
  const BOX_HEIGHT = 220;

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [addMore, setAddMore] = useState("");

  const dispatch = useDispatch();
  const { countries, states } = useSelector((state) => state.location);
  const { options } = useSelector((state) => state.leads);
  const { loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(getLeadOptions());
  }, [dispatch]);

  // REMOVED the problematic useEffect - cities should only be fetched when a state is selected
  // NOT when tourType changes

  const formik = useFormik({
    initialValues: {
      tourType: initialData?.tourType || "Domestic",
      sector: initialData?.sector || "",
      destinationCountry: initialData?.destinationCountry || "",
      packageSubType: initialData?.packageSubType || [],
    },
    validationSchema: Yup.object({
      tourType: Yup.string().required("Tour type is required"),
      destinationCountry: Yup.string().when("tourType", {
        is: "International",
        then: (schema) => schema.required("Destination country is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      sector: Yup.string().required("State is required"),
      packageSubType: Yup.array()
        .of(Yup.string())
        .min(1, "At least one package sub type is required"),
    }),
    onSubmit: (values) => {
      if (stayLocationList.length === 0) {
        alert("Please select at least one stay location.");
        return;
      }

      // ✅ Pass correct payload to MultiStep form
      const payload = {
        ...values,
        stayLocations: stayLocationList,
      };

      onNext(payload, stayLocationList);
    },
  });

  const handleTourTypeChange = (e) => {
    const selectedType = e.target.value;
    setTourType(selectedType);

    formik.setFieldValue("tourType", selectedType);
    formik.setFieldValue("sector", "");
    formik.setFieldValue("destinationCountry", "");
    formik.setFieldValue("packageSubType", "");
    formik.setTouched({});

    setAllCities([]);
    setLocationList([]);
    setStayLocationList([]);
    dispatch(clearStates());
    dispatch(clearCities());

    if (selectedType === "Domestic") {
      formik.setFieldValue("destinationCountry", "India");
      setSelectedCountry("India");
      dispatch(fetchStatesByCountry("India"));
    } else {
      formik.setFieldValue("destinationCountry", "");
      setSelectedCountry("");
    }
  };

  const handleCountryChange = (countryName) => {
    setSelectedCountry(countryName);
    formik.setFieldValue("destinationCountry", countryName);
    formik.setFieldValue("sector", ""); // reset state
    formik.setFieldValue("packageSubType", []);

    setAllCities([]);
    setLocationList([]);
    setStayLocationList([]);
    dispatch(clearStates());
    dispatch(clearCities());

    // ✅ Pass only countryName string
    dispatch(fetchStatesByCountry(countryName));
  };

  const handleSectorChange = (selectedStateName) => {
    console.log("Selected state:", selectedStateName);
    console.log("Tour type:", tourType);
    console.log("Selected country:", selectedCountry);

    formik.setFieldValue("sector", selectedStateName);

    if (tourType === "Domestic") {
      // For domestic tours - India specific
      dispatch(fetchDomesticCities(selectedStateName))
        .unwrap()
        .then((cityList) => {
          console.log("Domestic cities received:", cityList);
          const cities = cityList.map((c) => c.name || c.city || c);
          setAllCities(cities);
          setLocationList(cities);
          setStayLocationList([]);
          setSearchText("");
        })
        .catch((error) => {
          console.error("Failed to fetch domestic cities:", error);
        });
    } else {
      // For international tours
      dispatch(fetchInternationalCities({
        countryName: selectedCountry,
        stateName: selectedStateName
      }))
        .unwrap()
        .then((cityList) => {
          console.log("International cities received:", cityList);
          const cities = cityList.map((c) => c.name || c.city || c);
          setAllCities(cities);
          setLocationList(cities);
          setStayLocationList([]);
          setSearchText("");
        })
        .catch((error) => {
          console.error("Failed to fetch international cities:", error);
        });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    if (!value) {
      setLocationList(allCities);
    } else {
      setLocationList(allCities.filter((c) => c.toLowerCase().includes(value)));
    }
  };

  const handleSelectCity = (city) => {
    if (!stayLocationList.find((item) => item.city === city)) {
      setStayLocationList([...stayLocationList, { city, nights: "" }]);
    }
  };

  const handleRemoveCity = (city) => {
    setStayLocationList(stayLocationList.filter((item) => item.city !== city));
  };

  // ===== Add New Option Logic =====
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

      // Update form field
      formik.setFieldValue(backendField, [...formik.values[backendField], newValue]);

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

  return (
    <Box border={1} borderColor="grey.300" borderRadius={2} p={3} boxShadow={2}>
      <Typography variant="h6" fontWeight="bold" gutterBottom mb={3} color="primary">
        Package Entry Form
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Tour Type */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel>Tour Type</FormLabel>
              <RadioGroup
                row
                name="tourType"
                value={tourType}
                onChange={handleTourTypeChange}
              >
                <FormControlLabel value="Domestic" control={<Radio />} label="Domestic" />
                <FormControlLabel value="International" control={<Radio />} label="International" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Domestic Sector */}
          {tourType === "Domestic" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                fullWidth
                options={states.map((state) => state.name)}
                value={formik.values.sector || ""}
                onChange={(e, newValue) => {
                  formik.setFieldValue("sector", newValue || "");
                  if (newValue) handleSectorChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sector (State)"
                    error={formik.touched.sector && Boolean(formik.errors.sector)}
                    helperText={formik.touched.sector && formik.errors.sector}
                  />
                )}
              />
            </Grid>
          )}

          {/* International */}
          {tourType === "International" && (
            <>
              {/* Destination Country */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Autocomplete
                  fullWidth
                  options={countries.map((c) => c.name)}
                  value={formik.values.destinationCountry || ""}
                  onChange={(e, newValue) => {
                    formik.setFieldValue("destinationCountry", newValue || "");
                    if (newValue) {
                      handleCountryChange(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destination Country"
                      error={formik.touched.destinationCountry && Boolean(formik.errors.destinationCountry)}
                      helperText={formik.touched.destinationCountry && formik.errors.destinationCountry}
                    />
                  )}
                />
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Autocomplete
                  fullWidth
                  options={states.map((s) => s.name)}
                  value={formik.values.sector || ""}
                  onChange={(e, newValue) => {
                    formik.setFieldValue("sector", newValue || "");
                    if (newValue) {
                      handleSectorChange(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      error={formik.touched.sector && Boolean(formik.errors.sector)}
                      helperText={formik.touched.sector && formik.errors.sector}
                    />
                  )}
                />
              </Grid>
            </>
          )}

          {/* Package Sub Type */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Autocomplete
              multiple
              fullWidth
              options={getOptionsForField("packageSubType").map((opt) => opt.value)}
              value={formik.values.packageSubType || []}
              onChange={(e, newValue) => {
                if (newValue.includes("__add_new")) {
                  const filtered = newValue.filter((v) => v !== "__add_new");
                  formik.setFieldValue("packageSubType", filtered);
                  handleOpenDialog("packageSubType");
                } else {
                  formik.setFieldValue("packageSubType", newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Package Sub Type"
                  error={formik.touched.packageSubType && Boolean(formik.errors.packageSubType)}
                  helperText={formik.touched.packageSubType && formik.errors.packageSubType}
                />
              )}
              renderOption={(props, option) => {
                if (option === "__add_new") {
                  return (
                    <li {...props} key="add_new" style={{ color: "#1976d2", fontWeight: 500 }}>
                      + Add New
                    </li>
                  );
                }

                const optData = options.find(
                  (o) => o.fieldName === "packageSubType" && o.value === option
                );

                return (
                  <li
                    {...props}
                    key={option}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{option}</span>
                    {optData && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${option}"?`)) {
                            dispatch(deleteLeadOption(optData._id));
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </li>
                );
              }}
            />
          </Grid>

          {/* Location List + Stay Locations */}
          <Grid size={{ xs: 12 }} mt={2}>
            <Grid container spacing={2}>
              {/* Available Locations */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }} color="primary">
                  <LocationOnIcon sx={{ mr: 1, color: "red" }} />
                  Available Locations
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search city..."
                  value={searchText}
                  onChange={handleSearch}
                  sx={{ mt: 1 }}
                />
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    height: BOX_HEIGHT,
                    overflowY: "auto",
                    mt: 1,
                    p: 1,
                    borderRadius: 2,
                    background: "#fafafa",
                  }}
                >
                  {locationList.length > 0 ? (
                    locationList.map((city, i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 1,
                          mb: 1,
                          borderRadius: 1,
                          background: "#f5f5f5",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          "&:hover": { background: "#e0f7fa" },
                        }}
                        onClick={() => handleSelectCity(city)}
                      >
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "grey.600" }} />
                        {city}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                      {formik.values.sector ? "No cities found" : "Select a state to see cities"}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Stay Locations */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
                  color="primary"
                >
                  <HomeWorkIcon sx={{ mr: 1, color: "#1976d2" }} />
                  Stay Locations
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    height: 270,
                    overflowY: "auto",
                    mt: 1,
                    p: 1,
                    borderRadius: 2,
                    background: "#f0f8ff",
                  }}
                >
                  {stayLocationList.length > 0 ? (
                    stayLocationList.map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          p: 1,
                          mb: 1,
                          borderRadius: 1,
                          background: "#e3f2fd",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <HomeWorkIcon fontSize="small" sx={{ mr: 1, color: "#1976d2" }} />
                            {item.city}
                          </Box>

                          <Box>
                            <IconButton
                              size="small"
                              disabled={i === 0}
                              onClick={() => {
                                if (i === 0) return;
                                const newList = [...stayLocationList];
                                const [moved] = newList.splice(i, 1);
                                newList.splice(i - 1, 0, moved);
                                setStayLocationList(newList);
                              }}
                            >
                              ⬆️
                            </IconButton>

                            <IconButton
                              size="small"
                              disabled={i === stayLocationList.length - 1}
                              onClick={() => {
                                if (i === stayLocationList.length - 1) return;
                                const newList = [...stayLocationList];
                                const [moved] = newList.splice(i, 1);
                                newList.splice(i + 1, 0, moved);
                                setStayLocationList(newList);
                              }}
                            >
                              ⬇️
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveCity(item.city)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <TextField
                          type="number"
                          size="small"
                          label="Number of Nights"
                          value={item.nights}
                          onChange={(e) => {
                            const newList = [...stayLocationList];
                            newList[i].nights = e.target.value;
                            setStayLocationList(newList);
                          }}
                          sx={{ mt: 1, width: "50%" }}
                          inputProps={{ min: 1 }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                      No stay locations selected
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }} textAlign="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#4db9f3", px: 4 }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Add New Dialog */}
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
    </Box>
  );
};

export default PackageEntryForm;