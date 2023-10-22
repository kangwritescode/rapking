// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import Typography from '@mui/material/Typography'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem';

// ** Icon Imports
import { Icon } from '@iconify/react'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Util Import
import { api } from 'src/utils/api'
import Notification from './Notification'
import { CircularProgress, Stack } from '@mui/material'

export type NotificationsType = {
  meta: string
  title: string
  subtitle: string
} & (
    | { avatarAlt: string; avatarImg: string; avatarText?: never; avatarColor?: never; avatarIcon?: never }
    | {
      avatarAlt?: never
      avatarImg?: never
      avatarText: string
      avatarIcon?: never
      avatarColor?: ThemeColor
    }
    | {
      avatarAlt?: never
      avatarImg?: never
      avatarText?: never
      avatarIcon: ReactNode
      avatarColor?: ThemeColor
    }
  )
interface Props {
  settings: Settings
  notifications: NotificationsType[]
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
export const StyledMenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = (props: Props) => {

  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  // ** Query
  const { data: notifications, isLoading: getNotificationsIsLoading } = api.notifications.getUserNotifications.useQuery();

  // ** Mutations
  const { mutate: markAllAsRead } = api.notifications.markAllNotificationsAsRead.useMutation();
  const { mutate: deleteAllUserNotifications, isLoading } = api.notifications.deleteAllUserNotifications.useMutation();

  // ** Invalidators
  const { invalidate: invalidateNotifications } = api.useContext().notifications.getUserNotifications;

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    invalidateNotifications();
    markAllAsRead(undefined);
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
    invalidateNotifications();
  }

  const clearAllButtonHandler = () => {
    deleteAllUserNotifications(undefined, {
      onSuccess: () => {
        invalidateNotifications();
        handleDropdownClose();
      }
    })
  }

  const hasUnreadNotifications = notifications?.some(notification => !notification.read);

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant='dot'
          invisible={!hasUnreadNotifications}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Icon icon='mdi:bell-outline' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <StyledMenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              color='secondary'
              label={`${notifications?.length || 0} New`}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </StyledMenuItem>
        <ScrollWrapper hidden={hidden}>
          {notifications?.map((notification) =>
            <Notification
              closeDropdown={handleDropdownClose}
              key={notification.id}
              notification={notification}
            />)}
          {!notifications?.length && !getNotificationsIsLoading && (
            <StyledMenuItem
              disableRipple
              disableTouchRipple
              sx={{
                py: 3.5,
                borderBottom: 0,
                pointerEvents: 'none',
                borderTop: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                No new notifications
              </Typography>
            </StyledMenuItem>
          )}
        </ScrollWrapper>
        {notifications?.length ? (
          <StyledMenuItem
            disableRipple
            disableTouchRipple
            sx={{
              borderBottom: 0,
              cursor: 'default',
              userSelect: 'auto',
              backgroundColor: 'transparent !important',
              borderTop: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Button
              disabled={!notifications?.length || isLoading}
              fullWidth
              variant='contained'
              onClick={clearAllButtonHandler}
              sx={{ my: 2 }}
            >
              {isLoading ? <CircularProgress color='inherit' size='1.5rem' /> : 'Clear all'}
            </Button>
          </StyledMenuItem>
        ) : undefined}
        {getNotificationsIsLoading ? (
          <Stack alignItems='center' justifyContent='center' py='1rem'>
            <CircularProgress color='inherit' size='1.5rem' />
          </Stack>
        ) : undefined}
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
