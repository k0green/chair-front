import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React from "react";
import {faStar} from "@fortawesome/free-solid-svg-icons";

const ExecutorServiceCard = ({ id, name, collection, image, likeAmount, description }) => {

    const navigate = useNavigate();

    const handleItemClick = () => {
        //navigate(/item/${id});
    };
    /*    const handleUserButtonClick = () => {
            navigate(/user/${id});
        };
        const handleThemeButtonClick = () => {
            navigate(/collection/category/${id});
        };*/

    return (
        <button className="item-card" onClick={handleItemClick}>
            {/*<button className="category" onClick={handleThemeButtonClick}>{theme}</button>*/}
            {/*<img src={} className="item-image" />*/}
            <div className="down-show">
                <div className="item-name">{name}</div>
                <div className="item-count">{likeAmount} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></div>
                {/*<button className="user" onClick={handleUserButtonClick}>{user}</button>*/}
            </div>
            <div className="collection">{collection}</div>
            <div className="description">{description}</div>
        </button>
    );
};

export default ExecutorServiceCard;