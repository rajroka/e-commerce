"use client"
import React from 'react'
import { useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { Button } from '../ui/button';

const Filter = () => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className='p-2 border cursor-pointer'
      >
        <FaFilter />
      </Button>
    </div>
  )
}

export default Filter

