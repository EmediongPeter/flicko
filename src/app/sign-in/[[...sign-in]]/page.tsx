import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
  return (
      <div className='items-center justify-center flex m-auto'>
          <SignIn />
    </div>
  )
}
