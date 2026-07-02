import express from "express";
import { NewContact } from "../controllers/publicController.js";

const router = express.Router();

router.post("/new-contact", NewContact);
router.post("/new-Contact", NewContact);

export default router;