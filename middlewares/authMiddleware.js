import { verifyToken } from "../services/token.js";
import ReadToken from "../models/readToken.js"
import { hashPassword } from '../services/hashing.js';

export const authenticateAdminToken = (req, res, next) => {
    const authHeader = req.headers["admintoken"];
    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Malformed token" });

    try {
        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const authenticateReadToken = async (req, res, next) => {
    const authHeader = hashPassword(req.headers["readtoken"]);
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        if(!(await ReadToken.find({token: authHeader}))) {
            throw new Error();
        }
        next();
    } catch (err) {
        res.status(401).json({message: "Invalid Read Token"})
    }
}
