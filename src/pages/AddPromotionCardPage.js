import React, {useContext} from 'react';
import '../styles/ServiceCard.css';
import { useParams } from "react-router-dom";
import EditServiceCard from "../components/EditServiceCard";
import {ThemeContext} from "../components/ThemeContext";
import EditPromotionCard from "../components/EditPromotionCard";

const AddServiceCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    let { id } = useParams();

    const service =
        {
            id: 1,
            name: 'Service 1',
            photos:  [{
                id: 'default',
                url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn',
            }],
        };

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <EditPromotionCard service={service} isNew={true} id={id}/>
        </div>
    );
};

export default AddServiceCardPage;
