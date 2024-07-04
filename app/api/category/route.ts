
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import Category from "@/lib/schemas/Category.schema";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET( request: NextRequest, {params}) {
    const url = new URL(request.url);
	
    const searchValues = Utils.convertUrlSearchParamToJson( url.searchParams );
    const userId = searchValues.userId;
	if(  userId !== undefined ) {
		searchValues.userId = new mongoose.Types.ObjectId( userId as string );
	}

    const searchResult = await Category.find(searchValues);
    const categoryList = ( searchResult.length > 0 ) ? Utils.converDbObjectToJson(searchResult) : [];

    return NextResponse.json(categoryList, {status: 200});
}


export async function POST( request: NextRequest ) {
    const payload: JSONObject = await request.json();

    // const userId = payload.userId;
    // if( userId !== undefined ) {
    //     payload.userId = new mongoose.Types.ObjectId(userId);
    // }

    const newCategory = await Category.create(payload);

    return NextResponse.json(newCategory, {status: 200 })
}

export async function PUT( request: NextRequest, {params} ) {
    const payload: JSONObject = await request.json();

    // { new: true } --> return the modified document rather than the original one
    const newCategory = await Category.findByIdAndUpdate(payload._id, payload, { new: true });

    return NextResponse.json(newCategory, {status: 200 })
}

export async function DELETE( request: NextRequest ) {
    const id = request.nextUrl.searchParams.get("id");

    await Category.findByIdAndDelete(id);
    return NextResponse.json({message: "Category is deleted."}, {status: 200});
}