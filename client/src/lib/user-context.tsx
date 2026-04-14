import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

interface UserContextType {
  currentUser: User | null;
  setCurrentUserId: (id: number) => void;
  currentUserId: number;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUserId: () => {},
  currentUserId: 1,
  refreshUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(1);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users", currentUserId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/users/${currentUserId}`);
      return res.json();
    },
  });

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId] });
  };

  return (
    <UserContext.Provider
      value={{
        currentUser: currentUser ?? null,
        setCurrentUserId,
        currentUserId,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
