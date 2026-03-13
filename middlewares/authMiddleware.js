import { verifyToken, hashToken } from "../services/token.js";
import ReadToken from "../models/readToken.js"

export const authenticateAdminToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"].split(" ")[1];
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(".")[1];
        if (!token) return res.status(401).json({ message: "Malformed token" });

        const decoded = verifyToken(authHeader);
        const username = decoded.username;
        const role = decoded.role;

        req.user = {username, role };

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token", error: err.message});
    }
};

export const authenticateReadToken = async (req, res, next) => {
    try {
        const authHeader = await hashToken(req.headers["authorization"].split(" ")[1]);
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = await ReadToken.findOne({readToken: authHeader});
        if(!token) {
            return res.status(401).json({ message: "Read token is invalid" });
        }

        next();
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message})
    }
}

export const determineAccess = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]?.split(" ")[1];

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const hashedToken = await hashToken(authHeader);

        const token = await ReadToken.findOne({readToken: hashedToken});

        if(!token) {
            try {
                const authHeader = req.headers["authorization"].split(" ")[1];
                const token = authHeader.split(".")[1];

                if (!token) return res.status(401).json({ message: "Malformed token" });

                const decoded = verifyToken(authHeader);
                const username = decoded.username;
                const role = decoded.role;

                req.user = {username, role };
            } catch (err) {
                return res.status(401).json({ message: "Invalid or expired token", error: err.message});
            }
        }

        next();
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message})
    }
}

export const verifyAdminAccess = async (req, res, next) => {
    try {
        if(!req.user.role.includes("admin")) {
        res.status(403).json({message: "User has no admin access"})
        }
        next();
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message})
    }
}
export const verifyManageAccess = async (req, res, next) => {
    try {
        if(!req.user.role.includes("manage")) {
        res.status(403).json({message: "User has no manage access"})
        }
        next();
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message})
    }
}
export const verifyEditAccess = async (req, res, next) => {
    try {
        if(!req.user.role.includes("edit")) {
        res.status(403).json({message: "User has no edit access"})
        }
        next();
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message})
    }
}
