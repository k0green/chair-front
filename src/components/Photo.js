import "../styles/CategoryItem.css";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";


const Photo = ({ id, url }) => {

    const { theme } = useContext(ThemeContext);

    return (
    <img
        key={id}
        src={url}
        /*//alt={id}*/
        onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain'; // Замените на вашу альтернативную ссылку
        }}/>
    );
};

export default Photo;