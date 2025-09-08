import express from "express";
import indianCities from "indian-cities-database";

const router = express.Router();
const cities = indianCities.cities;

// ✅ Get all cities
router.get("/", (req, res) => {
    res.json(cities);
});

// ✅ Search by city name
router.get("/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const result = cities.filter(city =>
        city.city.toLowerCase().includes(name)
    );
    res.json(result);
});

export default router;
