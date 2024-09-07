"use client"

import { useRouter } from "next/navigation";
import React,{ useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";


interface Category {
  id: number;
  name: string;
}

interface UserCategories{
  category:{
    id:number,
    name:string
  }
}

interface User{
  id:number,
  name:string,
  email:string,
  userCategories:UserCategories[]
}

interface CategoryResponse{
  categories:Category[],
  page:number,
  totalPages:number
}

export default function HomePage() {

  const [categories,setCategories] = useState<Category[]>([]);
  const [selectedCategories,setSelectedCategories] = useState<number[]>([]);
  const [page,setPage] = useState<number>(1);
  const [totalPages,setTotalPages] = useState<number>(1);

  const router = useRouter();

  const fetchUser = async() : Promise<void>=>{
    try {
        const response = await fetch("/api/user");
        const user = await response.json() as User;
        console.log(user);
        const userCategories:number[] = user.userCategories.map((uc)=> uc.category.id);
        setSelectedCategories(userCategories);

    } catch (error) {
        toast.error((error as Error).message);
    }
  }

  const fetchCategories = async(page:number) : Promise<void>=>{
    try {
      const response = await fetch(`/api/categories?page=${page}&limit=6`);
      const data = await response.json() as CategoryResponse;
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
        toast.error((error as Error).message);
    }
  };


  const handleCategoryChange =(categoryId:number)=>{
    setSelectedCategories(
      (prevCategories)=> 
        prevCategories.includes(categoryId) 
          ? prevCategories.filter(id => id !== categoryId) 
          : [...prevCategories,categoryId]
        )
  }

  const handlePage=(page:number)=>{
    setPage(page);
  }

  const pageNumbers:number[] = [];

  for(let i= page-3;i<=page+3;i++){
    if(i<1) continue
    if(i> totalPages) break

    pageNumbers.push(i);
  }


  const updateUserCategories = async()=>{
    try {
      const response = await fetch("/api/user-categories",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ categoryIds: selectedCategories}),
        credentials:"include"
      });

      if (response.ok) {
        console.log("User categories updated successfully");
      } else {
        toast.error("Failed to update user categories");
      }
    } catch (error) {
        toast.error((error as Error).message);
    }
  }

  useEffect(()=>{
    void fetchUser();
  },[]);

  useEffect(()=>{
    void fetchCategories(page);
  },[page]);

  useEffect(()=>{
    if(selectedCategories.length >=1 ){
       void updateUserCategories();
    }
  },[selectedCategories]);

  return (
    <div className='flex justify-center s mt-8'>
      <div
          className='h-[480px] w-[450px] border-2 border-[#c1c1c1] rounded-2xl'>
          <div className='h-full flex flex-col items-center lh leading-[3]'>
          <h2 className='text-2xl font-semibold mt-8'>Please mark your interests!</h2>
          <div className='text-sm font-normal mt-6'>
              We will keep you notified.
          </div>

          <div className="mt-8 font-medium text-lg w-full ml-28">
             My Saved Interests!
             {
              categories.map((category:{id:number,name:string},index)=>(
                <div key={index} className="flex gap-2 items-center leading-tight mt-2">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 accent-black"
                    checked={selectedCategories.includes(category.id)}
                    onChange={()=>handleCategoryChange(category.id)}
                  />
                  <span className="font-normal text-base">{category.name}</span>
                </div>
              ))
             }
            
          </div>

          {/* Pagination controls */}
          <div className="mt-14 font-semibold text-base w-full ml-28 flex gap-3 text-[#acacac]">
            <button disabled>{"<<"}</button>
            <button 
              disabled={page === 1}
              onClick={()=>handlePage(page-1)}>
                {"<"}
            </button>
            {
              pageNumbers.map((pageNum,index)=>(
                <button 
                  key={index}
                  className={page === pageNum ? "text-black" :""}
                  onClick={()=>handlePage(pageNum)}>
                    {pageNum}
                </button>
              ))
            }
            <button 
              disabled={page === totalPages}
              onClick={()=>handlePage(page+1)}>
                {">"}
            </button>
            <button disabled>{">>"}</button>
          </div>
        </div>
      </div>

      <button className="fixed bottom-20 right-24 p-2 rounded text-white bg-black"
        onClick={()=> router.push("/game")}>
          Play Game
      </button>
    </div>
  );
}
