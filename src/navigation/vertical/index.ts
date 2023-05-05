// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
    return [
        {
            title: 'Home',
            path: '/',
            icon: 'mdi:home-outline',
        },
        {
            title: 'Profile',
            path: '/user-profile/profile',
            icon: 'gg:profile',
        },
        {
            title: 'Explore',
            path: '/explore',
            icon: 'mdi:earth',
        },
        {
            title: 'Write',
            path: '/write',
            icon: 'ph:note-pencil-bold',
        },
    ]
}

export default navigation
