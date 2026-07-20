import { usePermissionContext } from "./usePermissionContext"


export const usePermission = () => {
  const { permissions } = usePermissionContext()

  const hasPermission = (permissionName) => permissions.includes(permissionName)

  return {
    hasPermission,
  }
}
