import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages, deletePackage } from "../../../features/package/packageSlice";

const PackageDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { items: packageList = [], loading, error } = useSelector((state) => state.packages);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleAddClick = () => navigate("/packageform");
  const handleEditClick = (row) => navigate(`/tourpackage/packageeditform/${row._id}`);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deletePackage(deleteId));
    setOpenDeleteDialog(false);
  };

  const columns = [
    { field: "srNo", headerName: "Sr No.", width: 60 },
    { field: "packageId", headerName: "Package Id", flex: 1, minWidth: 150 },
    { field: "sector", headerName: "Sector", width: 120 },
    { field: "title", headerName: "Title", flex: 2, minWidth: 180 },
    { field: "noOfNight", headerName: "No of Night", width: 120 },
    { field: "tourType", headerName: "Tour Type", width: 120 },
    { field: "packageType", headerName: "Package Type", width: 140 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: params.value === "active" ? "green" : "red",
            textTransform: "capitalize",
            mt: 1
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];


  const filteredData = useMemo(
    () =>
      packageList.filter((pkg) => {
        const matchesStatus = statusFilter === "" || pkg.status?.toLowerCase() === statusFilter;
        const matchesSearch =
          pkg.tourType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.sector?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [statusFilter, searchQuery, packageList]
  );

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Action bar */}
        <Box mt={3} mb={2} display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2}>
          <Button variant="contained" color="warning" sx={{ minWidth: 100 }} onClick={handleAddClick}>
            Add
          </Button>

          <Box display="flex" justifyContent="flex-end" gap={2} width="100%" flexDirection={{ xs: "column", sm: "row" }}>
            <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 120 }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="deactive">Deactive</MenuItem>
            </TextField>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: "100%", sm: 200 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: "600px" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <DataGrid
                rows={filteredData.map((pkg, index) => ({
                  ...pkg,
                  id: pkg._id || `pkg-${index}`,
                  srNo: index + 1,
                  noOfNight: pkg.stayLocations?.reduce((sum, loc) => sum + loc.nights, 0) || 0,
                  packageType: pkg.packageSubType || "-",
                }))}
                columns={columns}
                pageSize={7}
                rowsPerPageOptions={[7, 25, 50, 100]}
                autoHeight
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
              />

            )}
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { padding: 3, borderRadius: 3 } }}>
          <Box textAlign="center">
            <DeleteIcon sx={{ fontSize: 60, color: "red" }} />
            <Box mt={2} fontWeight="bold">
              Are you sure you want to delete this package?
            </Box>
            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button variant="contained" color="error" onClick={confirmDelete}>
                Delete
              </Button>
              <Button variant="outlined" onClick={() => setOpenDeleteDialog(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PackageDashboard;
