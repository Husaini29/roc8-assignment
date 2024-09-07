import getDataFromToken from "@/helpers/getDataFromToken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request:NextRequest) {
    
try {
    const userId:number = getDataFromToken(request) as number;
    const user = await prisma.user.findUnique({
        where:{ id: userId },
        select:{
            id:true,
            name:true,
            email:true,
            userCategories: {
                select: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            password:false,
            emailVerified:false,
            otp:false,
        }
    });

    return NextResponse.json(user);

} catch (error) {
    return NextResponse.json({ error:(error as Error).message });
}
}