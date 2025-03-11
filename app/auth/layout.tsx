import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center px-6 sm:px-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full text-center lg:text-left mb-10 lg:mb-0 mt-10 lg:mt-0">
        <h1 className="text-5xl font-extrabold text-white leading-tight">
          Find Your Perfect <span className="text-blue-400">Paying Guest</span> Stay
        </h1>
        <p className="text-gray-300 mt-6 text-lg leading-relaxed">
          🌟 Connect with hosts and guests effortlessly. Whether you're searching for a place 
          or listing one, we make the process <span className="text-blue-400 font-semibold">simple</span> and 
          <span className="text-blue-400 font-semibold"> seamless</span>.
        </p>
        <p className="text-gray-300 mt-6 text-lg leading-relaxed">
          🏡 Explore a variety of <span className="text-blue-400 font-semibold">accommodations</span> tailored to your needs. 
          Enjoy a <span className="text-blue-400 font-semibold">smooth booking experience</span> and find a home away from home.
        </p>
        <p className="text-gray-300 mt-6 text-lg leading-relaxed">
          🔒 Secure, <span className="text-blue-400 font-semibold">verified listings</span> and a hassle-free stay experience. 
          <span className="text-blue-400 font-semibold">Sign up now</span> and start your journey with ease.
        </p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
};

export default Layout;
