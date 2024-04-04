import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/CategoryItem.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import IconComponent from "./IconComponent";
import { ThemeContext } from "./ThemeContext";


const CategoryItem = ({ id, name, icon }) => {

    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [darkTheme, setDarkTheme] = useState(false);

    const handleCategoryClick = () => {
        navigate('/collection/category/'+id);
    };

    return (
        <button className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"} onClick={handleCategoryClick}>
            <IconComponent iconName={icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"}/>
            <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{name}</div>
        </button>
    );
};

export default CategoryItem;