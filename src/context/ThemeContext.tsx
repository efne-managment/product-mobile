import React from "react";
import * as SecureStore from 'expo-secure-store';
import { ThemeContextType } from "@/types/theme";
import { customDarkTheme, customLightTheme } from "@/constants/colors";

type ThemeName = 'light' | 'dark';

const ThemeContext = React.createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
    getDefaultColors: () => customLightTheme,
});

function ThemeProvider({ children }: any) {
    const [theme, setTheme] = React.useState<ThemeName>('light');

    const getTheme = async () => {
        const storedTheme = await SecureStore.getItemAsync('@efne-theme');

        if(storedTheme === 'light' || storedTheme === 'dark') {
            setTheme(storedTheme);
        }
    };

    React.useEffect(() => {
        getTheme();
    }, []);

    const toggleTheme = async () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        await SecureStore.setItemAsync('@efne-theme', nextTheme);
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
