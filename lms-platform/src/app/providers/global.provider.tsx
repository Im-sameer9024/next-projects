import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'


const GlobalProvider = ({children}:{
    children:React.ReactNode
}) => {
  return (
    <ClerkProvider>{children}</ClerkProvider>
  )
}

export default GlobalProvider