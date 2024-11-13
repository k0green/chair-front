import "../styles/CategoryItem.css";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import IconComponent from "./IconComponent";
import { ThemeContext } from "./ThemeContext";
import EditServiceCard from "./EditServiceCard";

const CategoryItem = ({ id, name, icon, isEditServiceCard }) => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [showEditServiceCard, setShowEditServiceCard] = useState(false);

    const service = {
        id: 1,
        name: 'Service 1',
        serviceTypeId: id,
        place: {
            address: "",
            position: {
                lat: "",
                lng: "",
            }
        },
        photos: [{
            id: 'default',
            url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn',
        }],
    };

    const handleCategoryClick = () => {
        if (isEditServiceCard) {
            setShowEditServiceCard(true);
        } else {
            navigate('/collection/category/' + id);
        }
    };

    return (
        <>
            {showEditServiceCard ?
                <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
                    <EditServiceCard service={service} isNew={true} id={id} />
                </div>
                :
                <button className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"} onClick={handleCategoryClick}>
                    <IconComponent iconName={icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"} />
                    <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{name}</div>
                </button>
            }
        </>
    );
};

export default CategoryItem;
