
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import Transaction from "@/lib/schemas/Transaction.schema";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }) {
	const url = new URL(request.url);
	const searchValues = Utils.convertUrlSearchParamToJson(url.searchParams);

	const userId = searchValues.userId;
	const categoryType = searchValues.categoryType;
	// if(  userId !== undefined ) {
	// 	searchValues.userId = new mongoose.Types.ObjectId( userId as string );
	// }

	// const searchResult = await Transaction.find(searchValues);

	// const transactionList = ( searchResult.length > 0 ) ? Utils.converDbObjectToJson(searchResult) : [];

	// return NextResponse.json(transactionList, {status: 200});

	const transactionList = await Transaction.aggregate([
		{
			$lookup: {
				from: 'categories', // Name of the Category collection
				localField: 'categoryId',
				foreignField: '_id',
				as: 'categoryInfo',
			},
		},
		{
			$unwind: '$categoryInfo',
		},
		{
			$match: {
				userId: new mongoose.Types.ObjectId(userId),
				'categoryInfo.type': categoryType
			},
		},
		{
			$project: {
				_id: 1,
				description: 1,
				categoryId: '$categoryInfo._id',
				categoryName: '$categoryInfo.name',
				budgetId: '$budgetId',
				amount: 1,
				date: 1,
				// categoryType: '$categoryInfo.type', // Project the category type
			},
		},
	]);

	return NextResponse.json(transactionList, { status: 200 });
}


export async function POST(request: NextRequest) {
	const payload: JSONObject = await request.json();

	payload.userId = new mongoose.Types.ObjectId(payload.userId as string);
	payload.categoryId = new mongoose.Types.ObjectId(payload.categoryId as string);

	if (payload.budgetId !== undefined) {
		payload.budgetId = new mongoose.Types.ObjectId(payload.budgetId as string);
	}

	let newTransaction = await Transaction.create(payload);

	return NextResponse.json(newTransaction, { status: 200 })
}

export async function PUT(request: NextRequest, { params }) {

	const payload: JSONObject = await request.json();

	// Destructure budgetId out of the updateData, if exists
	const { budgetId, ...updateFields } = payload;
	
    updateFields.date = Utils.formatDateObjToDbDate(Utils.convertDateStrToObj(payload.date));

	// Create the update object
	let updateObject = {
		$set: updateFields,
		// $currentDate: { updatedAt: true }, // Update the `updatedAt` timestamp
	};

	// Conditionally add $unset to remove budgetId if needed
	if ( budgetId == undefined ) {
		updateObject["$unset"] = { budgetId: "" };
	}

	// Find the transaction by ID and update it with the provided fields
	const updatedTransaction = await Transaction.findByIdAndUpdate(
		payload._id,
		updateObject,
		{ new: true, runValidators: true }
	);
	return NextResponse.json(updatedTransaction, { status: 200 })

}

export async function DELETE(request: NextRequest) {
	const id = request.nextUrl.searchParams.get("id");

	await Transaction.findByIdAndDelete(id);
	return NextResponse.json({ message: "Transaction is deleted." }, { status: 200 });
}