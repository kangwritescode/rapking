// ** Type Import
import { IconProps } from '@iconify/react'

// ** Custom Icon Import
import { Icon } from '@iconify/react'

const UserIcon = ({ icon, ...rest }: IconProps) => {
  return <Icon icon={icon} {...rest} />
}

export default UserIcon
