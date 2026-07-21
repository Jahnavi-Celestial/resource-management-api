import { createContext, useContext, useMemo } from "react";
import { useAuth } from "../../features/Auth/hooks/useAuth";

export const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();

  const permissions = useMemo(() => user?.permissions || [], [user]);

  const contextValue = useMemo(() => ({
    permissions
  }), [permissions]);

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};
