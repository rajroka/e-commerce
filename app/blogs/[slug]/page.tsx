import React from 'react'
import { allBlogsById } from '@/app/api/Allblog'
const page = async ({ params }: { params: { slug: string } }) => {
  
  const id = params.slug
  
       const product = await allBlogsById(id)
       console.log("PARAM:", id);

  return (
    <div>
      <img src={product.imageUrls || "default-image.jpg"} alt={product.title} className="w-full object-cover h-60 rounded-md" />
      {product.title}
    </div>
  )
}

export default page