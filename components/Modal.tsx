"use client"
import { div } from 'framer-motion/client'
import React from 'react'
import { RxCross1 } from "react-icons/rx";


const Modal = ({title , children , open = false , setOpen }) => {
  return (

     <div className={` ${open ? "block ": "hidden"}`}>
        <div className='w-screen h-svh bg-black/60 flex items-center inset-0 fixed  justify-center '>
        <div className='w-2/3 md:w-1/2 lg:w-1/3 h-2/3 bg-white rounded-md p-4'>
            <div className='w-full  flex items-center justify-between  '><h1 className='text-xl font-semibold text-center'>{title}</h1>
            <button onClick={()=>setOpen(false)}><RxCross1 className='' size={24}/></button></div>
            <div className='w-full h-0.5 bg-black/20 my-4'></div>
            <div className='flex flex-col gap-4'>
                {children}
            </div>

        </div>
    </div>
  
     </div>
  );
};

export default Modal;