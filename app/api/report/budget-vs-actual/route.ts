
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import * as Constant from "@/lib/constants";
import Budget from "@/lib/schemas/Budget.schema";
import Transaction from "@/lib/schemas/Transaction.schema";

interface ReportData {
	categoryId: string,
	budgetAmount: number,
	expenseAmount: number,
	categoryName: string,
	remainingAmount: number,
	categories: string[]
}


export async function POST(request: NextRequest) {

	const payload: JSONObject = await request.json();

	// Check parametters
	let errArr: string[] = [];
	if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
		errArr.push("Invalid user ID");
	}

	if (payload.startDate == undefined) {
		errArr.push("Start date is missing");
	}
	else if (!Utils.isValidDate(payload.startDate)) {
		errArr.push("Start date is invalid");
	}

	if (payload.endDate == undefined) {
		errArr.push("End date is missing");
	}
	else if (!Utils.isValidDate(payload.endDate)) {
		errArr.push("End date is invalid");
	}

	if (errArr.length > 0) {
		return NextResponse.json({ errMsg: errArr.join("; ") }, { status: 200 });
	}

	let reportData: JSONObject = {};
	reportData.data = await getReportData(payload.userId, payload.startDate, payload.endDate);

	return NextResponse.json(reportData, { status: 200 });
}


const getReportData = async (userId: string, startDate: string, endDate: string): Promise<ReportData[]> => {
	const reportData: ReportData[] = await Transaction.aggregate([
		{
			$match: {
				userId: new mongoose.Types.ObjectId(userId),
				budgetId: { $exists: true, $ne: null },
				date: {
					$gte: new Date(startDate),
					$lte: new Date(endDate)
				}
			}
		},
		{
			$lookup: {
				from: 'budgets',
				localField: 'budgetId',
				foreignField: '_id',
				as: 'budgetDetails'
			}
		},
		{
			$unwind: {
				path: '$budgetDetails',
				preserveNullAndEmptyArrays: false
			}
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'categoryId',
				foreignField: '_id',
				as: 'categoryDetails'
			}
		},
		{
			$unwind: {
				path: '$categoryDetails',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$group: {
				_id: {
					categoryName: '$categoryDetails.name'
				},
				category: { $first: '$budgetDetails.categoryId' },
				budgetAmount: { $sum: '$budgetDetails.amount' },
				expenseAmount: { $sum: '$amount' },
				categories: { $addToSet: '$categoryDetails.name' }
			}
		},
		{
			$project: {
				categoryId: 1,
				budgetAmount: 1,
				expenseAmount: 1,
				remainingAmount: { $subtract: ['$budgetAmount', '$expenseAmount'] },
				categoryName: 1,
				categories: 1
			}
		}
	]);

	return reportData;
}