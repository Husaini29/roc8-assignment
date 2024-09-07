import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface VerifyEmailType{
  email:string,
  verifyOtp:string
}

export async function POST(req:NextRequest){
    const { email,verifyOtp }: VerifyEmailType = await req.json() as VerifyEmailType;

    try {

      if (!email || !verifyOtp) {
        return Response.json({ status: 400, message: "Email and Otp are required" }, { status: 400 });
      }
      
      const user = await prisma.user.findUnique({
        where:{ email }
      });

      if(!user){
        return Response.json({ status:400, message:"User not found"})
      }
      
      if(user.otp !== verifyOtp){
        return Response.json({ status:400, message:"Invalid Otp"})
      }

      await prisma.user.update({
        where:{ id: user.id },
        data:{
          emailVerified:true,
          otp:null
        }
      });

      return Response.json({status:200, message:"Email verified successfully"})
      
    } catch (error) {
      const errorMessage = (error as Error).message || 'Internal server error';
      return NextResponse.json({ status: 500, message: errorMessage });
    }
}