// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FooterContent = () => {

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
        <LinkStyled target='_blank' href='https://mui.com/store/license/'>
          License
        </LinkStyled>
        <LinkStyled target='_blank' href='https://mui.com/store/contributors/themeselection/'>
          More Themes
        </LinkStyled>
        <LinkStyled
          target='_blank'
          href='https://demos.themeselection.com/marketplace/materio-mui-react-nextjs-admin-template/documentation'
        >
          Documentation
        </LinkStyled>
        <LinkStyled target='_blank' href='https://themeselection.com/support/'>
          Support
        </LinkStyled>
      </Box>
    </Box>
  )
}

export default FooterContent
