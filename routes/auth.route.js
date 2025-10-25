import express from 'express';
import { RegisterController , LoginController} from '../controllers/auth.controller.js';
const authrouter = express.Router();

authrouter.post('/login', LoginController);
authrouter.post('/register', RegisterController);

export default authrouter;