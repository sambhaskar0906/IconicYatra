// src/components/Form/TourDetailsForm.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Grid,
    TextField,
    Typography,
    Button,
    Paper,
    IconButton,
    Autocomplete,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { updatePackageTourDetails, fetchPackages } from "../../../../features/package/packageSlice";
import {
    fetchCitiesByState,
    clearCities,
    fetchDomesticCities,
    fetchInternationalCities,
    fetchCountries,
    fetchStatesByCountry
} from "../../../../features/location/locationSlice";
import { getLeadOptions, addLeadOption, deleteLeadOption } from "../../../../features/leads/leadSlice";
import { useNavigate } from "react-router-dom";
import axios from "../../../../utils/axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { filterHotelsByCity } from "../../../../features/hotel/hotelSlice";

const TourDetailsForm = ({ onNext, initialData, packageId, packageData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cities, countries, states, loading } = useSelector((state) => state.location);
    const { filteredHotels, loading: hotelsLoading } = useSelector((state) => state.hotel);
    const { options } = useSelector((state) => state.leads);
    const [hotelOptions, setHotelOptions] = useState({});
    const [allIndianCities, setAllIndianCities] = useState([]);

    // Search states
    const [arrivalSearch, setArrivalSearch] = useState("");
    const [departureSearch, setDepartureSearch] = useState("");
    const [filteredArrivalCities, setFilteredArrivalCities] = useState([]);
    const [filteredDepartureCities, setFilteredDepartureCities] = useState([]);
    const [policyInputs, setPolicyInputs] = useState({
        inclusionPolicy: initialData?.policy?.inclusionPolicy?.join('\n') || "",
        exclusionPolicy: initialData?.policy?.exclusionPolicy?.join('\n') || "",
        paymentPolicy: initialData?.policy?.paymentPolicy?.join('\n') || "",
        cancellationPolicy: initialData?.policy?.cancellationPolicy?.join('\n') || "",
        termsAndConditions: initialData?.policy?.termsAndConditions?.join('\n') || ""
    });

    // Add New Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [addMore, setAddMore] = useState("");
    const [currentHotelCategory, setCurrentHotelCategory] = useState("");

    // PackageEntryForm se aaye data ko extract karo
    const tourType = packageData?.tourType || "Domestic";
    const selectedCountry = packageData?.destinationCountry || "India";
    const selectedState = packageData?.sector || "";

    const [tourDetails, setTourDetails] = useState({
        arrivalCity: initialData?.arrivalCity || "",
        departureCity: initialData?.departureCity || "",
        title: initialData?.title || "",
        notes: initialData?.notes || "This is only tentative schedule for sightseeing and travel. Actual sightseeing may get affected due to weather, road conditions, local authority notices, shortage of timing, or off days.",
        bannerImage: initialData?.bannerImage || null,
        validFrom: initialData?.validFrom || null,
        validTill: initialData?.validTill || null,
        days:
            initialData?.days && initialData.days.length > 0
                ? initialData.days.map((d) => ({
                    title: d.title || "",
                    notes: d.notes || "",
                    aboutCity: d.aboutCity || "",
                    dayImage: d.dayImage || null,
                    sightseeing: d.sightseeing || [],
                    selectedSightseeing: d.selectedSightseeing || [],
                }))
                : [
                    {
                        title: "",
                        notes: "",
                        aboutCity: "",
                        dayImage: null,
                        sightseeing: [],
                        selectedSightseeing: [],
                    },
                ],
        perPerson: initialData?.perPerson || 1,
        mealPlan: {
            planType: initialData?.mealPlan?.planType || "",
            description: initialData?.mealPlan?.description || "",
        },
        destinationNights: (initialData?.destinationNights?.length > 0
            ? initialData.destinationNights
            : (packageData?.stayLocations || []).map((s) => ({
                destination: s.city || "",
                nights: s.nights || 0,
                hotels: [
                    { category: "standard", hotelName: "TBD", pricePerPerson: 0 },
                    { category: "deluxe", hotelName: "TBD", pricePerPerson: 0 },
                    { category: "superior", hotelName: "TBD", pricePerPerson: 0 },
                ],
            }))
        ).map(dest => ({
            ...dest,
            hotels: [
                {
                    category: "standard",
                    hotelName: dest.hotels[0]?.hotelName || "TBD",
                    pricePerPerson: dest.hotels[0]?.pricePerPerson || 0,
                },
                {
                    category: "deluxe",
                    hotelName: dest.hotels[1]?.hotelName || "TBD",
                    pricePerPerson: dest.hotels[1]?.pricePerPerson || 0,
                },
                {
                    category: "superior",
                    hotelName: dest.hotels[2]?.hotelName || "TBD",
                    pricePerPerson: dest.hotels[2]?.pricePerPerson || 0,
                },
            ]
        })),
        policy: initialData?.policy || {
            inclusionPolicy: [],
            exclusionPolicy: [],
            paymentPolicy: [],
            cancellationPolicy: [],
            termsAndConditions: []
        }
    });


    const selectedCities = useMemo(() => {
        return packageData?.stayLocations?.map(location => location.city) || [];
    }, [packageData]);

    useEffect(() => {
        if (selectedCities.length > 0) {
            const firstCity = selectedCities[0];
            if (firstCity) {
                console.log(`Filtering hotels for city: ${firstCity}`);
                dispatch(filterHotelsByCity(firstCity));
            }
        }
    }, [selectedCities, dispatch]);

    // Filtered hotels change pe debug karein
    useEffect(() => {
        console.log("Filtered hotels updated:", filteredHotels);
    }, [filteredHotels]);

    const organizedHotelOptions = useMemo(() => {
        const options = {
            standard: [],
            deluxe: [],
            superior: []
        };

        filteredHotels.forEach(hotel => {
            const category = hotel.category?.toLowerCase() || 'standard';

            if (options[category]) {
                options[category].push(hotel.hotelName);
            } else {
                options.standard.push(hotel.hotelName);
            }
        });

        return options;
    }, [filteredHotels]);

    const getHotelsForDestination = (destinationCity) => {
        if (!destinationCity) return { standard: [], deluxe: [], superior: [] };

        // Case-insensitive search for destination city
        const destinationHotels = filteredHotels.filter(hotel => {
            const hotelCity = hotel.location?.city?.toLowerCase() || '';
            const hotelName = hotel.hotelName?.toLowerCase() || '';
            const searchCity = destinationCity.toLowerCase();

            return hotelCity.includes(searchCity) ||
                hotelName.includes(searchCity) ||
                hotelCity === searchCity;
        });

        console.log(`Hotels for ${destinationCity}:`, destinationHotels); // Debugging ke liye

        const organized = {
            standard: [],
            deluxe: [],
            superior: []
        };

        destinationHotels.forEach(hotel => {
            const category = (hotel.category?.toLowerCase() || 'standard');
            const hotelName = hotel.hotelName?.trim();

            if (hotelName && organized[category] && !organized[category].includes(hotelName)) {
                organized[category].push(hotelName);
            }
        });

        return organized;
    };

    // ===== Add New Option Logic =====
    const getOptionsForField = (fieldName) => {
        const filteredOptions = options
            ?.filter((opt) => opt.fieldName === fieldName)
            .map((opt) => ({ value: opt.value, label: opt.value }));

        return [
            ...(filteredOptions || []),
            { value: "__add_new", label: "+ Add New" },
        ];
    };

    const getHotelOptionsForCategory = (category, destinationCity = "") => {
        const destinationHotels = getHotelsForDestination(destinationCity);
        const baseOptions = destinationHotels[category] || [];

        const customOptions = options
            ?.filter(opt => opt.fieldName === `hotel_${category}`)
            .map(opt => opt.value) || [];

        const allOptions = [...new Set([...baseOptions, ...customOptions])];

        return [
            ...allOptions,
            { value: "__add_new", label: "+ Add New" },
        ];
    };

    const handleOpenDialog = (field, category = "") => {
        setCurrentField(field);
        setCurrentHotelCategory(category);
        setAddMore("");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentHotelCategory("");
        sessionStorage.removeItem('currentDestIndex');
    };

    const handleAddNewItem = async () => {
        if (!addMore.trim()) return;

        try {
            const newValue = addMore.trim();
            let backendField = currentField;

            // Special handling for hotel categories
            if (currentHotelCategory) {
                backendField = `hotel_${currentHotelCategory}`;
            }

            await dispatch(addLeadOption({ fieldName: backendField, value: newValue })).unwrap();

            // Fetch updated lead options from backend
            await dispatch(getLeadOptions()).unwrap();

            // Automatically select the newly added item
            if (currentField === "arrivalCity") {
                setTourDetails({ ...tourDetails, arrivalCity: newValue });
            } else if (currentField === "departureCity") {
                setTourDetails({ ...tourDetails, departureCity: newValue });
            } else if (currentHotelCategory && tourDetails.destinationNights.length > 0) {
                // For hotel categories, automatically update the form state
                const updatedNights = [...tourDetails.destinationNights];

                // Update all destination nights with the new hotel option
                updatedNights.forEach((dest, destIndex) => {
                    const catIndex = ["standard", "deluxe", "superior"].indexOf(currentHotelCategory);
                    if (catIndex !== -1) {
                        if (!dest.hotels) dest.hotels = [];
                        dest.hotels[catIndex] = {
                            ...dest.hotels[catIndex],
                            category: currentHotelCategory,
                            hotelName: newValue,
                        };
                    }
                });

                setTourDetails({ ...tourDetails, destinationNights: updatedNights });
            }

            handleCloseDialog();
        } catch (error) {
            console.error("Failed to add new option", error);
        }
    };

    // Pure India ki saari cities fetch karne ka function
    const fetchAllIndianCities = async () => {
        try {
            console.log("Fetching all Indian states...");

            // Pehle saari states fetch karo
            await dispatch(fetchStatesByCountry("India")).unwrap();

            // Har state ki cities fetch karo aur combine karo
            const allStates = states.length > 0 ? states : await getIndianStates();
            console.log("Indian states:", allStates);

            const allCities = [];

            // Har state ke liye cities fetch karo
            for (const state of allStates) {
                try {
                    const stateName = state.name || state;
                    console.log(`Fetching cities for state: ${stateName}`);

                    const citiesData = await dispatch(fetchDomesticCities(stateName)).unwrap();
                    const stateCities = citiesData.map(city =>
                        typeof city === 'string' ? city : city.city || city.name || city
                    ).filter(Boolean);

                    allCities.push(...stateCities);
                    console.log(`Found ${stateCities.length} cities in ${stateName}`);

                } catch (error) {
                    console.warn(`Failed to fetch cities for state ${state.name}:`, error);
                }
            }

            console.log("Total Indian cities fetched:", allCities.length);
            setAllIndianCities(allCities);

        } catch (error) {
            console.error("Failed to fetch all Indian cities:", error);
        }
    };

    // Agar states empty hain toh manually fetch karo
    const getIndianStates = async () => {
        try {
            const { data } = await axios.get(`countryStateAndCity/states/India`);
            return data.states || [];
        } catch (error) {
            console.error("Failed to fetch Indian states:", error);
            return [];
        }
    };

    // ✅ Available cities filter - Domestic mein pure India ki cities, International mein selected country ki cities
    const getAvailableCities = () => {
        if (tourType === "Domestic") {
            return allIndianCities;
        } else {
            if (!cities || cities.length === 0) return [];
            return cities.map(city =>
                typeof city === 'string' ? city : city.city || city.name || city
            ).filter(Boolean);
        }
    };

    // Optimized smart search function with Add New option
    const smartSearch = useMemo(() => {
        return (searchTerm, citiesList, fieldName) => {
            const input = searchTerm.toLowerCase().trim();
            const hasSearch = input.length > 0;

            // Get custom added cities for this field
            const customCities = options
                ?.filter(opt => opt.fieldName === fieldName)
                .map(opt => opt.value) || [];

            // Combine API cities and custom cities
            const allAvailableCities = [...new Set([...citiesList, ...customCities])];

            if (!hasSearch) {
                // When no search, show limited cities + Add New at top
                const limitedCities = allAvailableCities.slice(0, 30);
                return ["__add_new", ...limitedCities];
            }

            const results = [];
            const startsWith = [];
            const wordStartsWith = [];
            const contains = [];

            allAvailableCities.forEach(city => {
                const cityName = city.toLowerCase();

                if (cityName === input) {
                    results.unshift(city); // Exact match at very top
                } else if (cityName.startsWith(input)) {
                    startsWith.push(city);
                } else if (cityName.split(' ').some(word => word.startsWith(input))) {
                    wordStartsWith.push(city);
                } else if (cityName.includes(input)) {
                    contains.push(city);
                }
            });

            // Sort each category alphabetically
            startsWith.sort((a, b) => a.localeCompare(b));
            wordStartsWith.sort((a, b) => a.localeCompare(b));
            contains.sort((a, b) => a.localeCompare(b));

            const searchResults = [...results, ...startsWith, ...wordStartsWith, ...contains];

            // Add New option at the top if no exact matches found
            if (results.length === 0 && startsWith.length === 0) {
                return ["__add_new", ...searchResults.slice(0, 50)];
            }

            return [...searchResults.slice(0, 50)];
        };
    }, [options]);

    // Search effects
    useEffect(() => {
        const availableCities = getAvailableCities();
        const arrivalFiltered = smartSearch(arrivalSearch, availableCities, "arrivalCity");
        setFilteredArrivalCities(arrivalFiltered);
    }, [arrivalSearch, allIndianCities, tourType, smartSearch]);

    useEffect(() => {
        const availableCities = getAvailableCities();
        const departureFiltered = smartSearch(departureSearch, availableCities, "departureCity");
        setFilteredDepartureCities(departureFiltered);
    }, [departureSearch, allIndianCities, tourType, smartSearch]);

    useEffect(() => {
        dispatch(getLeadOptions());
        dispatch(clearCities());

        if (tourType === "Domestic") {
            console.log("Fetching all Indian cities for domestic tour...");
            fetchAllIndianCities();
        } else {
            if (selectedCountry) {
                console.log("Fetching cities for international country:", selectedCountry);

                if (selectedState) {
                    dispatch(fetchInternationalCities({
                        countryName: selectedCountry,
                        stateName: selectedState
                    }))
                        .unwrap()
                        .then((cities) => {
                            console.log("International cities fetched:", cities);
                        })
                        .catch((error) => {
                            console.error("Failed to fetch international cities:", error);
                        });
                } else {
                    dispatch(fetchCitiesByState({
                        countryName: selectedCountry,
                        stateName: "all"
                    }))
                        .unwrap()
                        .then((cities) => {
                            console.log("All cities for country fetched:", cities);
                        })
                        .catch((error) => {
                            console.error("Failed to fetch cities for country:", error);
                        });
                }
            }
        }
    }, [dispatch, selectedCountry, selectedState, tourType]);

    // Rest of your handlers remain the same
    const handleDayChange = (index, field, value) => {
        const updatedDays = [...tourDetails.days];
        updatedDays[index][field] = value;
        setTourDetails({ ...tourDetails, days: updatedDays });
    };

    const handleAddDay = () => {
        setTourDetails({
            ...tourDetails,
            days: [
                ...tourDetails.days,
                {
                    title: "",
                    notes: "",
                    aboutCity: "",
                    dayImage: null,
                    sightseeing: [],
                    selectedSightseeing: [],
                },
            ],
        });
    };

    const handleRemoveDay = (index) => {
        setTourDetails({
            ...tourDetails,
            days: tourDetails.days.filter((_, i) => i !== index),
        });
    };

    const handleAddSightseeing = (dayIndex, e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            e.preventDefault();
            const updatedDays = [...tourDetails.days];
            const newSight = e.target.value.trim();

            updatedDays[dayIndex].sightseeing.push(newSight);
            updatedDays[dayIndex].selectedSightseeing.push(newSight);

            setTourDetails({ ...tourDetails, days: updatedDays });
            e.target.value = "";
        }
    };

    const handleSubmit = async () => {
        let textUpdateSuccess = false;

        try {
            const payload = {
                arrivalCity: tourDetails.arrivalCity,
                departureCity: tourDetails.departureCity,
                title: tourDetails.title,
                notes: tourDetails.notes,
                validFrom: tourDetails.validFrom,
                validTill: tourDetails.validTill,
                mealPlan: {
                    planType: tourDetails.mealPlan?.planType || "",
                    description: tourDetails.mealPlan?.description || "",
                },
                days: tourDetails.days.map((day) => ({
                    title: day.title,
                    notes: day.notes,
                    aboutCity: day.aboutCity,
                    sightseeing: day.sightseeing,
                    selectedSightseeing: day.selectedSightseeing || [],
                    dayImage: typeof day.dayImage === "string" ? day.dayImage : "",
                })),
                destinationNights: tourDetails.destinationNights.map(dest => ({
                    destination: dest.destination || "",
                    nights: dest.nights || 0,
                    hotels: [
                        dest.hotels[0] || { category: "standard", hotelName: "", pricePerPerson: 0 },
                        dest.hotels[1] || { category: "deluxe", hotelName: "", pricePerPerson: 0 },
                        dest.hotels[2] || { category: "superior", hotelName: "", pricePerPerson: 0 },
                    ]
                })),
                perPerson: tourDetails.perPerson || 1,
                policy: {
                    inclusionPolicy: policyInputs.inclusionPolicy.split('\n').filter(item => item.trim()),
                    exclusionPolicy: policyInputs.exclusionPolicy.split('\n').filter(item => item.trim()),
                    paymentPolicy: policyInputs.paymentPolicy.split('\n').filter(item => item.trim()),
                    cancellationPolicy: policyInputs.cancellationPolicy.split('\n').filter(item => item.trim()),
                    termsAndConditions: policyInputs.termsAndConditions.split('\n').filter(item => item.trim()),
                }
            };

            await dispatch(updatePackageTourDetails({ id: packageId, data: payload })).unwrap();
            await dispatch(fetchPackages()).unwrap();

            textUpdateSuccess = true;
        } catch (err) {
            console.error("❌ Failed to update textual details:", err.response?.data || err.message);
            alert("❌ Failed to save textual tour details");
        }

        if (tourDetails.bannerImage instanceof File) {
            try {
                const formData = new FormData();
                formData.append("banner", tourDetails.bannerImage);
                await axios.post(`/packages/${packageId}/banner`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch (err) {
                console.warn("⚠️ Banner upload failed:", err.response?.data || err.message);
            }
        }

        for (let i = 0; i < tourDetails.days.length; i++) {
            const day = tourDetails.days[i];
            if (day.dayImage instanceof File) {
                try {
                    const formData = new FormData();
                    formData.append("dayImage", day.dayImage);
                    await axios.post(`/packages/${packageId}/days/${i}/image`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                } catch (err) {
                    console.warn(`⚠️ Day ${i + 1} image upload failed:`, err.response?.data || err.message);
                }
            }
        }

        if (textUpdateSuccess) {
            alert("✅ Tour details saved!");
            navigate("/tourpackage");
        }
    };

    const handleHotelChange = (destIndex, category, hotelName) => {
        if (hotelName === "__add_new") {
            setCurrentHotelCategory(category);
            setCurrentField(`hotel_${category}`);
            setAddMore("");
            setOpenDialog(true);
            sessionStorage.setItem('currentDestIndex', destIndex);
            return;
        }

        const updatedNights = [...tourDetails.destinationNights];
        const catIndex = ["standard", "deluxe", "superior"].indexOf(category);

        if (!updatedNights[destIndex].hotels) {
            updatedNights[destIndex].hotels = [
                { category: "standard", hotelName: "", pricePerPerson: 0 },
                { category: "deluxe", hotelName: "", pricePerPerson: 0 },
                { category: "superior", hotelName: "", pricePerPerson: 0 },
            ];
        }

        updatedNights[destIndex].hotels[catIndex] = {
            ...updatedNights[destIndex].hotels[catIndex],
            category,
            hotelName,
        };

        setTourDetails({ ...tourDetails, destinationNights: updatedNights });
    };

    const handlePriceChange = (destIndex, category, price) => {
        const updatedNights = [...tourDetails.destinationNights];
        const catIndex = ["standard", "deluxe", "superior"].indexOf(category);

        if (!updatedNights[destIndex].hotels) updatedNights[destIndex].hotels = [];

        updatedNights[destIndex].hotels[catIndex] = {
            ...updatedNights[destIndex].hotels[catIndex],
            category,
            pricePerPerson: Number(price),
        };

        setTourDetails({ ...tourDetails, destinationNights: updatedNights });
    };

    // Custom render option for Autocomplete
    const renderOption = (props, option, fieldName) => {
        if (option === "__add_new") {
            return (
                <li {...props} key="add_new" style={{
                    color: "#1976d2",
                    fontWeight: 600,
                    backgroundColor: '#f0f7ff',
                    borderBottom: '2px solid #1976d2'
                }}>
                    + Add New City "{arrivalSearch || departureSearch}"
                </li>
            );
        }

        const optData = options?.find(
            (o) => o.fieldName === fieldName && o.value === option
        );

        return (
            <li
                {...props}
                key={option}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: '8px 12px',
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
    };

    // Custom render option for Hotel Autocomplete
    const renderHotelOption = (props, option, category) => {
        if (option === "__add_new") {
            return (
                <li {...props} key="add_new" style={{
                    color: "#1976d2",
                    fontWeight: 600,
                    backgroundColor: '#f0f7ff',
                    borderBottom: '2px solid #1976d2'
                }}>
                    + Add New {category.charAt(0).toUpperCase() + category.slice(1)} Hotel
                </li>
            );
        }

        const fieldName = `hotel_${category}`;
        const optData = options?.find(
            (o) => o.fieldName === fieldName && o.value === option
        );

        return (
            <li
                {...props}
                key={option}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: '8px 12px',
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
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
                Tour Details - {tourType} ({selectedCountry})
            </Typography>

            <Box sx={{ mb: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">
                    <strong>Tour Type:</strong> {tourType} |
                    <strong> Country:</strong> {selectedCountry} |
                    <strong> State:</strong> {selectedState || "All States"}
                </Typography>
            </Box>

            {/* Basic Info - OPTIMIZED WITH SEARCH & ADD NEW */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        options={filteredArrivalCities}
                        loading={loading}
                        value={tourDetails.arrivalCity || ""}
                        onInputChange={(event, newInputValue) => {
                            setArrivalSearch(newInputValue);
                        }}
                        onChange={(e, newValue) => {
                            if (newValue === "__add_new") {
                                handleOpenDialog("arrivalCity");
                            } else {
                                setTourDetails({ ...tourDetails, arrivalCity: newValue });
                                setArrivalSearch("");
                            }
                        }}
                        filterOptions={(x) => x} // Disable default filter since we're handling it manually
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Arrival City"
                                fullWidth
                                helperText={
                                    tourType === "Domestic"
                                        ? "All Indian cities - Type to search or add new"
                                        : `Cities from ${selectedCountry} - Type to search or add new`
                                }
                            />
                        )}
                        renderOption={(props, option) => renderOption(props, option, "arrivalCity")}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        options={filteredDepartureCities}
                        value={tourDetails.departureCity || null}
                        onInputChange={(event, newInputValue) => {
                            setDepartureSearch(newInputValue);
                        }}
                        onChange={(e, newValue) => {
                            if (newValue === "__add_new") {
                                handleOpenDialog("departureCity");
                            } else {
                                setTourDetails({ ...tourDetails, departureCity: newValue });
                                setDepartureSearch("");
                            }
                        }}
                        filterOptions={(x) => x}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Departure City"
                                fullWidth
                                helperText={
                                    tourType === "Domestic"
                                        ? "All Indian cities - Type to search or add new"
                                        : `Cities from ${selectedCountry} - Type to search or add new`
                                }
                            />
                        )}
                        renderOption={(props, option) => renderOption(props, option, "departureCity")}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth
                        label="Package Title"
                        value={tourDetails.title}
                        onChange={(e) =>
                            setTourDetails({ ...tourDetails, title: e.target.value })
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Initial Notes"
                        value={tourDetails.notes}
                        onChange={(e) =>
                            setTourDetails({ ...tourDetails, notes: e.target.value })
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button variant="contained" component="label">
                        Upload Banner Image
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setTourDetails({
                                    ...tourDetails,
                                    bannerImage: e.target.files[0],
                                })
                            }
                        />
                    </Button>
                    {tourDetails.bannerImage && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {tourDetails.bannerImage.name}
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {/* Validity Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 1 }}>
                Package Validity
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                        label="Valid From"
                        value={tourDetails.validFrom}
                        onChange={(newValue) =>
                            setTourDetails({ ...tourDetails, validFrom: newValue })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                        label="Valid Till"
                        value={tourDetails.validTill}
                        onChange={(newValue) =>
                            setTourDetails({ ...tourDetails, validTill: newValue })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>
            </Grid>

            {/* Days Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                Day Wise Plan
            </Typography>
            {tourDetails.days.map((day, index) => (
                <Paper key={index} sx={{ p: 2, my: 2, border: "1px solid #ccc" }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">Day {index + 1}</Typography>
                        {index > 0 && (
                            <IconButton color="error" onClick={() => handleRemoveDay(index)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Grid container spacing={2} mt={1}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Day Title"
                                value={day.title}
                                onChange={(e) => handleDayChange(index, "title", e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Day Notes"
                                value={day.notes}
                                onChange={(e) => handleDayChange(index, "notes", e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="About City"
                                value={day.aboutCity}
                                onChange={(e) =>
                                    handleDayChange(index, "aboutCity", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button variant="outlined" component="label">
                                Upload Day Image
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleDayChange(index, "dayImage", e.target.files[0])
                                    }
                                />
                            </Button>
                            {day.dayImage && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {day.dayImage.name}
                                </Typography>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                placeholder="Add Sightseeing (press Enter)"
                                onKeyDown={(e) => handleAddSightseeing(index, e)}
                            />
                        </Grid>

                        {/* Selected Sightseeing */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" mb={1}>
                                Selected Sightseeing
                            </Typography>
                            <Box>
                                {day.selectedSightseeing.map((s, i) => (
                                    <Paper
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            p: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <Box display="flex" alignItems="center">
                                            <LocationOnIcon color="error" sx={{ mr: 1 }} />
                                            <Typography>{s}</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                disabled={i === 0}
                                                onClick={() => {
                                                    const newList = [...day.selectedSightseeing];
                                                    const [moved] = newList.splice(i, 1);
                                                    newList.splice(i - 1, 0, moved);
                                                    handleDayChange(index, "selectedSightseeing", newList);
                                                }}
                                            >
                                                ⬆️
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                disabled={i === day.selectedSightseeing.length - 1}
                                                onClick={() => {
                                                    const newList = [...day.selectedSightseeing];
                                                    const [moved] = newList.splice(i, 1);
                                                    newList.splice(i + 1, 0, moved);
                                                    handleDayChange(index, "selectedSightseeing", newList);
                                                }}
                                            >
                                                ⬇️
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    const newList = [...day.selectedSightseeing];
                                                    newList.splice(i, 1);
                                                    handleDayChange(index, "selectedSightseeing", newList);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddDay}>
                + Add Day
            </Button>

            {/* Hotels Section with Add New Functionality */}
            <Grid container sx={{ mt: 5 }} spacing={5}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Per Person"
                        value={tourDetails.perPerson}
                        onChange={(e) =>
                            setTourDetails({ ...tourDetails, perPerson: Number(e.target.value) })
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        label="Meal Plan"
                        value={tourDetails.mealPlan.planType}
                        onChange={(e) =>
                            setTourDetails({
                                ...tourDetails,
                                mealPlan: { ...tourDetails.mealPlan, planType: e.target.value },
                            })
                        }
                        fullWidth
                    >
                        <MenuItem value="AP">AP (All meals)</MenuItem>
                        <MenuItem value="MAP">MAP (Breakfast + Dinner)</MenuItem>
                        <MenuItem value="CP">CP (Breakfast only)</MenuItem>
                        <MenuItem value="EP">EP (Room only)</MenuItem>
                    </TextField>
                </Grid>

               // TourDetailsForm ke hotels table section mein yeh changes karein:

                {/* Hotels Table with City-wise Filtering */}
                {/* Hotels Table with City-wise Filtering */}
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Destination</TableCell>
                            <TableCell>Nights</TableCell>
                            <TableCell>Standard Hotels</TableCell>
                            <TableCell>Deluxe Hotels</TableCell>
                            <TableCell>Superior Hotels</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tourDetails.destinationNights.map((dest, index) => {
                            const destinationCity = dest.destination;

                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {destinationCity}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {getHotelsForDestination(destinationCity).standard.length +
                                                getHotelsForDestination(destinationCity).deluxe.length +
                                                getHotelsForDestination(destinationCity).superior.length} hotels available
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={dest.nights}
                                            fullWidth
                                            size="small"
                                            InputProps={{ readOnly: true }}
                                        />
                                    </TableCell>

                                    {/* Standard Hotel - Destination Specific */}
                                    <TableCell>
                                        <Autocomplete
                                            options={getHotelOptionsForCategory("standard", destinationCity).map(opt =>
                                                typeof opt === 'object' ? opt.value : opt
                                            )}
                                            value={dest.hotels[0]?.hotelName || ""}
                                            onChange={(e, newValue) =>
                                                handleHotelChange(index, "standard", newValue)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    placeholder="Select standard hotel"
                                                    helperText={`${getHotelsForDestination(destinationCity).standard.length} available from API`}
                                                />
                                            )}
                                            renderOption={(props, option) =>
                                                renderHotelOption(props, option, "standard")
                                            }
                                            loading={hotelsLoading}
                                        />
                                    </TableCell>

                                    {/* Deluxe Hotel - Destination Specific */}
                                    <TableCell>
                                        <Autocomplete
                                            options={getHotelOptionsForCategory("deluxe", destinationCity).map(opt =>
                                                typeof opt === 'object' ? opt.value : opt
                                            )}
                                            value={dest.hotels[1]?.hotelName || ""}
                                            onChange={(e, newValue) =>
                                                handleHotelChange(index, "deluxe", newValue)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    placeholder="Select deluxe hotel"
                                                    helperText={`${getHotelsForDestination(destinationCity).deluxe.length} available from API`}
                                                />
                                            )}
                                            renderOption={(props, option) =>
                                                renderHotelOption(props, option, "deluxe")
                                            }
                                            loading={hotelsLoading}
                                        />
                                    </TableCell>

                                    {/* Superior Hotel - Destination Specific */}
                                    <TableCell>
                                        <Autocomplete
                                            options={getHotelOptionsForCategory("superior", destinationCity).map(opt =>
                                                typeof opt === 'object' ? opt.value : opt
                                            )}
                                            value={dest.hotels[2]?.hotelName || ""}
                                            onChange={(e, newValue) =>
                                                handleHotelChange(index, "superior", newValue)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    placeholder="Select superior hotel"
                                                    helperText={`${getHotelsForDestination(destinationCity).superior.length} available from API`}
                                                />
                                            )}
                                            renderOption={(props, option) =>
                                                renderHotelOption(props, option, "superior")
                                            }
                                            loading={hotelsLoading}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Grid>

            <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mt: 4, mb: 3, textAlign: 'center' }}>
                📋 Package Policies
            </Typography>

            <Grid container spacing={3}>
                {[
                    {
                        key: 'inclusionPolicy',
                        label: '✅ Inclusion Policy',
                        helper: 'What is included in the package'
                    },
                    {
                        key: 'exclusionPolicy',
                        label: '❌ Exclusion Policy',
                        helper: 'What is not included in the package'
                    },
                    {
                        key: 'paymentPolicy',
                        label: '💰 Payment Policy',
                        helper: 'Payment terms and conditions'
                    },
                    {
                        key: 'cancellationPolicy',
                        label: '⏰ Cancellation Policy',
                        helper: 'Cancellation rules and refund policy'
                    },
                    {
                        key: 'termsAndConditions',
                        label: '📄 Terms & Conditions',
                        helper: 'General terms and conditions'
                    }
                ].map((policy) => (
                    <Grid size={{ xs: 12 }} key={policy.key}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                {policy.label}
                            </Typography>

                            <Box sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                overflow: 'hidden',
                                '& .ql-toolbar': {
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    borderBottom: '1px solid #ccc',
                                    backgroundColor: '#f8f9fa'
                                },
                                '& .ql-container': {
                                    border: 'none',
                                    minHeight: '200px',
                                    fontSize: '14px',
                                    fontFamily: 'Arial, sans-serif'
                                },
                                '& .ql-editor': {
                                    minHeight: '200px',
                                    fontSize: '14px'
                                }
                            }}>
                                <ReactQuill
                                    value={policyInputs[policy.key]}
                                    onChange={(content) => setPolicyInputs(prev => ({
                                        ...prev,
                                        [policy.key]: content
                                    }))}
                                    modules={{
                                        toolbar: {
                                            container: [
                                                // Font family and size
                                                [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],

                                                // Text formatting
                                                ['bold', 'italic', 'underline', 'strike'],

                                                // Text color and background
                                                [{ 'color': [] }, { 'background': [] }],

                                                // Lists
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],

                                                // Indentation
                                                [{ 'indent': '-1' }, { 'indent': '+1' }],

                                                // Alignment
                                                [{ 'align': [] }],

                                                // Headers
                                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                                                // Script
                                                [{ 'script': 'sub' }, { 'script': 'super' }],

                                                // Blockquote and code
                                                ['blockquote', 'code-block'],

                                                // Links and media
                                                ['link', 'image', 'video'],

                                                // Clean formatting
                                                ['clean']
                                            ]
                                        }
                                    }}
                                    formats={[
                                        'font', 'size',
                                        'bold', 'italic', 'underline', 'strike',
                                        'color', 'background',
                                        'list', 'bullet', 'indent',
                                        'align', 'header',
                                        'script', 'blockquote', 'code-block',
                                        'link', 'image', 'video'
                                    ]}
                                />
                            </Box>

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                💡 {policy.helper} - Use the toolbar above for rich text formatting
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box textAlign="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Tour Details
                </Button>
            </Box>

            {/* Add New Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {currentHotelCategory
                        ? `Add New ${currentHotelCategory.charAt(0).toUpperCase() + currentHotelCategory.slice(1)} Hotel`
                        : `Add New ${currentField}`
                    }
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        label={
                            currentHotelCategory
                                ? `New ${currentHotelCategory} Hotel Name`
                                : `New ${currentField}`
                        }
                        value={addMore}
                        onChange={(e) => setAddMore(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddNewItem();
                            }
                        }}
                        helperText={
                            currentHotelCategory
                                ? `Enter the name of the ${currentHotelCategory} hotel you want to add`
                                : `Enter the name you want to add`
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddNewItem} variant="contained" disabled={!addMore.trim()}>
                        Add {currentHotelCategory ? 'Hotel' : 'Item'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default TourDetailsForm;