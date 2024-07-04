"use server";

import { Schema } from "mongoose";
import { mongoose } from "@/lib/db";

const ReportSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['budget_vs_actual', 'expense', 'income', 'cash_flow'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
  
const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

export default Report;