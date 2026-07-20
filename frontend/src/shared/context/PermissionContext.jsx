import { createContext, useContext } from "react";
import { useAuth } from "../../features/Auth/hooks/useAuth";

export const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();

  const permissions = user?.permissions || [];

  return (
    <PermissionContext.Provider value={{ permissions }}>
      {children}
    </PermissionContext.Provider>
  );
};
