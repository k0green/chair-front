import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {ThemeContext} from "./ThemeContext";
import {toast} from "react-toastify";
import {getAllChats} from "./api";

function ChatList() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const [chatData, setChatData] = useState([]);
    const [ messages, setMessages] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        getAllChats( navigate, userId)
            .then(response => {
                setMessages(response.messages);
                setChatData(response);
            })
            .catch(error => {
                const errorMessage = error.message || 'Failed to fetch data';
                if (!toast.isActive(errorMessage)) {
                    toast.error(errorMessage, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: errorMessage,
                    });
                }
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleChatClick = (id) => {
        navigate(`/messages/${id}`);
    };

    return (
        <div className="chat-list">
            {chatData.map((chat) => (
                <div key={chat.id} className={`chat ${theme === 'dark' ? 'dark' : ''}`}
                     onClick={() => handleChatClick(chat.recipientProfileId)}>
                    <div className="avatar">
                        <img src={chat.recipientProfileImg} alt=""/>
                    </div>
                    <div className="chat-info">
                        <div className={`name ${theme === 'dark' ? 'dark' : ''}`}>{chat.recipientName}</div>
                    </div>
                    {chat.unreadMessagesAmount > 0 && (
                        <div className="unread-count">{chat.unreadMessagesAmount}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ChatList;
