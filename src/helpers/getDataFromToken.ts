import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";


interface DecodedToken {
    id: number;
    email: string;
    name: string;
    iat: number;
    exp: number;
  }

export const getDataFromToken = (request:NextRequest) => {

    try {
        const token = request.cookies.get("token")?.value ?? "";
        const decodedToken = jwt.verify(token,process.env.TOKEN_SECRET!) as DecodedToken;
        console.log("decoded token hai",decodedToken)
        return decodedToken.id;
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message})
    }

}

export default getDataFromToken