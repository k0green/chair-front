import "../styles/CategoryItem.css";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";


const Photo = ({ id, url, size }) => {

    const { theme } = useContext(ThemeContext);

    return (
    <img
        style={{height: `${size}px`, width: `${size}px`, borderRadius: "10px"}}
        key={id}
        src={url}
        /*//alt={id}*/
        onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=500&h=500&rs=1&pid=ImgDetMain'; // Замените на вашу альтернативную ссылку
        }}/>
    );
};

export default Photo;