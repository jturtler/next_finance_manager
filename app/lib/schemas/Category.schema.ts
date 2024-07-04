"use server";

import {  Schema } from "mongoose";
import { mongoose } from "@/lib/db";

const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;