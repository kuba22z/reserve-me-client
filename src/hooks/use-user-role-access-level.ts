import { useUserContext } from '@/components/core/UserProvider'
import { usePathname } from 'next/navigation'
import { RolePermissions } from '@/role-permissions'
import { Paths } from '@/paths'

export const useUserRoleAccessLevel = () => {
  const user = useUserContext()
  const pathname = usePathname()

  return RolePermissions.getAccessLevel(user.groups, Paths.removeLang(pathname))
}

export default useUserRoleAccessLevel
