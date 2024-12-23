import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <label>
            <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() => toggleTheme()}
            />
        </label>
    );
};

export default ThemeSwitcher;
