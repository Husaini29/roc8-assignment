"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { loginSchema } from '../../schemas/loginSchema';
import toast from 'react-hot-toast';


const initialValues={
  email:"",
  password:""
}

interface ApiResponse{
  message?:string,
  error?:string
}

export default function Login() {

  const router = useRouter();
  const [isShowPassword,setIsShowPassword] = useState<boolean>(false);

  const { values,errors,handleChange,handleSubmit,handleBlur, touched,resetForm } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit : async (values)=>{
      try {
        // call login api
        const response = await fetch("/api/login",{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(values)
        });

        if(!response.ok){
          toast.error("An error occured");
        }

        const data:ApiResponse = await response.json() as ApiResponse;

        if(data.error){
          toast.error(data.error)
        } else{
          toast.success("Login Successfull");
          router.push("/");
        }

        resetForm();
        
      } catch (error) {
        toast.error((error as Error).message ?? "An unexpected error occured");
      }
    }
});

  return (
        <div className='flex justify-center items-center mt-8'>
          <form 
            onSubmit={handleSubmit}
            className='h-[500px] w-[450px] border-2 border-[#c1c1c1] rounded-2xl'>
            <div className='h-full flex flex-col items-center lh leading-[3]'>
              <h2 className='text-2xl font-semibold mt-8'>Login</h2>
              <h3 className='text-xl font-medium mt-8'>Welcome back to ECOMMERCE</h3>
              <h4 className='text-sm font-normal mt-2'>The next gen business marketplace</h4>
              
              <div className='flex flex-col mt-4 w-4/5'>
                <label className='text-sm'>Email</label>
                <input 
                  className='p-2 border border-[#c1c1c1] rounded-md h-10 text-[#848484]'
                  type="email" 
                  name='email'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder='Enter Email'/>
                  {errors.email && touched.email ? (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  ) : null}
              </div>
              <div className='flex flex-col mt-4 w-4/5 relative'>
                <label className='text-sm'>Password</label>
                <input 
                  className='p-2 border border-[#c1c1c1] rounded-md h-10 text-[#848484]'
                  type={isShowPassword ? "text":"password"} 
                  name='password'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder='Enter Password'/>
                  <button  className='text-normal text-sm absolute right-[14px] top-8 underline underline-offset-4'
                    type='button'
                    onClick={()=>setIsShowPassword(!isShowPassword)}>{isShowPassword ? "Hide" : "Show"}</button>
                    {errors.password && touched.password ? (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  ) : null}
              </div>
              <button type='submit'
                className='w-4/5 mt-8 rounded cursor-pointer bg-[#000000] text-[#ffffff]'>LOGIN</button>
                <hr className='w-4/5 my-6 border-t border-[#c1c1c1]' />
              <div className='flex gap-2 mt-1 items-center'>
                <span className='text-[#333333] text-base'>Dont have an account?</span>
                <span onClick={()=>router.push("/signup")}
                  className='cursor-pointer font-medium text-sm'>SIGN UP</span>
              </div>
            </div>
          </form>
        </div>
  )
}
