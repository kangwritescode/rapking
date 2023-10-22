// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.grey[400],
}))

const FooterContent = () => {

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
      <LinkStyled target='_blank' href='https://discord.gg/G5A3N4qm'>
        Join the Rapking Discord
      </LinkStyled>
    </Box>
  )
}

export default FooterContent
