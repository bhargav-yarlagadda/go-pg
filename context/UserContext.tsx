'use client';

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
  const [user, setUser] = useState<User | undefined>(() => {
    if (typeof window !== "undefined") { // ✅ Ensure it's running in the browser
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : undefined;
    }
    return undefined;
  });

  const [loggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return typeof window !== "undefined" && localStorage.getItem("user") !== null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") { // ✅ Prevents Next.js hydration errors
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    }
  }, [user]);

  return (
    <userContext.Provider value={{ user, setUser, loggedIn, setIsLoggedIn }}>
      {children}
    </userContext.Provider>
  );
};
