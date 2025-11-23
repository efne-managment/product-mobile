import React from "react";
import * as SecureStore from 'expo-secure-store';
import { ThemeContextType } from "@/types/theme";
import { customDarkTheme, customLightTheme } from "@/constants/colors";

const ThemeContext = React.createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
    getDefaultColors: () => customLightTheme,
});

function ThemeProvider({ children }: any) {
    const [theme, setTheme] = React.useState('light');

    const getTheme = async () => {
        const theme = await SecureStore.getItemAsync('@efne-theme');

        if(theme) { 
            setTheme(theme);
        }
    };

    React.useEffect(() => {
        getTheme();
    }, []);

    const toggleTheme = async () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        await SecureStore.setItemAsync('@efne-theme', theme);
    };

    const getDefaultColors = () => {
        return theme === 'light' ?  customLightTheme : customDarkTheme;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, getDefaultColors }}>
            {children}
        </ThemeContext.Provider>
    );
}

const useThemeContext = () => React.useContext(ThemeContext);

export { ThemeProvider, useThemeContext };