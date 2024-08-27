import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => Cookies.get('theme') || 'light');

    useEffect(() => {
        Cookies.set('theme', theme, { expires: 365 });
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
