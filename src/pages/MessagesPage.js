import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/Chat.css";
import Messages from '../components/Messages';
import {useParams} from "react-router-dom";

const MessagesPage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);

    let { id } = useParams();

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Header user={user} onLogout={onLogout} />
            <div>
                <Messages id = {id} />
            </div>
            <Footer />
        </div>
    );
};

export default MessagesPage;