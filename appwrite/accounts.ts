import { ID } from "appwrite";
import { account } from "./appwrite";
import { createUserDocument, getUser } from "./users";

export const createUser = async (
  email: string,
  password: string,
  name: string,
  role: string,
  phone?: string,
  profilePic?: string
) => {
  try {
    // Step 1: Create the user account
    await account.create(ID.unique(), email, password, name);

    // Step 2: Store user details in the database
    const resp = await createUserDocument(name, email, role, phone, profilePic);
    if (resp.status === 400) {
      return { message: "Cannot create user", status: 400 };
    }

    return { message: "User registered successfully.", status: 200 };
  } catch (error: any) {
    console.log("Error registering user:", error);
    return { message: "Please choose a different email, a user already exists with this email", status: 400 };
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    // Step 1: Create a session
    const session = await account.createEmailPasswordSession(email, password);
    
    // Step 2: Store session ID in local storage
    localStorage.setItem("sessionId", session.$id);

    // Step 3: Fetch user details
    const user = await getUser(email);
    if (user.status === 200) {
      return { message: "Login successful", data: user.data, status: 200 };
    } else {
      return { message: "Could not find user", status: 400 };
    }
  } catch (error: any) {
    return { message: "Invalid email or password", status: 401 };
  }
};

export const logOut = async (setUser: any, setIsLoggedIn: any) => {
  try {
    // Get session ID from local storage
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      throw new Error("No active session found.");
    }

    // Delete the stored session
    await account.deleteSession(sessionId);
    
    // Clear local storage
    localStorage.removeItem("sessionId");

    // Update UI state
    setUser(undefined);
    setIsLoggedIn(false);

    return { message: "Logout successful", status: 200 };
  } catch (error) {
    console.error("Logout error:", error);
    return { message: "Error logging out", status: 500 };
  }
};
