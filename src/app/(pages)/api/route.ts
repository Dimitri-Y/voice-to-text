"use server";
import { NextApiRequest, NextApiResponse } from 'next';

export type ResponseData = {
    success: boolean,
    message: string
}
export async function GET(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        return res.status(200).json({ success: true, message: "this is API" });
    } catch (error) {
        console.error('Sync User Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
