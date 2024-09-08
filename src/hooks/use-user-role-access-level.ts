import { useUserContext } from '@/components/core/UserProvider'
import { usePathname } from 'next/navigation'
import { RolePermissions } from '@/role-permissions'

export const useUserRoleAccessLevel = () => {
  const user = useUserContext()
  const pathname = usePathname()

  return RolePermissions.getAccessLevel(user.groups, pathname)
}

export default useUserRoleAccessLevel
