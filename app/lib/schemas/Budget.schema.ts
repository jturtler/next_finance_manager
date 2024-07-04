"use server";

import {  Schema } from "mongoose";
import { mongoose } from "@/lib/db";
const BudgetSchema = new Schema ( 
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        amount: { type: Number, required: true },
        description: { type: String, required: false },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
    }
)
const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);

export default Budget;