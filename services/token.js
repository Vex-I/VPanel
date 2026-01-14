import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import crypto from 'crypto'

export const generateToken = (payload) => (
    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})
);

export const verifyToken = (token) => (
    jwt.verify(token, process.env.JWT_SECRET)
);

export const generateReadKey = () => (
    randomBytes(32).toString('hex')
);

export const hashToken = async (token) => (
    crypto
        .createHmac("sha256", process.env.JWT_SECRET)
        .update(token)
        .digest("hex")
);
