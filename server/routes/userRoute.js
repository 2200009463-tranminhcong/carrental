import express from "express";
import { createOrUpdateUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.post("/sync", createOrUpdateUser);
router.get("/:id", getUserById);

export default router;

