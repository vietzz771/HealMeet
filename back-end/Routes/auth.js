import express from 'express';
import { register, login,addAdmin } from "../Controllers/authController.js"

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addAdmin',addAdmin)
export default router;