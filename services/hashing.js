import bcrypt from 'bcryptjs'

export const hashPassword = async (initPassword) => (bcrypt.hash(initPassword, 10));

export const comparePassword = async (initPassword, hashedPassword) => (bcrypt.compare(initPassword, hashedPassword));
