import {  database } from "./appwrite";
import { ID, Query } from "appwrite";
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROPERTY_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!DATABASE_ID || !COLLECTION_ID) {
  throw new Error("Missing ENV variables");
}

const createProperty = async (data: {
  hostId: string;
  location: string;
  city: string;
  coordinates?: number[];
  securityDeposit?: number;
  monthlyRent: number;
  images?: string[]; // Expecting image IDs
  facilities?: string[];
}) => {
  try {
    // Create property document in Appwrite database
    const property = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
    return property;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export default createProperty;




export const listAllProperties = async (hostId: string) => {
    if (!hostId) {
      console.error("Error: hostId is missing when fetching properties.");
      return [];
    }
  
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("hostId", hostId),
      ]);
      return response.documents; // Returns an array of properties
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  };