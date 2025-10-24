import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: false },
  image: { type:String, required: false },
  markdown: { type: String, required: true },
  tags: { type: [String], required: false }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;