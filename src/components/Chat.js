import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ThemeContext } from './ThemeContext';
import LoadingSpinner from './LoadingSpinner';
import { getAllChats } from './api';

function ChatList() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const [chatData, setChatData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                navigate('/login');
            } else {
                const response = await getAllChats(navigate, userId);
                setChatData(response);
                setIsLoading(false);
                setIsEmpty(response.length === 0);
            }
        };
        fetchData();
    }, [navigate]);

    const handleChatClick = (id) => {
        navigate(`/messages/${id}`);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Нет сообщений</p>
            </div>
        );
    }

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