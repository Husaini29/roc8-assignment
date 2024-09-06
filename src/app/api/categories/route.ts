import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

export async function GET(request:NextApiRequest) {
    try {

        const { searchParams } = new URL(request.url!);

        const page = parseInt(searchParams.get('page') || "1");
        const limit = parseInt(searchParams.get('limit') || "5");
        const skip = (page-1) * limit;

        const categories = await prisma.category.findMany({
            skip,
            take:limit,
            select:{
                id:true,
                name:true
            }
        });

        const totalCategories = await prisma.category.count();
        const totalPages = Math.ceil(totalCategories/limit)

        if(categories){
            return NextResponse.json({
                categories,
                page,
                totalPages
            });
        } else{
            return NextResponse.json({ status:401, message:'No category data found'});
        }

        
    } catch (error:any) {
        return NextResponse.json({ status:500, message:"Server error"});
    }
}