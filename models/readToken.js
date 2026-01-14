import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    readToken: { type: String, required: true, unique: true },
}, {timestamps: true });

const ReadToken = mongoose.model('ReadToken', tokenSchema);

export default ReadToken;
