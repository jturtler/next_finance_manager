

import { NextResponse } from "next/server";
import { mongoose } from "@/lib/db";

export async function GET() {
  try {
    // await dbConnect.connect();
    return NextResponse.json({ message: "Connected!" });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}