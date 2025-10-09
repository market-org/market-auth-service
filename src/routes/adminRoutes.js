import express from "express";
import { deleteUser } from "../controllers/adminController.js";
import { checkUserHeader } from "../middleware/checkUserHeader.js";

const router = express.Router();

router.delete("/users/:id", checkUserHeader, deleteUser);

export default router;
