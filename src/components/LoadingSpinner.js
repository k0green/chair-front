import React, {useContext} from 'react';
import '../styles/LoadingSpinner.css';
import {ThemeContext} from "./ThemeContext"; // Добавьте свой CSS для анимации

const LoadingSpinner = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={`loading-spinner ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
