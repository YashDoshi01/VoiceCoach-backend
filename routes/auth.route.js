import express from 'express';
import { RegisterController , LoginController} from '../controllers/auth.controller.js';
const app = express();
const authrouter = express.Router();

authrouter.post('/login', LoginController);
authrouter.post('/register', RegisterController);
authrouter.post('/logout', (req, res) => {  
    res.send('Logout endpoint');
});

export default authrouter;