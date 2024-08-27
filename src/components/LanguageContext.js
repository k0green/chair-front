import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(Cookies.get('language') || 'ru');

    useEffect(() => {
        Cookies.set('language', language, { expires: 365 });
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
