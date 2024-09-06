import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            status:200,
            messgae:"Logout successfull"
        });

        response.cookies.set("token","",{
            httpOnly:true,
            expires: new Date(0)
        })

        return response;
    } catch (error:any) {
        return NextResponse.json({ error:error.message})
    }
}