
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import Budget from "@/lib/schemas/Budget.schema";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET( request: NextRequest, {params}) {
    const url = new URL(request.url);
	const searchValues = Utils.convertUrlSearchParamToJson( url.searchParams );
    
    const userId = searchValues.userId;
	if(  userId !== undefined ) {
		searchValues.userId = new mongoose.Types.ObjectId( userId as string );
	}

    // const searchResult = await Budget.find({userId: new mongoose.Types.ObjectId( userId as string )});
    const searchResult = await Budget.find(searchValues);

    const userData = ( searchResult.length > 0 ) ? Utils.converDbObjectToJson(searchResult) : [];

    return NextResponse.json(userData, {status: 200});
}


export async function POST( request: NextRequest ) {
    const payload: JSONObject = await request.json();

    payload.userId = new mongoose.Types.ObjectId(payload.userId as string);
    payload.categoryId = new mongoose.Types.ObjectId(payload.categoryId as string);
    const newBudget = await Budget.create(payload);

    return NextResponse.json(newBudget, {status: 200 })
}

export async function PUT( request: NextRequest, {params} ) {
    const payload: JSONObject = await request.json();

    // { new: true } --> return the modified document rather than the original one
    const newBudget = await Budget.findByIdAndUpdate(payload._id, payload, { new: true });

    return NextResponse.json(newBudget, {status: 200 })
}

export async function DELETE( request: NextRequest ) {
    const id = request.nextUrl.searchParams.get("id");

    await Budget.findByIdAndDelete(id);
    return NextResponse.json({message: "Budget is deleted."}, {status: 200});
}