import React, {useState, useContext, useEffect} from 'react';
import { ThemeContext } from "./ThemeContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import "../styles/CategoryItem.css";
import IconComponent from "./IconComponent";
import {useNavigate} from "react-router-dom";

const CategoryList = ({categories}) => {
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        const updateItemsPerPage = () => {
            const maxItems = Math.floor(window.innerWidth / 150);
            setItemsPerPage(maxItems);
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    const handleCategoryClick = async (id) => {
        navigate('/all-categories', { state: { parentId: id } });
    };

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const visibleCategories = categories.slice(startIndex, endIndex);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => {
            if (prevPage === 1) {
                return totalPages;
            } else {
                return prevPage - 1;
            }
        });
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => {
            if (prevPage === totalPages) {
                return 1;
            } else {
                return prevPage + 1;
            }
        });
    };

    return (
        <div className="category-type-container">
            <div className="pagination-arrow-container">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                    onClick={goToPreviousPage}
                />
            </div>
            <div className="category-list">
                {visibleCategories.map((category) => (
                    <button className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"} onClick={() => handleCategoryClick(category.id)}>
                        <IconComponent iconName={category.icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"} />
                        <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{category.name}</div>
                    </button>
                ))}
            </div>
            <div className="pagination-arrow-container">
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                    onClick={goToNextPage}
                />
            </div>
        </div>
    );
};

export default CategoryList;

