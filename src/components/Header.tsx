"use client"

import React, { useEffect, useState } from "react"
import { IoIosSearch } from "react-icons/io";
import { BsCart2 } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

export default function Header(){

    const router = useRouter();
    const [token,setToken] = useState<string | undefined>();
    const pathname = usePathname();
      
    const logoutHandler = async()=>{
        try {
            await fetch("/api/logout");
            router.push("/login");
            toast.success("Logout successfull");
        } catch (error:any) {
            toast.error(error.message);
        }
    }

    const getToken =()=>{
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];
        setToken(token || undefined);
    }

    useEffect(() => {
        getToken();
    }, [pathname]);

    return(
        <>
            <nav className="h-[100px] bg-[#ffffff] flex flex-col">
                <div className="flex justify-end gap-4 p-2 text-sm cursor-pointer pr-4">
                    <p>Help</p>
                    <p>Order & Return</p>
                    <p>Hi,John</p>
                </div>
                <div className="flex justify-between px-4 py-2 items-center">
                    <h1 className="text-2xl font-bold cursor-pointer" onClick={()=>router.push("/")}>ECOMMERCE</h1>
                    <div className="flex gap-x-8 font-semibold text-sm">
                        <span className="cursor-pointer">Categories</span>
                        <span className="cursor-pointer">Sale</span>
                        <span className="cursor-pointer">Clearance</span>
                        <span className="cursor-pointer">New Stock</span>
                        <span className="cursor-pointer">Trending</span>
                    </div>
                    <div className="flex gap-8 pr-4 items-center text-2xl">
                        <span className="cursor-pointer"><IoIosSearch title="Search"/></span>
                        <span className="cursor-pointer"><BsCart2 title="Cart"/></span>
                        { token &&
                            <span className="cursor-pointer" onClick={logoutHandler}>
                                <IoIosLogOut title="Logout"/>
                            </span>
                        }
                        
                    </div>
                </div>
            </nav>
            <div className="bg-[#f4f4f4] flex justify-center gap-6 h-8 items-center text-sm font-medium">
                <span>{"<"}</span>
                <span>Get 10% off on business signup</span>
                <span>{">"}</span>
            </div>
        </>
    )
}