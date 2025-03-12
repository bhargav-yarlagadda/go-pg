import { database } from "./appwrite";
import { Query, ID } from "appwrite";

const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!DATABASE_ID || !COLLECTION_ID) {
  throw new Error("Missing ENV variables");
}

export const createUserDocument = async (
  name: string,
  email: string,
  role: string,
  phone?: string,
  profilePic?: string
) => {
  try {
    // Step 1: Check if the email already exists
    const existingUsers = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    if (existingUsers.documents.length > 0) {
      return {message:"user already exists",status:400}
    }

    // Step 2: Create user if email is unique
    const response = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(), // Use Appwrite's ID generator
      { 
        name,
        email,
        role,
        phone: phone || null,
        profilePic: profilePic || null,
      }
    );

    console.log("User created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};


export const getUser = async (email: string) => {
  try {
    const existingUsers = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    if (existingUsers.documents.length > 0) {
      return { message: "User found", data: existingUsers.documents[0], status: 200 };
    } else {
      return { message: "User not found", data: null, status: 404 };
    }
  } catch (error: any) {
    return { message: "Error fetching user", error: error.message, status: 500 };
  }
};