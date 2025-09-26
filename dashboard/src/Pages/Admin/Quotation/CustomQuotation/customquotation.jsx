import React from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

const clients = ["Client A", "Client B", "Client C"];

const domesticSectors = ["Delhi", "Mumbai", "Bangalore", "Kolkata"];
const internationalSectors = ["USA", "UK", "France", "Australia"];

const CustomQuotation = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      clientName: "",
      tourType: "Domestic",
      sector: "",
    },
    validationSchema: Yup.object({
      clientName: Yup.string().required("Client Name is required"),
      sector: Yup.string().required("Sector is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  // Dynamic options for sector
  const sectors =
    formik.values.tourType === "Domestic"
      ? domesticSectors
      : internationalSectors;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        width: "100vw",
        maxWidth: 800,
        position: "relative",
        margin: "auto",
        justifyContent: "center",
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon color="primary" />
      </IconButton>

      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Custom Quotation
      </Typography>

      {/* Section Title */}
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ borderBottom: "1px solid #ddd", mb: 2 }}
      >
        Client Details
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Tour Type */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Tour Type
            </Typography>
            <RadioGroup
              row
              name="tourType"
              value={formik.values.tourType}
              onChange={(e) => {
                formik.handleChange(e);
                // reset sector when tour type changes
                formik.setFieldValue("sector", "");
              }}
            >
              <FormControlLabel
                value="Domestic"
                control={<Radio />}
                label="Domestic"
              />
              <FormControlLabel
                value="International"
                control={<Radio />}
                label="International"
              />
            </RadioGroup>
          </Grid>

          {/* Client Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="Client Name"
              name="clientName"
              value={formik.values.clientName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.clientName && Boolean(formik.errors.clientName)
              }
              helperText={formik.touched.clientName && formik.errors.clientName}
            >
              {clients.map((client) => (
                <MenuItem key={client} value={client}>
                  {client}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Sector */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="Sector"
              name="sector"
              value={formik.values.sector}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sector && Boolean(formik.errors.sector)}
              helperText={formik.touched.sector && formik.errors.sector}
            >
              {sectors.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Save Button */}
          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CustomQuotation;
