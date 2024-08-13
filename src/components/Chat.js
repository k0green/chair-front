import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {ThemeContext} from "./ThemeContext";
import {toast} from "react-toastify";
import {getAllChats, getOrdersByRole} from "./api";
import Cookies from "js-cookie";

function ChatList() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const [chatData, setChatData] = useState([]);
    const [ messages, setMessages] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                navigate('/login');
            } else {
                const response = await getAllChats( navigate, userId);
                setMessages(response.messages);
                setChatData(response);
            }
        };
        fetchData();
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
