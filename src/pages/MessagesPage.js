import React, { useContext } from "react";
import "../styles/Chat.css";
import Messages from '../components/Messages';
import {useParams} from "react-router-dom";
import {ThemeContext} from "../components/ThemeContext";

const MessagesPage = () => {
    const { theme } = useContext(ThemeContext);

    let { id } = useParams();

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Messages id = {id} />
            </div>
        </div>
    );
};

export default MessagesPage;