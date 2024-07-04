
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
	
	if (payload.dataFrom == undefined 
		&& payload.dataFrom != ("income")
			&& payload.dataFrom.indexOf("expense") < 0 ) {
		errArr.push(`Please define one 'dataFrom', 'income' or 'expense'`);
	}


	if( errArr.length > 0 ) {
		return NextResponse.json({errMsg: errArr.join("; ")}, { status: 200 });
	}

	let reportData: JSONObject = {};
	if( payload.dataFrom == "income" ) {
		reportData.data = await getReportData(payload.userId, payload.startDate, payload.endDate, "income");
	}
	
	else if( payload.dataFrom == "expense" ) {
		reportData.data = await getReportData(payload.userId, payload.startDate, payload.endDate, "expense");
	}
	
	return NextResponse.json(reportData, { status: 200 });
}


const getReportData = async(userId: string, startDate: string, endDate: string, categoryType: string): Promise<ReportData[]> => {
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
		  $lookup:
			/**
			 * from: The target collection.
			 * localField: The local join field.
			 * foreignField: The target join field.
			 * as: The name for the results.
			 * pipeline: Optional pipeline to run on the foreign collection.
			 * let: Optional variables to use in the pipeline field stages.
			 */
			{
			  from: "categories",
			  localField: "categoryId",
			  foreignField: "_id",
			  as: "categoryDetails"
			}
		},
		{
		  $unwind:
			/**
			 * path: Path to the array field.
			 * includeArrayIndex: Optional name for index.
			 * preserveNullAndEmptyArrays: Optional
			 *   toggle to unwind null and empty values.
			 */
			{
			  path: "$categoryDetails",
			  preserveNullAndEmptyArrays: false
			}
		},
		{
		  $addFields:
			/**
			 * newField: The new field name.
			 * expression: The new field expression.
			 */
			{
			  month: {
				$month: "$date"
			  },
			  year: {
				$year: "$date"
			  },
			  type: "$categoryDetails.type"
			}
		},
		{
		  $match:
			/**
			 * query: The query in MQL.
			 */
			{
			  "categoryDetails.type": categoryType
			}
		},
		{
		  $group:
			/**
			 * _id: The id of the group.
			 * fieldN: The first field name.
			 */
			{
			  _id: {
				month: "$month",
				year: "$year",
				// categoryId: "$categoryId",
				// categoryName: "$categoryDetails.name",
				// type: "$type"
			  },
			  totalAmount: {
				$push: {
				  k: "$categoryDetails.name",
				  v: "$amount"
				}
			  }
			}
		},
		{
		  $project:
			/**
			 * specifications: The fields to
			 *   include or exclude.
			 */
			{
			  _id: 0,
			  month: "$_id.month",
			  year: "$_id.year",
			//   type: "$_id.type",
			  totals: {
				$arrayToObject: "$totalAmount"
			  }
			}
		}
	  ]);
	
	return reportData;
}
