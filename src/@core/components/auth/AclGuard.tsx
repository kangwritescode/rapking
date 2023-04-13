// ** React Imports
import { ReactNode } from 'react'

// ** Types
import type { ACLObj } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'
import { AnyAbility } from '@casl/ability'

interface AclGuardProps {
  children: ReactNode
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children } = props

  // ** Hooks
  const auth = 'guest' // NextAuth useAuth()

  // ** Vars
  const ability: AnyAbility = buildAbilityFor(auth, aclAbilities.subject)

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}

export default AclGuard
