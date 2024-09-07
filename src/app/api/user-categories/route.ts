import getDataFromToken from "@/helpers/getDataFromToken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request:NextRequest) {
    try {
        const { categoryIds } : {categoryIds:number[]} = await request.json() as { categoryIds: number[]};
        const userId:number = getDataFromToken(request) as number;

        if(!userId || !Array.isArray(categoryIds)){
            return NextResponse.json({ status:400, message:"Invalid input"});
        }

        await prisma.userCategory.deleteMany({
            where : { userId : userId }
        });

        await prisma.userCategory.createMany({
            data: categoryIds.map((categoryId:number)=>({
               userId:userId,
               categoryId: categoryId
            })
        )
        });

        return NextResponse.json({ status:201, message:"User categories updated successfully"});

    } catch (error) {
        const errorMessage = (error as Error).message || 'Internal server error';
        return NextResponse.json({ status: 500, message: errorMessage });
    }
    
}