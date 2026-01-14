import User from '../models/user.js';
import ReadToken from '../models/readToken.js';
import { hashPassword, comparePassword } from "../services/hashing.js";
import { generateToken, generateReadKey, hashToken } from "../services/token.js";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body; 

        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await hashPassword(password);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message, body: req.body });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body; 
        const user = await User.findOne({ username });

        if (!user)
            return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken({ id: user._id, email: user.email });
        res.status(200).json({ message: "Login successful!", token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const generateReadToken = async (req,res) => {
    try {
        const key = generateReadKey();
        const hashedKey = await hashToken(key);
        const newToken = new ReadToken({readToken: hashedKey}); 
        await newToken.save();
        res.status(200).json({message:"Token Generated", token: key})
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const invalidateReadToken = async (req, res) => {
    try {
        const { readToken } = req.body;
        const hashedKey = hashToken(readToken);
        await ReadToken.findOneAndDelete({hashedKey});
        res.status(200).json({message:"Token successfully invalidated."});
    } catch(err) {
        res.status(500).json({message:err});
    }
}


