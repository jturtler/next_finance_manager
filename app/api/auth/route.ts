
import { mongoose } from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import User from '@/lib/schemas/User.schema';
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import * as Encrypt from "./encryptPassword";
import { Document } from "mongoose";


export async function GET(request, { params }) {
	const url = new URL(request.url);
	const searchValues = Utils.convertUrlSearchParamToJson( url.searchParams );

	// Hash the plain text password so that we can search it properly in database IF ANY
	let password = searchValues.password;
	if(  password != undefined ) {
		delete searchValues.password;
	}
	const searchResult = await User.find((searchValues));

	// Find the users with the password if there is password in parametters
	if( password != undefined ) {
		let userList: Document[] = [];
		for( let i=0; i< searchResult.length; i++ ) {
			const user = searchResult[i];
			const matched = await Encrypt.comparePassword( password, user.password );
			if( matched ) {
				userList.push(user);
			}
		}

		const result = (userList.length > 0) ? Utils.converDbObjectToJson( userList ) : [{}] as JSONObject[];
		
		return NextResponse.json(result, { status: 200 });
	}

	return NextResponse.json([{}], { status: 200 });
}

export async function POST(request: NextRequest) {
	const payload: JSONObject = await request.json();

	// Hash(encrypt) password before creating
	const password = payload.password;
	payload.password = await Encrypt.hashPassword( password );

	const newUser = await User.create(payload);

	return NextResponse.json(newUser, { status: 200 })
}

