'use client'
import React, { useContext } from 'react'
import UploadProperty from './UploadProperty'
import { userContext } from '@/context/UserContext'
import Loader from './Loader'
import ListExistingProperties from './ListExistingProperties'

const DashBoard = () => {
  const ctx = useContext(userContext)
  if(!ctx){
    return <Loader/>
  }
  if(ctx.user?.role !== 'host'){
    return 
  }

  return (
    <div className='w-full min-h-screen bg-white/90 py-2 grid grid-cols-1 lg:grid-cols-3'>
      <div className='col-span-1 '>
      <ListExistingProperties/>
      </div>
      <div className='col-span-1 lg:col-span-2 lg:px-16'>
      <UploadProperty/>
      </div>
    </div>
  )
}

export default DashBoard