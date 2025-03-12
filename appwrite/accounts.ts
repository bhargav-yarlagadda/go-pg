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
    // Check for an existing session before creating a new one
    const existingSession = await account.getSession("current").catch(() => null);
    
    if (existingSession) {
      console.log("User already logged in, using existing session.");
    } else {
      // Step 1: Create a session only if none exists
      const session = await account.createEmailPasswordSession(email, password);
      localStorage.setItem("sessionId", session.$id);
    }

    // Step 2: Fetch user details
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
    const session = await account.get().catch(() => null); // Handle missing session
    console.log(session)
    if (session) {
      await account.deleteSession("current");
      console.log("Session deleted successfully.");
    } else {
      console.warn("No active session found.");
    }

    setUser(undefined);
    setIsLoggedIn(false);
  } catch (error) {
    setUser(undefined);
    setIsLoggedIn(false);
    console.log("Logout error:", error);
  }
};


export const getCurrentSession = async ()=>{
  try {
    const session = await account.get()
  if(!session){
    return {status:false}
  }
  return {status:true,data:session}
  } catch (error) {
    return {status:false}
    
  }
}