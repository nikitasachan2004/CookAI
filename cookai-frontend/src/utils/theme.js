export const theme = {
  colors: {
    primary: {
      50: '#fbf2eb',
      100: '#f4d8c6',
      200: '#e8ba9f',
      300: '#d99470',
      400: '#c96f4b',
      500: '#b85c38',
      600: '#9f4729',
      700: '#83371f',
      800: '#692b18',
      900: '#4f2012',
    },
    secondary: {
      50: '#eef4ed',
      100: '#d8e5d6',
      200: '#b9d0b7',
      300: '#94b192',
      400: '#759173',
      500: '#5d7b5d',
      600: '#496149',
      700: '#384a38',
      800: '#2b392b',
      900: '#202b20',
    },
    accent: {
      50: '#fff6e8',
      100: '#f8e2b4',
      200: '#f2cc86',
      300: '#e9b35d',
      400: '#df9e41',
      500: '#d98f2b',
      600: '#bb7420',
      700: '#955817',
      800: '#754412',
      900: '#59330d',
    },
  },
  shadows: {
    glass: '0 28px 80px -38px rgba(74, 39, 18, 0.35)',
    soft: '0 18px 40px -26px rgba(88, 45, 15, 0.34)',
    medium: '0 22px 48px -28px rgba(88, 45, 15, 0.34)',
    large: '0 28px 80px -38px rgba(74, 39, 18, 0.35)',
  },
}

export const getContainerClass = (size = 'default') => {
  const baseClasses = 'mx-auto w-full px-4 sm:px-6 lg:px-8'

  switch (size) {
    case 'sm':
      return `${baseClasses} max-w-3xl`
    case 'md':
      return `${baseClasses} max-w-5xl`
    case 'lg':
      return `${baseClasses} max-w-6xl`
    case 'xl':
      return `${baseClasses} max-w-7xl`
    case 'full':
      return baseClasses
    default:
      return `${baseClasses} max-w-[88rem]`
  }
}

export const animations = {
  pageVariants: {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -12 },
  },
  cardVariants: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -6 },
  },
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
  listItemVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
}

export const transitions = {
  default: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.35,
  },
  fast: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.2,
  },
  spring: {
    type: 'spring',
    stiffness: 220,
    damping: 26,
  },
}

export const darkMode = {
  isDark: () => false,
  toggle: () => {},
  set: () => {},
  init: () => {},
}

export default theme
