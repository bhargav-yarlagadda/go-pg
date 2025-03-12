import React, { useState } from "react";

interface PropertyType {
  id: string;
  hostId: string;
  location: string;
  city: string;
  coordinates?: number[];
  securityDeposit?: number;
  monthlyRent: number;
  images?: string[];
  facilities?: string[];
}

const PropertyCard: React.FC<{ property: Omit<PropertyType, "id"> }> = ({ property }) => {
  const [current, setCurrent] = useState(0);
  const images = property.images ?? [];

  return (
    <div className="flex flex-col bg-white/70 backdrop-blur-xl my-2 rounded-2xl shadow-xl border border-gray-200 overflow-hidden 
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      
      {/* Image Carousel */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-t-2xl">
        {images.length > 0 ? (
          <img
            src={images[current]}
            alt={`Property Image ${current + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EBE5C2] text-gray-600">
            No Image Available
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900/80"
            >
              ◀
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900/80"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 sm:p-5 bg-[#A3D1C6] md:p-6 flex flex-col gap-3">
        <p className="text-sm sm:text-base md:text-lg text-gray-600">{property.location}</p>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{property.city}</h2>
        {property.coordinates && (
          <p className="text-xs sm:text-sm text-gray-500">
            📍 Lat: {property.coordinates[0]}, Lng: {property.coordinates[1]}
          </p>
        )}
        <p className="mt-2 text-base sm:text-lg md:text-xl font-semibold text-blue-600">
          ${property.monthlyRent}/month
        </p>
        {property.securityDeposit && (
          <p className="text-sm sm:text-md text-gray-700">
            Deposit: ${property.securityDeposit}
          </p>
        )}

        {property.facilities && property.facilities.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm sm:text-md font-semibold text-gray-700">Facilities:</h3>
            <ul className="flex flex-wrap gap-2 mt-1">
              {property.facilities.map((facility, index) => (
                <li
                  key={index}
                  className="text-xs sm:text-sm bg-gray-200 px-3 py-1 rounded-full"
                >
                  {facility}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
