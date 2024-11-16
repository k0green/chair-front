import React, {useState, useContext, useEffect} from 'react';
import { ThemeContext } from "./ThemeContext";
import CategoryItem from './CategoryItem';
import "../styles/CategoryItem.css";
import IconComponent from "./IconComponent";
import {useNavigate} from "react-router-dom";
import {getAllServiceTypes} from "./api";
import LoadingSpinner from "./LoadingSpinner";
import AllChildrenCategory from "./AllChildrenCategory";

const AllCategories = ({categories, isEditServiceCard, userId}) => {
    const [types, setCategories] = useState(categories);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { theme } = useContext(ThemeContext);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChildCategoryVisible, setIsChildCategoryVisible] = useState(false);

    const handleCategoryClick = async (id) => {
        await fetchData(id);
        setSelectedCategory(id);
        setIsChildCategoryVisible(true);
    };

    const fetchData = async (id) => {
        setIsEmpty(true);
        setIsLoading(true);
        const newData = await getAllServiceTypes(id);
        if (newData) {
            setCategories(newData);
            setIsEmpty(!newData);
            setIsLoading(false);
        } else {
            setCategories(null);
            setIsEmpty(true);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Данные не найдены</p>
            </div>
        );
    }

    return (
        <div className="all-category-type-container">
            {isChildCategoryVisible ?
                <AllChildrenCategory categories={types} isEditServiceCard={isEditServiceCard} userId = {userId}/>
            :
                <div className="all-category-list">
                    {types.map((category) => (
                        <button key={category.id} className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"} onClick={() => handleCategoryClick(category.id)}>
                            <IconComponent iconName={category.icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"}/>
                            <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{category.name}</div>
                        </button>
                    ))}
                </div>}
        </div>
    );
};

export default AllCategories;
