'use client'
import React, { useContext, useEffect } from 'react'
import UploadProperty from './UploadProperty'
import { userContext } from '@/context/UserContext'
import Loader from './Loader'
import ListExistingProperties from './ListExistingProperties'
import { useRouter } from 'next/navigation'
import { getUser } from '@/appwrite/users'

const DashBoard = () => {
  const router = useRouter()
  const ctx = useContext(userContext);
  

  useEffect(() => {
    if (!ctx) return;
  
    if (!ctx.user || ctx.user.role != "host" ) {
      router.push("/");
    }
  }, [ctx, router]);
  

  return (
    <div className='w-full min-h-screen bg-[#EDE8DC] py-2 grid grid-cols-1 lg:grid-cols-3'>
      <div className='col-span-1 max-h-screen overflow-y-scroll px-2' style={{scrollbarWidth:'none'}}>
      <ListExistingProperties/>
      </div>
      <div className='col-span-1 lg:col-span-2 lg:px-16'>
      <UploadProperty/>
      </div>
    </div>
  )
}

export default DashBoard