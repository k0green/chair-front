import "../styles/CategoryItem.css";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import IconComponent from "./IconComponent";
import { ThemeContext } from "./ThemeContext";
import EditServiceCard from "./EditServiceCard";
import AllChildrenCategory from "./AllChildrenCategory";

const CategoryItem = ({ id, name, icon, isEditServiceCard, userId, onSelectCategory }) => {
    const { theme } = useContext(ThemeContext);

    const handleCategoryClick = () => {
        if (isEditServiceCard) {
            onSelectCategory(id, name);
        }
    };

    return (
        <button
            className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"}
            onClick={handleCategoryClick}
        >
            <IconComponent iconName={icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"} />
            <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{name}</div>
        </button>
    );
};

export default CategoryItem;