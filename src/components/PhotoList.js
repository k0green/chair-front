import React, {useState, useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import "../styles/CategoryItem.css";
import "../styles/ServiceCard.css";
import Photo from "../components/Photo";

const PhotoList = ({photos}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const { theme } = useContext(ThemeContext);

    const totalPages = Math.ceil(photos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const visiblePhotos = photos.slice(startIndex, endIndex);

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
            <div className="category-list">
                {visiblePhotos.map((photo) => (
                    <Photo
                        id={photo.id}
                        url={photo.url}
                    />
                ))}
                {photos.length > 1 && (
                    <div className="arrow-buttons">
                        <button onClick={goToPreviousPage}><FontAwesomeIcon
                            icon={faChevronLeft}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray" }}
                        /></button>
                        <button onClick={goToNextPage}><FontAwesomeIcon
                            icon={faChevronRight}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray"}}
                        /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoList;

