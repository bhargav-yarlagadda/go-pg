'use client';

import { getCurrentSession } from "@/appwrite/accounts";
import { getUser } from "@/appwrite/users";
import { createContext, useState, useEffect } from "react";

export type User = {
  name: string;
  email: string;
  role: string;
  phone?: string;
  profilePic?: string;
};

export type UserContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const userContext = createContext<UserContextType | undefined>(undefined);

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loggedIn, setIsLoggedIn] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem("user") !== null
  );

  useEffect(() => {
    const getFn = async () => {
      try {
        const session = await getCurrentSession();

        if (!session.status || !session.data?.email) {
          setUser(undefined);
          setIsLoggedIn(false);
          return;
        }

        const userResponse = await getUser(session.data.email);
        if (userResponse.status === 200 && userResponse.data) {
          const userData: User = {
            name: userResponse.data.name,
            email: userResponse.data.email,
            role: userResponse.data.role,
            phone: userResponse.data.phone,
            profilePic: userResponse.data.profilePic,
          };

          setUser(userData);
          setIsLoggedIn(true);
        } else {
          setUser(undefined);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(undefined);
        setIsLoggedIn(false);
      }
    };

    getFn();
   
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, loggedIn, setIsLoggedIn }}>
      {children}
    </userContext.Provider>
  );
};
