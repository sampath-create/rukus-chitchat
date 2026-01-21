import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

// GET /api/users/search?q=something
router.get("/search", searchUsers);

export default router;
