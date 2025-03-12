'use client'

import React, { useContext, Suspense, lazy } from 'react'
import { userContext } from '@/context/UserContext'
import Loader from '@/components/Loader' // Fallback loading component
const Hero = lazy(() => import('@/components/Hero'))
const Landing = lazy(() => import('@/components/Landing'))

const Page = () => {
  const ctx = useContext(userContext)
  if (!ctx) return null

  const { loggedIn } = ctx

  return (
    <Suspense fallback={<Loader />}>
    
      <Landing />
      {loggedIn && <Hero />}
    </Suspense>
  )
}

export default Page
