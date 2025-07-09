"use client"
import React from 'react'
import { useState } from 'react'
// import Modal from '../Modal'
import { FaFilter } from "react-icons/fa";
import { Button } from '../ui/button';

const Filter = () => {
  const [open, setOpen] = useState(false)
  console.log(open)
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className='p-2 border cursor-pointer'
      >
        <FaFilter />
      </Button>
      hello my name is raj roka
    </div>
  )
}

export default Filter