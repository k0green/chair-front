import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/CategoryItem.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import IconComponent from "./IconComponent";
import { ThemeContext } from "../context/ThemeContext";
import ph1 from '../testPhotos/ph1.png';
import ph2 from '../testPhotos/ph2.png';
import ph3 from '../testPhotos/ph3.jpg';
import ph4 from '../testPhotos/ph4.jpg';
import ph5 from '../testPhotos/ph5.jpg';
import ph6 from '../testPhotos/ph6.jpeg';


const Photo = ({ id, url }) => {

    const { theme } = useContext(ThemeContext);
    /*    const navigate = useNavigate();
        const [darkTheme, setDarkTheme] = useState(false);*/

    const handleCategoryClick = () => {
        /*navigate(/collection/category/${id});*/
    };

    return (
/*        <button className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"} onClick={handleCategoryClick}>
            <IconComponent iconName={icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"}/>
            <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{name}</div>
        </button>*/
    <img
        key={id}
        src={id === 1 ? ph1 : id === 2 ? ph2 : id === 3 ? ph3 : id === 4 ? ph4 : id === 5 ? ph5 : ph6}
        alt={id}/>
    );
};

export default Photo;