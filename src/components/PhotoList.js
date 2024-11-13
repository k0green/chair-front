import React, { useState, useContext, useRef } from 'react';
import { ThemeContext } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/CategoryItem.css";
import "../styles/ServiceCard.css";
import Photo from "../components/Photo";

const PhotoList = ({ photos, size }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const { theme } = useContext(ThemeContext);
    const totalPages = Math.ceil(photos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visiblePhotos = photos.slice(startIndex, endIndex);

    // Для отслеживания координат свайпа
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1));
    };

    // Обработчики для начала и окончания касания
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            // Свайп влево
            goToNextPage();
        }
        if (touchEndX.current - touchStartX.current > 50) {
            // Свайп вправо
            goToPreviousPage();
        }
    };

    return (
        <div className="category-container">
            <div
                className="category-list"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {visiblePhotos.map((photo) => (
                    <Photo key={photo.id} id={photo.id} url={photo.url} size={size} />
                ))}

                {photos.length > 1 && (
                    <div className="arrow-buttons">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPreviousPage();
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faChevronLeft}
                                className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                                style={{ color: "gray" }}
                            />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNextPage();
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                                style={{ color: "gray" }}
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoList;