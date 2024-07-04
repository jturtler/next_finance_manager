
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import Budget from "@/lib/schemas/Budget.schema";
import Transaction from "@/lib/schemas/Transaction.schema";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


interface ReportData {
	totalAmount: number;
	details: JSONObject[],
	month: number,
	year: number
}


export async function POST(request: NextRequest) {

	const payload: JSONObject = await request.json();

	// Check parametters
	let errArr: string[] = [];
	if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
		errArr.push("Invalid user ID");
	}

	if (payload.startDate === undefined) {
		errArr.push("Start date is missing");
	}
	else if (!Utils.isValidDate(payload.startDate)) {
		errArr.push("Start date is invalid");
	}

	if (payload.endDate === undefined) {
		errArr.push("End date is missing");
	}
	else if (!Utils.isValidDate(payload.endDate)) {
		errArr.push("End date is invalid");
	}

	if (payload.periodType === undefined
			&& payload.dataFrom.indexOf("expense") < 0) {
		errArr.push(`Please define at least one 'dataFrom', 'income' or 'expense'`);
	}

	if (errArr.length > 0) {
		return NextResponse.json({ errMsg: errArr.join("; ") }, { status: 200 });
	}


	let reportData: JSONObject = {};
	if (payload.dataFrom.indexOf("income") >= 0) {
		reportData.incomeData = await getReportData(payload.userId, payload.startDate, payload.endDate, 'income');
	}

	if (payload.dataFrom.indexOf("expense") >= 0) {
		reportData.expenseData = await getReportData(payload.userId, payload.startDate, payload.endDate, 'expense');
	}

	return NextResponse.json(reportData, { status: 200 });
}


const getReportData = async (userId: string, startDate: string, endDate: string, categoryType: string): Promise<ReportData[]> => {

	const reportData: ReportData[] = await Transaction.aggregate([
		{
			$match: {
				userId: new mongoose.Types.ObjectId(userId),
				date: {
					$gte: new Date(startDate),
					$lte: new Date(endDate)
				}
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
				preserveNullAndEmptyArrays: false
			}
		},
		{
			$match: {
				'categoryDetails.type': categoryType
			}
		},
		{
			$group: {
				_id: {
					year: { $year: "$date" },
					month: { $month: "$date" }
				},
				totalAmount: { $sum: "$amount" },
				details: { $push: "$$ROOT" },
			}
		},
		{
			$sort: { "_id.month": 1 }
		},
		{
			$project: {
				_id: 0,
				month: "$_id.month",
				year: "$_id.year",
				totalAmount: 1,
				details: 1
			}
		}
	]);

	return reportData;
}
