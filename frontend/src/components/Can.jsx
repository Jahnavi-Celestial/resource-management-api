import { usePermission } from "../hooks/usePermission";

export const Can = ({ permission, children }) => {
  const { hasPermission } = usePermission()

  if (!hasPermission(permission)) {
    return null
  }

  return children
}
