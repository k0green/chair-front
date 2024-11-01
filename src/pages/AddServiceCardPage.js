import React, {useContext} from 'react';
import '../styles/ServiceCard.css';
import { useParams } from "react-router-dom";
import EditServiceCard from "../components/EditServiceCard";
import {ThemeContext} from "../components/ThemeContext";

const AddServiceCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    let { id } = useParams();

    const service =
        {
            id: 1,
            name: 'Service 1',
            //duration: '0001-01-01T01:00:00',
            serviceTypeId: "36dc8d14-c955-4d33-9b2b-cf2ea432da3c",
            place: {
                address: "",
                position: {
                    lat: "",
                    lng: "",
                }
            },
            photos:  [{
                id: 'default',
                url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn',
            }],
        };

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <EditServiceCard service={service} isNew={true} id={id}/>
        </div>
    );
};

export default AddServiceCardPage;
