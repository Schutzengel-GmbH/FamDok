import { Organization, User } from "@prisma/client";
import { createContext, useContext } from "react";
import { useUserData } from "../../utils/authUtils";

interface IUserContext {
  user: (User & { organization: Organization }) | null;
}

export const UserContext = createContext<IUserContext>({ user: null });

export function UserContextProvider({ children }) {
  const { user } = useUserData();
  const value = { user: user ?? null };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

const useUserContext = () => useContext(UserContext);

export default useUserContext;
