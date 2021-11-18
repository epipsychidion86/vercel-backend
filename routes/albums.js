import { createAlbum } from "../controllers/albumsController.js";

import express from "express";

const router = express.Router();

router.post("/", createAlbum);

export default router;
