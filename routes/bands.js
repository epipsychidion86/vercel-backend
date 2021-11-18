import { getAllBands } from "../controllers/bandsController.js";

import express from "express";

const router = express.Router();

router.get("/", getAllBands);

export default router;
