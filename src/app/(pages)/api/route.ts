"use server";

import { NextResponse } from "next/server";

export type ResponseData = {
    success: boolean;
    message: string;
};

export async function GET() {
    try {
        const response: ResponseData = {
            success: true,
            message: "this is API",
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Sync User Error:", error);
        const response: ResponseData = {
            success: false,
            message: "Internal Server Error",
        };

        return NextResponse.json(response, { status: 500 });
    }
}
