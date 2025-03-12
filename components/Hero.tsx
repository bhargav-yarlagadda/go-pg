'use client';

import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { userContext } from '@/context/UserContext';
import Loader from './Loader';
import Link from 'next/link';
const Hero = () => {
    const [isMounted, setIsMounted] = useState(false);
    const ctx = useContext(userContext);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isHost = ctx?.user?.role === 'host';
    const [activeTab, setActiveTab] = useState<'host' | 'guest'>(isHost ? 'host' : 'guest');

    if (!ctx || !isMounted) {
        return <Loader />;
    }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 text-white px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent pointer-events-none"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl -top-20 -left-40 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-3xl -bottom-10 -right-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Slider Switch */}
        <div className="flex justify-center mb-8">
          <div 
            className={`relative flex items-center bg-white/10 rounded-full p-1 w-[200px] h-12 shadow-md 
              ${!isHost ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <motion.div
              className="absolute h-10 w-24 bg-yellow-400 rounded-full shadow-inner"
              animate={{ x: activeTab === 'guest' ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => isHost && setActiveTab('guest')}
              className={`relative z-10 w-24 h-10 text-sm md:text-base font-semibold transition-colors duration-300 ${
                activeTab === 'guest' ? 'text-black' : 'text-white'
              }`}
            >
              Guest
            </button>
            <button
              onClick={() => isHost && setActiveTab('host')}
              className={`relative z-10 w-24 h-10 text-sm md:text-base font-semibold transition-colors duration-300 ${
                activeTab === 'host' ? 'text-black' : 'text-white'
              }`}
            >
              Host
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <motion.div
          key={activeTab}
          variants={tabVariants}
          className="bg-white/10 p-6 md:p-8 rounded-xl shadow-2xl backdrop-blur-lg border border-white/10"
        >
          {activeTab === 'guest' ? (
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Find Your Perfect <span className="text-yellow-300">PG Stay</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-md mx-auto">
                Discover and book comfortable PGs effortlessly.
              </p>
              <div className="mt-6 flex justify-center items-center gap-2">
                
                <Link href={'/search'} className="bg-yellow-400 px-44 cursor-pointer py-3 rounded-full font-semibold text-black hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-md">
                  Search
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                List Your <span className="text-yellow-300">PG Stay</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-md mx-auto">
                Share your PG and connect with tenants seamlessly.
              </p>
              <Link href={'/dashboard'} className="mt-6 bg-white text-purple-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                 your dashboard
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
