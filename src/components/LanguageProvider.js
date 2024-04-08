/*
import React, { createContext, useState } from 'react';
import * as i18n from "i18next";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const changeLanguage = async (lng) => {
        try{
            await i18n.changeLanguage(lng);
        }catch (e){
            console.log(e);
        }
        setLanguage(lng);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};*/
