import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/Logo/logoiconic.jpg";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCollapse, setOpenCollapse] = useState({});
  const isMobile = useMediaQuery("(max-width:900px)");
  const location = useLocation();

  const OpenMenu = (event, type) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const CloseMenu = () => {
    setAnchorEl(null);
    setMenuType("");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCollapse = (key) => {
    setOpenCollapse((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const dropdownMenus = [
    { label: "Domestic", key: "domestic" },
    { label: "International", key: "international" },
  ];

  const dropdownOptions = {
    domestic: [
      "All",
      "Andaman and Nicobar",
      "Ladakh",
      "Kerala",
      "Goa",
      "Himachal Pradesh",
      "Kashmir",
      "Rajasthan",
      "Uttarakhand",
    ],
    international: [
      "All",
      "Maldives",
      "Europe",
      "Thailand",
      "Singapore",
      "Bali",
      "Dubai",
      "Mauritius",
    ],
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (key) =>
    location.pathname === `/${key}` || location.pathname.startsWith(`/${key}/`);

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar
        position="static"
        color="transparent"
        sx={{ px: 1, boxShadow: "none", borderBottom: "1px solid #eee" }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            >
              <img src={logo} alt="Logo" height="40" />
            </Box>

            {/* Desktop Menu */}
            {!isMobile ? (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {/* Home */}
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: isActive("/") ? "#1f3c65" : "black",
                    borderBottom: isActive("/") ? "3px solid #1f3c65" : "3px solid transparent",
                    pb: "6px",
                  }}
                >
                  Home
                </Button>

                {/* Dropdown Menus */}
                {dropdownMenus.map(({ label, key }) => (
                  <Box
                    key={key}
                    sx={{ position: "relative", display: "inline-block" }}
                    onMouseEnter={(e) => OpenMenu(e, key)}
                    onMouseLeave={CloseMenu}
                  >
                    <Button
                      endIcon={<ArrowDropDownIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        color: isParentActive(key) ? "#1f3c65" : "black",
                        borderBottom: isParentActive(key)
                          ? "3px solid #1f3c65"
                          : "3px solid transparent",
                        pb: "6px",
                      }}
                    >
                      {label}
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuType === key}
                      onClose={CloseMenu}
                      MenuListProps={{
                        onMouseEnter: () => { },
                        onMouseLeave: CloseMenu,
                      }}
                      PaperProps={{
                        sx: { mt: 1, borderRadius: 2, boxShadow: 4, minWidth: 220 },
                      }}
                    >
                      {(dropdownOptions[key] || []).map((item, i) => {
                        const path = `/${key}/${item.toLowerCase().replace(/\s/g, "-")}`;
                        return (
                          <MenuItem
                            key={i}
                            component={Link}
                            to={path}
                            onClick={CloseMenu}
                            sx={{
                              fontWeight: isActive(path) ? 700 : 500,
                              color: isActive(path) ? "#1f3c65" : "black",
                              "&:hover": {
                                background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
                                color: "#1f3c65",
                                fontWeight: 700,
                              },
                            }}
                          >
                            {item}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Box>
                ))}

                {/* Static Links */}
                {["holidays", "yatra", "services", "contact"].map((page) => (
                  <Button
                    key={page}
                    component={Link}
                    to={`/${page}`}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      color: isActive(`/${page}`) ? "#1f3c65" : "black",
                      borderBottom: isActive(`/${page}`)
                        ? "3px solid #1f3c65"
                        : "3px solid transparent",
                      pb: "6px",
                    }}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </Button>
                ))}
              </Box>
            ) : (
              // Mobile Drawer Toggle Button
              <IconButton onClick={toggleDrawer} sx={{ color: "#1f3c65" }}>
                <MenuIcon fontSize="medium" />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 270, p: 2 }}>
          {/* Drawer Header with Logo */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img src={logo} alt="Logo" height="40" />
          </Box>
          <Divider sx={{ mb: 2 }} />

          <List>
            {/* Home */}
            <ListItemButton
              component={Link}
              to="/"
              onClick={toggleDrawer}
              sx={{
                fontWeight: isActive("/") ? 700 : 500,
                borderLeft: isActive("/") ? "4px solid #1f3c65" : "4px solid transparent",
                color: isActive("/") ? "#1f3c65" : "black",
              }}
            >
              <ListItemText primary="Home" />
            </ListItemButton>

            {/* Dropdown (Domestic / International) */}
            {dropdownMenus.map(({ label, key }) => (
              <Box key={key}>
                <ListItemButton onClick={() => handleCollapse(key)}>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: isParentActive(key) ? 700 : 500,
                      color: isParentActive(key) ? "#1f3c65" : "black",
                    }}
                  />
                  {openCollapse[key] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openCollapse[key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {(dropdownOptions[key] || []).map((item, i) => {
                      const path = `/${key}/${item.toLowerCase().replace(/\s/g, "-")}`;
                      return (
                        <ListItemButton
                          key={i}
                          component={Link}
                          to={path}
                          onClick={toggleDrawer}
                          sx={{
                            pl: 4,
                            fontWeight: isActive(path) ? 700 : 400,
                            borderLeft: isActive(path) ? "4px solid #1f3c65" : "4px solid transparent",
                            color: isActive(path) ? "#1f3c65" : "black",
                          }}
                        >
                          <ListItemText primary={item} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            ))}

            <Divider sx={{ my: 1 }} />

            {/* Static Links */}
            {["holidays", "yatra", "services", "contact"].map((page) => (
              <ListItemButton
                key={page}
                component={Link}
                to={`/${page}`}
                onClick={toggleDrawer}
                sx={{
                  fontWeight: isActive(`/${page}`) ? 700 : 500,
                  borderLeft: isActive(`/${page}`)
                    ? "4px solid #1f3c65"
                    : "4px solid transparent",
                  color: isActive(`/${page}`) ? "#1f3c65" : "black",
                }}
              >
                <ListItemText primary={page.charAt(0).toUpperCase() + page.slice(1)} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
