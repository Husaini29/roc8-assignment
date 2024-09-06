import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';
import VerifyEmail from "@/emails/verificationEmail"

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
 
    const { name,email, password } = await req.json();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(10000000 + Math.random() * 90000000).toString();

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          otp,
          emailVerified:false
        },
      });

      
      const { data,error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: user.email,
        subject: 'Verify Your Email',
        react: VerifyEmail({ otp }),
      });

      console.log(data,"email data");
      console.log(user, user.email);

      if(error){
        return Response.json({ status:400, error })
      }


      return Response.json({status:201, message: 'User registered. Please check your email to verify your account.'});

    } catch (error) {
      return Response.json({status:500, message: 'Verify email address'});
    }
}
