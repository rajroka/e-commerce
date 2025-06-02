import React from 'react'

const page = async ({params }) => {
    const id = (await params).slug || [];
    
  return (
    <div>slug id {id} </div>
  )
}

export default page