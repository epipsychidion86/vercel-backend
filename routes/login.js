import { loginPost } from "../controllers/loginController.js";
import express from "express";

const router = express.Router();

// Handle POST request to /login endpoint
router.post("/", loginPost);

// Export the router to be registered in index.js
export default router;