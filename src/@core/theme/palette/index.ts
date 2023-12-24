// ** Type Imports
import { Palette } from '@mui/material';
import { Skin, ThemeColor } from 'src/@core/layouts/types';

// BG Color: #2A2D34
// Slighty Lighter BG Color: #30343c

const DefaultPalette = (mode: Palette['mode'], skin: Skin, themeColor: ThemeColor): Palette => {
  // ** Vars
  const whiteColor = '#FFF';
  const lightColor = '58, 53, 65';
  const darkColor = '255, 255, 255';
  const mainColor = mode === 'light' ? lightColor : darkColor;

  const primaryGradient = () => {
    if (themeColor === 'primary') {
      return '#334657';
    } else if (themeColor === 'secondary') {
      return '#9C9FA4';
    } else if (themeColor === 'success') {
      return '#93DD5C';
    } else if (themeColor === 'error') {
      return '#FF8C90';
    } else if (themeColor === 'warning') {
      return '#FFCF5C';
    } else {
      return '#6ACDFF';
    }
  };

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor;
    } else if (skin === 'bordered' && mode === 'dark') {
      return '#312D4B';
    } else if (mode === 'light') {
      return '#F4F5FA';
    } else return '#121212';
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      primaryGradient: primaryGradient(),
      bodyBg: mode === 'light' ? '#F4F5FA' : '#28243D',
      trackBg: mode === 'light' ? '#F0F2F8' : '#474360',
      avatarBg: mode === 'light' ? '#F0EFF0' : '#3F3B59',
      darkBg: skin === 'bordered' ? '#312D4B' : '#28243D',
      lightBg: skin === 'bordered' ? whiteColor : '#F4F5FA',
      tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#3D3759'
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor
    },
    primary: {
      light: '#7c9bb3',
      main: '#5b7b97',
      dark: '#405865',
      contrastText: whiteColor
    },
    secondary: {
      light: '#b89a7d',
      main: '#97775B',
      dark: '#754f3b',
      contrastText: whiteColor
    },
    error: {
      light: '#FF6166',
      main: '#FF4C51',
      dark: '#E04347',
      contrastText: whiteColor
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: whiteColor
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: whiteColor
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: whiteColor
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161'
    },
    text: {
      primary: `rgba(${mainColor}, 1)`,
      secondary: `rgba(${mainColor}, 0.8)`,
      disabled: `rgba(${mainColor}, 0.4)`
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === 'light' ? whiteColor : '#242424',
      default: defaultBgColor()
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  } as Palette;
};

export default DefaultPalette;
