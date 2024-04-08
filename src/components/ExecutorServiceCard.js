import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React from "react";
import {faStar} from "@fortawesome/free-solid-svg-icons";

const ExecutorServiceCard = ({ id, name, collection, image, likeAmount, description }) => {

    const navigate = useNavigate();

    const handleItemClick = () => {
        //navigate(/item/${id});
    };

    return (
        <button className="item-card" onClick={handleItemClick}>
            <div className="down-show">
                <div className="item-name">{name}</div>
                <div className="item-count">{likeAmount} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></div>
            </div>
            <div className="collection">{collection}</div>
            <div className="description">{description}</div>
        </button>
    );
};

export default ExecutorServiceCard;