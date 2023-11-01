import React, {useContext} from 'react';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import {ThemeContext} from "../context/ThemeContext";
import "../styles/IconComponent.css";

const IconComponent = ({ iconName }) => {
    const Icon = FaIcons[iconName];
    const { theme } = useContext(ThemeContext);

    if (Icon) {
        return (
            <IconContext.Provider value={theme === "dark" ? { className: 'custom-icon-class-dark-theme' } : { className: 'custom-icon-class-light-theme' }}>
                <Icon />
            </IconContext.Provider>
        );
    }

    return null;
};

export default IconComponent;
