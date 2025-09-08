import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import slipRouter from "./src/routers/slip.router.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Routes
import cityRoutes from "./src/routers/city.router.js";
app.use("/api/v1/cities", cityRoutes);

import leadRouter from "./src/routers/lead.router.js"
app.use('/api/v1/lead', leadRouter);
import staffRouter from "./src/routers/staff.router.js"
app.use('/api/v1/staff', staffRouter);

import associateRouter from "./src/routers/associate.router.js"
app.use('/api/v1/associate', associateRouter);

import calcualteAccommodationRouter from "./src/routers/calculateAccommodation.router.js"
app.use('/api/v1/accommodation', calcualteAccommodationRouter);

import statesAndCitiesRouter from "./src/routers/stateAndCity.router.js";
app.use("/api/v1/state", statesAndCitiesRouter);
import locationRouter from "./src/routers/location.router.js";
app.use("/api/v1/location", locationRouter);
import allCountryStatesAndCity from "./src/routers/allCountryStatesAndCity.router.js";
app.use("/api/v1/countryStateAndCity", allCountryStatesAndCity);
import packageRoutes from './src/routers/package.routes.js'
app.use("/api/v1/packages", packageRoutes)
import dayRoutes from "./src/routers/day.routes.js";
app.use("api/v1/days", dayRoutes)
// ✅ Fix: Load JSON without import
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger-output.json", "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// email send slip
app.use('/api/v1/slip', slipRouter);

// hotel route
import hotelRoutes from "./src/routers/hotel.router.js";
app.use("/api/v1", hotelRoutes);

export { app };
