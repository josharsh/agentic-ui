import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from "@/common/api"; 
import { useRouter } from "next/router";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  user_type: string;
  organization_id: string;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.session.getUserDetails();
        if(userData instanceof Error){
          setUser(null);
          router.push("/signin");
        }
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router.asPath]);

  return (
    <UserContext.Provider value={{ user, loading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
