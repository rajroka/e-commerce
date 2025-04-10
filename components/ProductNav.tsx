import Link from 'next/link'
import React from 'react'

const ProductNav = () => {
  return (
    <div className=' flex items-center justify-center gap-8 h-16 bg-gray-200 text-black  px-6 md:px-12 lg:px-24'>
        
     <Link href="">Shop All</Link>   
     <Link href="">Computers</Link>   
     <Link href="">Tablets</Link>   
     <Link href="">Drones & cameras</Link>   
     <Link href="">Audio </Link>   
     <Link href="">Mobile </Link>   
     <Link href=""> T.V & Home Cinema</Link>   
     <Link href="">Mobile </Link>   
     <Link href="">Wearable Tech  </Link>   
     <Link href="">Sale </Link>   
    
   
    </div>
  )
}

export default ProductNav