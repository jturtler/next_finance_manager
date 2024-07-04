
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import * as Constant from "@/lib/constants";
import Transaction from "@/lib/schemas/Transaction.schema";

interface ReportData {
	category: string;
	name: string;
	totalAmount: number;
	details: JSONObject[],
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

	if (payload.periodType === undefined
		|| (payload.periodType != Constant.REPORT_PERIOD_TYPE_MONTHLY
			&& payload.periodType != Constant.REPORT_PERIOD_TYPE_QUARTERLY
			&& payload.periodType != Constant.REPORT_PERIOD_TYPE_YEARLY)) {
		errArr.push(`Please define one period type, such as "Monthly", "Quartly" or " Yearly"`);
	}


	if (errArr.length > 0) {
		return NextResponse.json({ errMsg: errArr.join("; ") }, { status: 200 });
	}

	let reportData: JSONObject = {};
	if (payload.periodType == Constant.REPORT_PERIOD_TYPE_MONTHLY) {
		reportData.data = await getReportData_Monthly(payload.userId, payload.startDate, payload.endDate);
	}
	else if (payload.periodType == Constant.REPORT_PERIOD_TYPE_QUARTERLY) {
		reportData.data = await getReportData_Quarterly(payload.userId, payload.startDate, payload.endDate);
	}
	else if (payload.periodType == Constant.REPORT_PERIOD_TYPE_YEARLY) {
		reportData.data = await getReportData_Yearly(payload.userId, payload.startDate, payload.endDate);
	}


	return NextResponse.json(reportData, { status: 200 });
}


const getReportData_Monthly = async (userId: string, startDate: string, endDate: string): Promise<ReportData[]> => {
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
			$addFields: {
				month: {
					$month: "$date"
				},
				year: {
					$year: "$date"
				}
			}
		},
		{
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "categoryDetails"
			}
		},
		{
			$unwind: "$categoryDetails"
		},
		{
			$group: {
				_id: {
					month: "$month",
					year: "$year",
					categoryName: "$categoryDetails.name",
					categoryType: "$categoryDetails.type"
				},
				totalAmount: {
					$sum: "$amount"
				}
			}
		},
		{
			$group: {
				_id: {
					year: "$_id.year",
					month: "$_id.month",
					type: "$_id.categoryType"
				},
				categories: {
					$push: {
						k: "$_id.categoryName",
						v: "$totalAmount"
					}
				},
				totalAmount: {
					$sum: "$totalAmount"
				}
			}
		},
		{
			$group: {
				_id: {

					year: "$_id.year",
					month: "$_id.month"
				},
				income: {
					$push: {
						$cond: [
							{
								$eq: ["$_id.type", "income"]
							},
							{
								$arrayToObject: "$categories"
							},
							null
						]
					}
				},
				expense: {
					$push: {
						$cond: [
							{
								$eq: ["$_id.type", "expense"]
							},
							{
								$arrayToObject: "$categories"
							},
							null
						]
					}
				},
				totalIncome: {
					$sum: {
						$cond: [
							{
								$eq: ["$_id.type", "income"]
							},
							"$totalAmount",
							0
						]
					}
				},
				totalExpense: {
					$sum: {
						$cond: [
							{
								$eq: ["$_id.type", "expense"]
							},
							"$totalAmount",
							0
						]
					}
				}
			}
		},
		{
			$project: {
				_id: 0,
				date: "$_id",
				totalIncome: 1,
				totalExpense: 1,
				income: {
					$filter: {
						input: "$income",
						as: "item",
						cond: {
							$ne: ["$$item", null]
						}
					}
				},
				expense: {
					$filter: {
						input: "$expense",
						as: "item",
						cond: {
							$ne: ["$$item", null]
						}
					}
				}
			}
		},
		{
			$project: {
				date: 1,
				totalIncome: 1,
				totalExpense: 1,
				income: {
					$arrayElemAt: ["$income", 0]
				},
				expense: {
					$arrayElemAt: ["$expense", 0]
				}
			}
		}
	]);

	return reportData;
}

const getReportData_Quarterly = async (userId: string, startDate: string, endDate: string): Promise<ReportData[]> => {
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
			$addFields: {
				year: { $year: "$date" },
				quarter: {
					$ceil: { $divide: [{ $month: "$date" }, 3] }
				}
			}
		},
		{
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "categoryDetails"
			}
		},
		{
			$unwind: "$categoryDetails"
		},
		{
			$group: {
				_id: {
					year: "$year",
					quarter: "$quarter",
					categoryName: "$categoryDetails.name",
					categoryType: "$categoryDetails.type"
				},
				totalAmount: {
					$sum: "$amount"
				}
			}
		},
		{
			$group: {
				_id: {
					year: "$_id.year",
					quarter: "$_id.quarter",
					type: "$_id.categoryType"
				},
				categories: {
					$push: {
						k: "$_id.categoryName",
						v: "$totalAmount"
					}
				},
				totalAmount: {
					$sum: "$totalAmount"
				}
			}
		},
		{
			$group: {
				_id: {

					year: "$_id.year",
					quarter: "$_id.quarter"
				},
				income: {
					$push: {
						$cond: [
							{
								$eq: ["$_id.type", "income"]
							},
							{
								$arrayToObject: "$categories"
							},
							null
						]
					}
				},
				expense: {
					$push: {
						$cond: [
							{
								$eq: ["$_id.type", "expense"]
							},
							{
								$arrayToObject: "$categories"
							},
							null
						]
					}
				},
				totalIncome: {
					$sum: {
						$cond: [
							{
								$eq: ["$_id.type", "income"]
							},
							"$totalAmount",
							0
						]
					}
				},
				totalExpense: {
					$sum: {
						$cond: [
							{
								$eq: ["$_id.type", "expense"]
							},
							"$totalAmount",
							0
						]
					}
				}
			}
		},
		{
			$project: {
				_id: 0,
				date: "$_id",
				totalIncome: 1,
				totalExpense: 1,
				income: {
					$filter: {
						input: "$income",
						as: "item",
						cond: {
							$ne: ["$$item", null]
						}
					}
				},
				expense: {
					$filter: {
						input: "$expense",
						as: "item",
						cond: {
							$ne: ["$$item", null]
						}
					}
				}
			}
		},
		{
			$project: {
				date: 1,
				totalIncome: 1,
				totalExpense: 1,
				income: {
					$arrayElemAt: ["$income", 0]
				},
				expense: {
					$arrayElemAt: ["$expense", 0]
				}
			}
		}
	]);

	return reportData;
}


const getReportData_Yearly = async (userId: string, startDate: string, endDate: string): Promise<ReportData[]> => {
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
			$addFields: {
				year: { $year: "$date" }
			}
		},
		{
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "categoryDetails"
			}
		},
		{
			$unwind: "$categoryDetails"
		},
		{
			$group: {
				_id: {
					year: "$year",
					categoryName: "$categoryDetails.name",
					categoryType: "$categoryDetails.type"
				},
				totalAmount: {
					$sum: "$amount"
				}
			}
		},
		{
			$group: {
				_id: {
					year: "$_id.year",
					type: "$_id.categoryType"
				},
				categories: {
					$push: {
						k: "$_id.categoryName",
						v: "$totalAmount"
					}
				},
				totalAmount: {
					$sum: "$totalAmount"
				}
			}
		},
		{
			$group: {
				_id: {

					year: "$_id.year",
				},
				income: {
					$push: {
						$cond: [
							{
								$eq: ["$_id.type", "income"]
							},
							{
								$arrayToObject: "$categories"
							},
							null
						]
					}
				},
				expense: {
					$push: {
						$cond: [
							{
								$eq: ["$_id.type", "expense"]
							},
							{
								$arrayToObject: "$categories"
							},
							null
						]
					}
				},
				totalIncome: {
					$sum: {
						$cond: [
							{
								$eq: ["$_id.type", "income"]
							},
							"$totalAmount",
							0
						]
					}
				},
				totalExpense: {
					$sum: {
						$cond: [
							{
								$eq: ["$_id.type", "expense"]
							},
							"$totalAmount",
							0
						]
					}
				}
			}
		},
		{
			$project: {
				_id: 0,
				date: "$_id",
				totalIncome: 1,
				totalExpense: 1,
				income: {
					$filter: {
						input: "$income",
						as: "item",
						cond: {
							$ne: ["$$item", null]
						}
					}
				},
				expense: {
					$filter: {
						input: "$expense",
						as: "item",
						cond: {
							$ne: ["$$item", null]
						}
					}
				}
			}
		},
		{
			$project: {
				date: 1,
				totalIncome: 1,
				totalExpense: 1,
				income: {
					$arrayElemAt: ["$income", 0]
				},
				expense: {
					$arrayElemAt: ["$expense", 0]
				}
			}
		}
	]);

	return reportData;
}
