import React, {useContext} from 'react';
import CategoryItem from './CategoryItem';
import "../styles/CategoryItem.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "./ThemeContext";

const AllChildrenCategory = ({categories, isEditServiceCard, userId}) => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const handleBackClick = async () => {
        navigate('/all-categories');
        window.location.reload();
    };

    const parentName = categories.length > 0 ? categories[0].parentName : "";

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", textAlign: "left" }} onClick={handleBackClick}>
                <h2 className={`type-name ${theme === 'dark' ? 'dark' : ''}`}>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ cursor: "pointer", marginRight: "20px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    {parentName}
                </h2>
            </div>
            <div className="all-category-type-container">
                <div className="all-category-list">
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            icon={category.icon}
                            isEditServiceCard={isEditServiceCard}
                            userId = {userId}
                            parentName={category.parentName}
                            parentId={category.parentId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllChildrenCategory;

