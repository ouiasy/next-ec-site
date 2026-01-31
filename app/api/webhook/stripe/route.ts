import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: NextRequest) => {
	// console.log(request.headers);
	console.log(request.body);
	console.log("called here!!");

	// 200 status
	return NextResponse.json({ status: 200 });
};
