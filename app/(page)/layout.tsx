import React from 'react'
import Nav from '@/components/Nav'
const layout = ({children} : { children : React.ReactNode}) => {
  return (
   <>
    <Nav />
    {children}
   </>
  )
}

export default layout