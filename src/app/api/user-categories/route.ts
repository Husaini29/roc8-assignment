import getDataFromToken from "@/helpers/getDataFromToken";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function POST(request:NextRequest) {
    try {
        const { categoryIds } = await request.json();
        const userId = await getDataFromToken(request);

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

    } catch (error:any) {
        return NextResponse.json({ status:500, message:'Internal server error'});
    }
    
}