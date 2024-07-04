"use server";

import {  Schema } from "mongoose";
import { mongoose } from "@/lib/db";
const TokenSchema = new Schema ( 
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        token: { type: String, required: true },
        expiration: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
)
const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);

export default Token;