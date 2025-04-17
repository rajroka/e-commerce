"use client"
import React from 'react'
import { useState } from 'react'
import Modal from '../Modal'
import { FaFilter } from "react-icons/fa";

const Filter = () => {
    const[open , setOpen] = useState(false)
  return (
    <div>
        <button onClick={()=>setOpen(true)} className='p-2 border cursor-pointer '><FaFilter/></button>
       <Modal title={"hello world "} open={open}  setOpen={setOpen} >
       
           hello my name is raj roka 

    
        </Modal>
       
    </div>
  )
}

export default Filter