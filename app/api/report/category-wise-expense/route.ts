
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


export async function POST( request: NextRequest ) {

	console.log("============== Category-wise-expense");	
	const payload: JSONObject = await request.json();

	// Check parametters
	let errArr: string[] = [];
	if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
		errArr.push("Invalid user ID");
	}

	if (payload.startDate == undefined ) {
		errArr.push("Start date is missing");
	}
	else if(!Utils.isValidDate(payload.startDate) ) {
		errArr.push("Start date is invalid");
	}

	if (payload.endDate == undefined ) {
		errArr.push("End date is missing");
	}
	else if(!Utils.isValidDate(payload.endDate) ) {
		errArr.push("End date is invalid");
	}
	

	if( errArr.length > 0 ) {
		return NextResponse.json({errMsg: errArr.join("; ")}, { status: 200 });
	}
	let reportData: JSONObject = {};
	reportData.data = await getReportData(payload.userId, payload.startDate, payload.endDate);
	console.log(reportData);	
	return NextResponse.json(reportData, { status: 200 });
}


const getReportData = async(userId: string, startDate: string, endDate: string): Promise<ReportData[]> => {
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
			  from: "categories", // Assuming you have a separate categories collection
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
				year: { $year: "$date" },
				categoryName: "$categoryDetails.name"
			  },
			  totalAmount: { $sum: "$amount" },
			  transactions: {
				$push: {
				  date: "$date",
				  amount: "$amount",
				  description: "$description"
				}
			  }
			}
		  },
		  {
			$group: {
			  _id: "$_id.year",
			  totalExpense: { $sum: "$totalAmount" },
			  categories: {
				$push: {
				  category: "$_id.categoryName",
				  totalAmount: "$totalAmount",
				  transactions: "$transactions"
				}
			  }
			}
		  },
		  {
			$project: {
			  _id: 0,
			  year: "$_id",
			  totalExpense: 1,
			  categories: 1
			}
		  }
		]);
	
	return reportData;
}
