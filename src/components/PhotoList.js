import React, { useRef, useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/CategoryItem.css";
import "../styles/ServiceCard.css";
import Photo from "../components/Photo";

const PhotoList = ({ photos, size }) => {
    const { theme } = useContext(ThemeContext);
    const scrollContainerRef = useRef(null);

    // Для отслеживания координат свайпа
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const scrollToPrevious = () => {
        const container = scrollContainerRef.current;
        container.scrollBy({
            left: -size, // Прокручиваем на ширину одного фото
            behavior: "smooth",
        });
    };

    const scrollToNext = () => {
        const container = scrollContainerRef.current;
        container.scrollBy({
            left: size, // Прокручиваем на ширину одного фото
            behavior: "smooth",
        });
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
            scrollToNext();
        }
        if (touchEndX.current - touchStartX.current > 50) {
            // Свайп вправо
            scrollToPrevious();
        }
    };

    return (
        <div className="photos-container">
            <div
                className="photos-list"
                ref={scrollContainerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {photos.map((photo) => (
                    <Photo key={photo.id} id={photo.id} url={photo.url} size={size} />
                ))}
            </div>
            {photos.length > 1 && (
                <div className="arrow-buttons">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            scrollToPrevious();
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
                            scrollToNext();
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
    );
};

export default PhotoList;
