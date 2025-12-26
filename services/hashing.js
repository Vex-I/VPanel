import bcrypt from 'bcryptjs'

export const hashPassword = (initPassword) => async (bcrypt.hash(initPassword, 10));

export const comparePassword = (initPassword, hashedPassword) => async (bcrypt.compare(initPassword, hashedPassword));
