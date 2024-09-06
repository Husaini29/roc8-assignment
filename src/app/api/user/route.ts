import getDataFromToken from "@/helpers/getDataFromToken";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request:NextRequest) {
    
try {
    const userId = await getDataFromToken(request);
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

} catch (error:any) {
    return NextResponse.json({ error: error.message });
}
}