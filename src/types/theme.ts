export type ThemeColors = {
    primary: string;
    primaryLight: string;

    danger: string;
    dangerLight: string;

    success: string;
    successLight: string;

    warning: string;
    warningLight: string;

    grayLight: string;
    grayDark: string;
    grayMedium: string;
    grayDarker: string;
    grayDarkest: string;

    white: string;
    black: string;

    text: string;
    textButton: string;


  inputBackground: string;    
  placeholderColor: string; 
  modalBackground: string;  
  background: string;  
};

export type ThemeObject = {
    colors: ThemeColors;
};


export type ThemeContextType = {
    theme: string;
    toggleTheme: () => void;
    getDefaultColors: () => ThemeObject;
}