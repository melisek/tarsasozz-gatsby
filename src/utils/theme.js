export const colors = {
    blue: `#2202a9`,
    darkBlue: `#190c65`,
    darkerBlue: `#150956`,
    darkestBlue: `#0f073b`,
    lightBlue: `#1f59cd`,
    lighterBlue: `#279AF1`,
    lightestBlue: `#83aaff`,
  
    green: `#3f7912`,
    darkGreen: `#0c511a`,
    lightGreen: `#00d69b`,
    paleDarkGreen: `#104F55`,
  
    yellow: `#f9ff00`,
    darkYellow: `#edbf2e`,
    lightYellow: `#fbff6c`,
  
    orange: `#efbf00`,
    darkOrange: `#ff9100`,
    darkerOrange: `#ff7600`,
    lightOrange: `#ffbe41`,
  
    gray: `#464849`,
    darkGray: `#3d3d3d`,
    darkerGray: `#1a1d23`,
    darkestGray: `#060606`,
    lightGray: `#bcbcbc`,
    lighterGray: `#d9e6ed`,
    lightestGray: `#fdfeff`
  }
  
  export const measures = {
    maxWidth: `40em`,
  
    smallBorder: `0.1em`,
    mediumBorder: `0.15em`,
    largeBorder: `0.2em`,
  
    smallBorderRadius: `0.2em`,
    mediumBorderRadius: `0.5em`,
    largeBorderRadius: `1em`
  }
  
  export const theme = { ...colors, ...measures }
  
  export const lightTheme = {
    background: theme.lightestGray,
    textColor: `#444471`,
    // Used in blockquotes and alternating table rows.
    accentBackground: theme.lightestGray,
  
    links: theme.blue,
    hoveredLinks: theme.orange,
  
    shadowColor: theme.lighterGray,
    borderColor: theme.lighterGray,
  
    headerBg: theme.darkerBlue,
    footerBg: theme.darkerGray,
  
    buttonBg: theme.blue,
    hoveredButtonBg: theme.lightBlue,
    grayButtonBg: theme.lightestGray,
    grayHoveredButtonBg: theme.orange,
  
    inlineCodeColor: theme.lighterGray,
  }
  
  export const darkTheme = {
    background: theme.darkerGray,
    textColor: theme.lighterGray,
    accentBackground: theme.darkestGray,
  
    links: theme.lighterBlue,
    hoveredLinks: theme.orange,
  
    shadowColor: `black`,
    borderColor: `black`,
  
    headerBg: theme.darkestBlue,
    footerBg: theme.darkestGray,
  
    buttonBg: theme.darkerOrange,
    hoveredButtonBg: theme.darkOrange,
    grayButtonBg: theme.darkGray,
    grayHoveredButtonBg: theme.orange,
  
    inlineCodeColor: theme.darkestGray,
  }
  
  export default darkMode =>
    darkMode ? { ...theme, ...darkTheme } : { ...theme, ...lightTheme }
  