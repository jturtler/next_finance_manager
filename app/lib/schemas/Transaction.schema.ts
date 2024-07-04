"use server";

import {  Schema } from "mongoose";
import { mongoose } from "@/lib/db";
const TransactionSchema = new Schema ( 
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
        budgetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Budget',
            required: false,
        },
        amount: { type: Number, required: true },
        description: { type: String, required: false },
        date: { type: Date, required: true },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
    }
)
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;