import mongoose from "mongoose";

const Tag = new mongoose.Schema({
    name : { type: String, required: true },
    color : { type: String, required: false }
}, { timestamps: false });

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: {type: String, required: true},
    slug: { type: String, required: true, unique: true },
    hasAPage: { type: Boolean, required: true},
    link: {type: String, required: false},
    excerpt: { type: String, required: false },
    shortExcerpt: {type: String, required: false},
    image: { type:String, required: false },
    markdown: { type: String, required: false },
    readTime: {type: String, required: false},
    tags: [Tag],
    reader: {type: Number},
}, { timestamps: true }, {strict: true});

const Content = mongoose.model('Content', contentSchema);

export default Content;
