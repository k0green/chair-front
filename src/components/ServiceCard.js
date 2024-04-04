import React, {useContext, useState} from 'react';
import '../styles/ServiceCard.css';
import {
    faBoltLightning, faChevronLeft, faChevronRight,
    faClock,
    faHouse,
    faLightbulb, faPencil,
    faStar,
    faTimes,
    faTimesCircle, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Подключаем файл стилей
import PhotoList from "../components/PhotoList";
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "./ThemeContext";

const ServiceCard = ({ service, isProfile }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { id, name, masters } = service;

    const handleOrderClick = (executorServiceId) => {
        navigate("/calendar/"+ executorServiceId);
    };

    let handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const handleIsProfileClick = (executorServiceId) => {
        navigate("/service-card/edit/" + executorServiceId);
    };

    const handleRemoveClick = (id) => {
        navigate("/service-card/remove/" + id);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(masters.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const visibleCategories = masters.slice(startIndex, endIndex);

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
            <div className="card-list">
                {visibleCategories.map((master) => (
                    <div className={`service-card ${theme === 'dark' ? 'dark' : ''}`}>
                        <div key={master.id} className="master-card">
                            <div className="photos">
                                <PhotoList photos={master.photos}/>
                            </div>
                            <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                                <h4 onClick={() => handleMasterNameClickClick(master.executorId)}>{master.name}</h4>
                                <h4>{master.rating} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></h4>
                            </div>
                            <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                                <p>{master.description}</p>
                                <p><FontAwesomeIcon icon={faHouse} className = 'item-icon'/>{master.address}</p>
                                <p>Available Slots: {master.availableSlots}</p>
                            </div>
                            <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                                <h4><FontAwesomeIcon icon={faClock} className = 'item-icon'/> {master.duration}</h4>
                                <h4>{master.price} Byn</h4>
                            </div>
                            <div>
                                {isProfile ?
                                    <div>
                                        <button className="order-button" onClick={()=>handleIsProfileClick(service.id)}>
                                            <p className="order-text"><FontAwesomeIcon icon={faPencil} />    Редактировать</p>
                                        </button>
                                        <br/>
                                        <br/>
                                        <button className="order-button" onClick={()=>handleRemoveClick(service.id)}>
                                            <p className="order-text"><FontAwesomeIcon icon={faTrash} />    Удалить</p>
                                        </button>
                                    </div>
                                    :
                                    <button className="order-button" onClick={()=>handleOrderClick(master.id)}>
                                        <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} />    Записаться</p>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
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

export default ServiceCard;






