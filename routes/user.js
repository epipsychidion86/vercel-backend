import { deleteUser, getUser, updateUser } from "../controllers/userController.js";

import express from "express";

const router = express.Router();

// We add a new endpoint to the user router, that receives requests to GET /user/:userId.
// :userId is a param, which is like a variable in the path.
// Express identifies it by the : and stores it by its name in the req.params object.
router.get("/:userId", getUser);

router.patch("/:userId", updateUser);

router.delete("/", deleteUser);

export default router;
