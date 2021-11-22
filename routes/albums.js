import { createAlbum, deleteAllAlbums, deleteAlbum } from "../controllers/albumsController.js";

import express from "express";

const router = express.Router();

router.post("/", createAlbum);

// * Task 1
// router.delete("/", deleteAllAlbums);  // DELETE /albums - deletes all albums

// * Task 2
// router.delete("/:albumId", deleteAlbum);  // DELETE /albums/:albumId - deletes one album

export default router;