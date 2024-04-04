import React, {useState, useContext } from 'react';
import { ThemeContext } from "./ThemeContext";
import CategoryItem from './CategoryItem';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import "../styles/CategoryItem.css";

const CategoryList = ({categories}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const { theme } = useContext(ThemeContext);

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
        <div className="category-container">
            <div className="pagination-arrow-container">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                    onClick={goToPreviousPage}
                />
            </div>
            <div className="category-list">
                {visibleCategories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        id={category.id}
                        name={category.name}
                        icon={category.icon}
                    />
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

