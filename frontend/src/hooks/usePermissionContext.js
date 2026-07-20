import { useContext } from "react";
import { PermissionContext } from "../context/PermissionContext";


export const usePermissionContext = () => {
  const context = useContext(PermissionContext)

  if(!context){
    throw new Error('usePermissionContext must be used within a PermissionProvider')
  }
  return context
}