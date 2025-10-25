import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const HashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const RegisterController = async (req, res) => {
    const {email, password , username} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return  res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await HashPassword(password);
        const newUser = new User({ email, password: hashedPassword , username});
        await newUser.save();
        res.status(201).json({success : true  ,  message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
export const LoginController = async (req, res) => {
    const {email , password} = req.body;
    try{
        const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "120h" } );
      res.status(200).json({ token });

    }
    catch(error){
        res.status(500).json({ message: error });
    }   
}