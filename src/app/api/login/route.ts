import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export async function POST(req:NextRequest){
    const { email,password } = await req.json();

    try {

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
            return Response.json({ status:401, message:'Invalid email address'})
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return Response.json({ status:401, message:'Invalid Password'})
        }

        if(!user.emailVerified){
            return Response.json({ status:401, message:'Please verify your email'})
        }

        const tokenData = {
            id:user.id,
            email:user.email,
            name:user.name
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{ expiresIn: '1h' });

        const response = NextResponse.json({ status:200, messgae:"User logged in successfully"});

        response.cookies.set("token",token,{
            httpOnly:false
        })
        return response;
        
    } catch (error) {
        return Response.json({ status:405, message:"Internal server error"})
    }
}