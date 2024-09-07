"use client"

import React from 'react'
import { useRouter } from 'next/navigation';
import { useFormik } from "formik";
import { signupSchema } from '../../schemas/signupSchema';
import { toast } from "react-hot-toast";

const initialValues ={
  name:"",
  email:"",
  password:""
}

export default function Signup() {

  const router = useRouter();

  const { values,errors,handleChange,handleSubmit,handleBlur, touched,resetForm } = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit : async(values)=>{

      try {
        // call signup api
        const response = await fetch("/api/signup",{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(values)
        });

        if(!response.ok){
          const data : {message?:string} = await response.json() as {message?:string};
          toast.error(data.message ?? "An error occured")
        }

        resetForm();
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        toast.success("Signup successfull. Please verify your email");

      } catch (error) {
        toast.error((error as Error).message);
        console.error(error)
      }
    }
});

  return (
        <div className='flex justify-center items-center mt-8'>
          <form 
            onSubmit={handleSubmit} 
            className='h-[500px] w-[450px] border-2 border-[#c1c1c1] rounded-2xl'>
            <div className='h-full flex flex-col items-center lh leading-[3]'>
              <h2 className='text-2xl font-semibold mt-8'>Create Your Account</h2>
              <div className='flex flex-col mt-4 w-4/5'>
                <label className='text-sm'>Name</label>
                <input 
                  className='p-2 border border-[#c1c1c1] rounded-md h-10 text-[#848484]'
                  type="text" 
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Enter Name'/>
                  {errors.name && touched.name ? (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                  ) : null}
              </div>
              <div className='flex flex-col mt-4 w-4/5'>
                <label className='text-sm'>Email</label>
                <input 
                  className='p-2 border border-[#c1c1c1] rounded-md h-10 text-[#848484]'
                  type="email" 
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Enter Email'/>
                  {errors.email && touched.email ? (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  ) : null}
              </div>
              <div className='flex flex-col mt-4 w-4/5'>
                <label className='text-sm'>Password</label>
                <input 
                  className='p-2 border border-[#c1c1c1] rounded-md h-10 text-[#848484]'
                  type="password" 
                  name='password'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Enter Password'/>
                  {errors.password && touched.password ? (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  ) : null}
              </div>
              <button type="submit" className='w-4/5 mt-8 rounded cursor-pointer bg-[#000000] text-[#ffffff]'>CREATE ACCOUNT</button>
              <div className='flex gap-2 mt-6 items-center'>
                <span className='text-[#333333] text-base'>Have an account?</span>
                <span onClick={()=>router.push("/login")}
                  className='cursor-pointer font-medium text-sm'>LOGIN</span>
              </div>
            </div>
          </form>
      </div>
  )
}

