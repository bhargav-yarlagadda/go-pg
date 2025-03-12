
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className=" bg-gray-900 text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-6xl font-extrabold text-blue-500 text-center drop-shadow-lg">Find Your Perfect PG!</h1>
      <p className="text-xl text-gray-300 text-center max-w-2xl leading-relaxed">
        Connecting PG Seekers with PG Hosts Effortlessly. Search, Compare, and Book with Ease.
      </p>
      <div className="relative mt-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-10">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-0 bg-blue-400 opacity-30 blur-lg rounded-xl"></div>
          <Image 
            src="/about.png" 
            alt="PG Search" 
            width={600} 
            height={400} 
            className="relative w-full rounded-xl shadow-xl"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-blue-400 mb-4">Why Choose Us?</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            We help you find the best PG accommodations with ease. Compare prices, read reviews, and connect directly with PG hosts.
          </p>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>✅ Verified Listings</li>
            <li>✅ Affordable Prices</li>
            <li>✅ Instant Booking</li>
            <li>✅ Safe & Secure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
