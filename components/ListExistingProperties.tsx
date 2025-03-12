import { listAllProperties } from "@/appwrite/properties";
import { getUser } from "@/appwrite/users";
import { getPropertyUrl } from "@/appwrite/propertyStorage";
import { userContext } from "@/context/UserContext";
import { Models } from "appwrite";
import React, { useContext, useEffect, useState } from "react";
import PropertyCard from "./PropertyCard"; // Import reusable card

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

const ListExistingProperties = () => {
  const ctx = useContext(userContext);
  const [properties, setProperties] = useState<PropertyType[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (email: string) => {
    try {
      const host = await getUser(email);
      return host.data?.$id;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const fetchUserProperties = async () => {
    if (!ctx?.user?.email) return;

    setLoading(true);
    try {
      const hostId = await fetchUser(ctx.user.email);
      if (!hostId) return;

      const properties: Models.Document[] = await listAllProperties(hostId);

      const formattedProperties: PropertyType[] = await Promise.all(
        properties.map(async (property) => ({
          id: property.$id,
          hostId: property.hostId || "",
          location: property.location || "",
          city: property.city || "",
          coordinates: property.coordinates || [],
          securityDeposit: property.securityDeposit || 0,
          monthlyRent: property.monthlyRent || 0,
          images: (await fetchImageUrls(property.images || [])).filter((img): img is string => img !== null),
          facilities: property.facilities || [],
        }))
      );
      

      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch property image URLs
  const fetchImageUrls = async (imageIds: string[]) => {
    const urls = await Promise.all(
      imageIds.map(async (imageId) => {
        const result = await getPropertyUrl(imageId);
        return result.status ? result.data: "";
      })
    );
    return urls.filter(Boolean); // Remove empty URLs
  };

  useEffect(() => {
    fetchUserProperties();
  }, [ctx]);

  return (
    <div>
      <h1 className="py-4 text-center text-2xl font-bold text-gray-800 bg-gray-100 rounded-md shadow-md">
        View My Properties
      </h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : properties && properties.length > 0 ? (
        <div className="lg:flex lg:flex-col gap-5 py-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No properties found.</p>
      )}
    </div>
  );
};

export default ListExistingProperties;
