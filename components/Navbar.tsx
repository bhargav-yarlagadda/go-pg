'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { userContext } from '@/context/UserContext';
import { logOut } from '@/appwrite/accounts';

const Navbar = () => {
  const ctx = useContext(userContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!ctx || !mounted) {
    return null; // Prevents mismatch by ensuring rendering happens after hydration
  }

  const { loggedIn ,user,setUser,setIsLoggedIn} = ctx;

  return (
    <div className="w-full h-16 flex items-center justify-between px-2 md:px-8 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-3 h-3 rounded-full bg-black"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <div className="w-3 h-3 rounded-full bg-black"></div>
        </div>
        <span className="text-lg font-semibold text-gray-800">
          GO<span className="text-blue-600">PG</span>
        </span>
      </div>

      {/* Authentication Links / User Info */}
      <div className="flex space-x-6 items-center">
        {loggedIn ? (
          <>
            <span className="text-gray-700 text-sm md:text-lg">{user?.name}</span>
            <button
              onClick={() => {
                logOut(setUser,setIsLoggedIn);
              }}
              className="px-4 py-2 border text-sm md:text-lg cursor-pointer border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href={'/auth/sign-in'} className="text-gray-700 text-sm md:text-lg flex items-center cursor-pointer hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link href={'/auth/sign-up'} className="px-4 py-2 border text-sm md:text-lg cursor-pointer border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
