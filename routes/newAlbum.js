import { postAlbum, deleteAlbum, deleteAllAlbums, /*updateAlbum*/ } from "../controllers/newAlbumController.js";

import express from "express";

const router = express.Router();

router.post("/", postAlbum);

// router.put("/", updateAllAlbums);

router.delete("/", deleteAllAlbums); // DELETE /new-album/all - deletes all albums

router.delete("/:albumId", deleteAlbum);        // DELETE /new-album - deletes one album

export default router;
