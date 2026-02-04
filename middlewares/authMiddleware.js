import { verifyToken, hashToken } from "../services/token.js";
import ReadToken from "../models/readToken.js"

export const authenticateAdminToken = (req, res, next) => {
    try {
        const authHeader = req.headers["admintoken"];
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(".")[1];
        if (!token) return res.status(401).json({ message: "Malformed token" });

        const decoded = verifyToken(authHeader);

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token", error: err.message});
    }
};

export const authenticateReadToken = async (req, res, next) => {
    try {
        const authHeader = await hashToken(req.headers["readtoken"]);
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = await ReadToken.findOne({readToken: authHeader});
        if(!token) {
            return res.status(401).json({ message: "ReadToken is Invalid" });
        }
        next();
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message})
    }
}
