"use server";

import {  Schema } from "mongoose";
import { mongoose } from "@/lib/db";

const UserSchema = new Schema ( 
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
    }
)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;