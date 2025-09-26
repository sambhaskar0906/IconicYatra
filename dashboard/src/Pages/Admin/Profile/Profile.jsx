import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    IconButton,
    Divider,
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile, createAdmin } from "../../../features/user/userSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading, error, adminCreation } = useSelector((state) => state.profile);

    const [activeTab, setActiveTab] = useState("profile");
    const [editingName, setEditingName] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    // Admin/User creation form fields
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminMobile, setAdminMobile] = useState("");
    const [adminCountry, setAdminCountry] = useState("");
    const [adminState, setAdminState] = useState("");
    const [adminCity, setAdminCity] = useState("");
    const [adminAddress, setAdminAddress] = useState("");
    const [adminRole, setAdminRole] = useState("");
    const [adminProfileImg, setAdminProfileImg] = useState(null);

    useEffect(() => {
        if (user?.userId) {
            setName(user.fullName || "");
            setAddress(user.address || "");
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            const userId = localStorage.getItem("userId");
            if (userId) dispatch(fetchProfile(userId));
        }
    }, [dispatch, user]);

    const hoverStyle = {
        "&:hover": { bgcolor: "#f0f0f0", cursor: "pointer" },
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) setLogoFile(file);
    };

    const handleNameSave = () => {
        const formData = new FormData();
        formData.append("fullName", name);
        if (logoFile) formData.append("profileImg", logoFile);

        dispatch(updateProfile({ userId: user.userId, formData }));
        setEditingName(false);
    };

    const handleAddressSave = () => {
        const formData = new FormData();
        formData.append("address", address);

        dispatch(updateProfile({ userId: user.userId, formData }));
        setEditingAddress(false);
    };

    const handleAdminProfileImgChange = (e) => {
        const file = e.target.files[0];
        if (file) setAdminProfileImg(file);
    };

    const handleCreateAdmin = () => {
        const formData = new FormData();
        formData.append("fullName", adminName);
        formData.append("email", adminEmail);
        formData.append("password", adminPassword);
        formData.append("mobileNumber", adminMobile);
        formData.append("country", adminCountry);
        formData.append("state", adminState);
        formData.append("city", adminCity);
        formData.append("address", adminAddress);
        formData.append("userRole", adminRole);
        if (adminProfileImg) formData.append("profileImg", adminProfileImg);

        dispatch(createAdmin(formData));
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box display="flex" height="100vh" bgcolor="#f5f5f5">
            {/* Sidebar */}
            <Paper sx={{ width: 280, p: 2, bgcolor: "white", boxShadow: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar src={user?.profileImg} sx={{ width: 100, height: 100, mb: 1 }} />
                    <input accept="image/*" style={{ display: "none" }} id="upload-logo" type="file" onChange={handleLogoChange} />
                    <label htmlFor="upload-logo">
                        <Button variant="outlined" component="span" size="small">Change Logo</Button>
                    </label>
                    <Typography variant="h6" mt={2}>{user?.fullName}</Typography>
                    <Typography variant="body2" color="gray">{user?.email}</Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem sx={hoverStyle} selected={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem sx={hoverStyle} selected={activeTab === "company"} onClick={() => setActiveTab("company")}>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText primary="Company" />
                    </ListItem>
                    <ListItem sx={hoverStyle} selected={activeTab === "address"} onClick={() => setActiveTab("address")}>
                        <ListItemIcon><LocationOnIcon /></ListItemIcon>
                        <ListItemText primary="Address" />
                    </ListItem>
                    {user?.userRole === "Admin" && (
                        <ListItem sx={hoverStyle} selected={activeTab === "admin"} onClick={() => setActiveTab("admin")}>
                            <ListItemIcon><AddIcon /></ListItemIcon>
                            <ListItemText primary="Create Admin" />
                        </ListItem>
                    )}
                </List>
            </Paper>

            {/* Right Content */}
            <Box flex={1} p={4} overflow="auto">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>Profile Details</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">User Details</Typography>
                            <IconButton onClick={() => setEditingName(!editingName)}>
                                <EditIcon color="primary" />
                            </IconButton>
                        </Box>
                        {editingName ? (
                            <>
                                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ mt: 2 }} />
                                <Button startIcon={<SaveIcon />} sx={{ mt: 2 }} onClick={handleNameSave}>Save</Button>
                            </>
                        ) : (
                            <>
                                <Typography><b>Name:</b> {user?.fullName}</Typography>
                                <Typography><b>Email:</b> {user?.email}</Typography>
                                <Typography><b>Role:</b> {user?.userRole}</Typography>
                            </>
                        )}
                    </Paper>
                )}

                {/* Company Tab */}
                {activeTab === "company" && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>Company Information</Typography>
                        <Typography><b>Company Name:</b> Awesome Corp</Typography>
                        <Typography><b>Industry:</b> Tech</Typography>
                        <Typography><b>Email:</b> contact@awesome.com</Typography>
                    </Paper>
                )}

                {/* Address Tab */}
                {activeTab === "address" && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>Address Details</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Address</Typography>
                            <IconButton onClick={() => setEditingAddress(!editingAddress)}>
                                <EditIcon color="primary" />
                            </IconButton>
                        </Box>
                        {editingAddress ? (
                            <>
                                <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth multiline rows={3} sx={{ mt: 2 }} />
                                <Button startIcon={<SaveIcon />} sx={{ mt: 2 }} onClick={handleAddressSave}>Save</Button>
                            </>
                        ) : (
                            <Typography>{address}</Typography>
                        )}
                    </Paper>
                )}

                {/* Create Admin/User Tab */}
                {activeTab === "admin" && user?.userRole === "Admin" && (
                    <Paper sx={{ p: 3, maxWidth: 600 }}>
                        <Typography variant="h4" gutterBottom>Create User</Typography>

                        <TextField label="Full Name" fullWidth sx={{ mb: 2 }} value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                        <TextField label="Email" fullWidth sx={{ mb: 2 }} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                        <TextField label="Mobile Number" fullWidth sx={{ mb: 2 }} value={adminMobile} onChange={(e) => setAdminMobile(e.target.value)} />
                        <TextField label="Country" fullWidth sx={{ mb: 2 }} value={adminCountry} onChange={(e) => setAdminCountry(e.target.value)} />
                        <TextField label="State" fullWidth sx={{ mb: 2 }} value={adminState} onChange={(e) => setAdminState(e.target.value)} />
                        <TextField label="City" fullWidth sx={{ mb: 2 }} value={adminCity} onChange={(e) => setAdminCity(e.target.value)} />
                        <TextField label="Address" fullWidth multiline rows={2} sx={{ mb: 2 }} value={adminAddress} onChange={(e) => setAdminAddress(e.target.value)} />

                        {/* Role Selection */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Role</InputLabel>
                            <Select value={adminRole} onChange={(e) => setAdminRole(e.target.value)} label="Role">
                                <MenuItem value="Superadmin">Superadmin</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Executive">Executive</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Profile Image Upload */}
                        <Box sx={{ mb: 2 }}>
                            <input accept="image/*" style={{ display: "none" }} id="upload-admin-logo" type="file" onChange={handleAdminProfileImgChange} />
                            <label htmlFor="upload-admin-logo">
                                <Button variant="outlined" component="span" size="small">Upload Profile Image</Button>
                            </label>
                            {adminProfileImg && <Typography mt={1}>{adminProfileImg.name}</Typography>}
                        </Box>

                        <Button variant="contained" onClick={handleCreateAdmin} disabled={adminCreation?.loading}>
                            {adminCreation?.loading ? "Creating..." : "Create User"}
                        </Button>

                        {adminCreation?.error && <Typography color="error" mt={2}>{adminCreation.error}</Typography>}
                        {adminCreation?.success && <Typography color="green" mt={2}>User created successfully!</Typography>}
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default Profile;
