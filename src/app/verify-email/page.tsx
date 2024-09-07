"use client"

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function OtpValidationComponent() {
    
    const optLength = 8;
    const router = useRouter();
    const email = useSearchParams().get("email");

    const[otp,setOtp] = useState<string[]>(new Array(optLength).fill(""));
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange =(e : React.ChangeEvent<HTMLInputElement>,idx:number) =>{
        const value = e.target.value;
        const newOtp = [...otp];

        // allow one digit at a time
        newOtp[idx] = value.substring(value.length -1);
        setOtp(newOtp);

        // move to next input if current is filled
        if(value && idx < optLength-1 && inputRefs.current[idx +1]){
            inputRefs.current[idx+1]?.focus();
        }
    }

    const handleKeyDown =(e: React.KeyboardEvent,index:number)=>{

        if(e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index-1]){
            inputRefs.current[index-1]?.focus();
        }
    }

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try {        
            // check otp length
            const verifyOtp = otp.join("");

            if(verifyOtp.length === optLength){
                const response = await fetch("/api/verifyEmail",{
                    method:"POST",
                    headers:{
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({ email,verifyOtp })
                });

                if(!response.ok){
                    const data: {message?:string} = await response.json() as {message?:string};
                    toast.error(data.message ?? "Invalid Otp");
                    return
                }

                toast.success("Email Verified");
                setOtp(new Array(optLength).fill(""));
                router.push("/login");
            }
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    useEffect(()=>{
        if(inputRefs.current[0]){
            inputRefs.current[0].focus();
        }
    },[])
return (
    <div className='flex justify-center items-center mt-8'>
        <form 
            onSubmit={handleSubmit}
            className='h-[380px] w-[550px] border-2 border-[#c1c1c1] rounded-2xl'>
            <div className='h-full flex flex-col items-center lh leading-[3]'>
            <h2 className='text-2xl font-semibold mt-8'>Verify your email</h2>
            <div className='text-sm font-normal mt-6 flex flex-col items-center leading-[1]'>
                Enter the 8 digit code you received on
                <span className='text-md font-semibold mt-2'>{`${email?.slice(0,3)}...${email?.slice(-10)}`}</span>
            </div>

            <div className='mt-8 leading-none'>
                <label className='font-normal text-sm'>Code</label>
                <div className='flex gap-4'>
                {
                    otp.map((value,index)=>(
                        <input 
                            className='p-2 mt-1 border border-[#c1c1c1] rounded-md h-10 text-[#848484] w-10 text-center'
                            type="text" 
                            key={index}
                            ref={(input)=>{
                                if (inputRefs.current) {
                                    inputRefs.current[index] = input;
                                }
                            }} 
                            value={value}
                            onChange={(e)=>handleChange(e,index)}
                            onKeyDown={(e)=>handleKeyDown(e,index)}
                        />
                        
                    ))
                }
                </div>
            </div>

            
            <button type='submit'
                className='w-4/5 mt-14 rounded cursor-pointer bg-[#000000] text-[#ffffff]'>
                    VERIFY
            </button>
            </div>
        </form>
    </div>
)
}

export default function OtpValidation() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpValidationComponent />
        </Suspense>
    );
}