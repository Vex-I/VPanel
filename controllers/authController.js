import User from '../models/user.js';
import { hashPassword, comparePassword } from "../services/hashing.js";
import { generateToken } from "../services/jwt.js";

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
        res.status(500).json({ error: err.message });
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
        res.json({ message: "Login successful!", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


