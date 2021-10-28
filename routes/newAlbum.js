import { getAlbumPost, getAlbumDelete } from "../controllers/newAlbumController.js";

import express from "express";
import { db } from "../index.js";

const router = express.Router();

router.post("/", getAlbumPost);

router.delete("/", getAlbumDelete);

// This doesn't exist in our project, but is a good example of using a router, to handle more than one *related* endpoint
router.get("/", (req, res, next) => {
    // Some functionality...
})

export default router;