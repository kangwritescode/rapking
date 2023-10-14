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
      <LinkStyled sx={{mr: 5}} target='_blank' href='https://blank.com' onClick={(e) => e.preventDefault()}>
        Provide Feedback
      </LinkStyled>
      <LinkStyled target='_blank' href='https://discord.gg/fcMURpEc'>
        Join the Rapking Discord
      </LinkStyled>
    </Box>
  )
}

export default FooterContent
