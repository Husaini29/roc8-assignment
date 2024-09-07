import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request:NextRequest) {
    try {

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') ?? "1");
        const limit = parseInt(searchParams.get('limit') ?? "6");
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

        
    } catch (error:unknown) {
        return Response.json({ status:405, error:(error as Error).message })
    }
}