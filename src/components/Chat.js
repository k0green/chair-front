import React, {useContext, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";
import {ThemeContext} from "./ThemeContext";
import {toast} from "react-toastify";

function ChatList() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const [chatData, setChatData] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Выполнение запроса при монтировании компонента
        const token = Cookies.get('token');
        const userId = localStorage.getItem('userId');
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`http://localhost:5155/chat/all`)
                .then(response => {

                    const data = response.data.map(item => ({
                        id: item.id,
                        recipientName: item.recipientName,
                        recipientProfileId: item.recipientProfileId,
                        recipientProfileImg: item.recipientProfileImg,
                        unreadMessagesAmount: item.unreadMessagesAmount,
                        messages: item.messages.map(message => ({
                            text: message.text,
                            createdDate: message.createdDate,
                            isDeleted: message.isDeleted,
                            isEdited: message.isEdited,
                            isRead: message.isRead,
                            chatId: message.chatId,
                            replyId: message.replyId,
                            recipientId: message.recipientId,
                            senderId: message.senderId,
                            isMine: message.senderId === userId,
                        })),
                    }));

                    setMessages(data.messages);
                    setChatData(data);
                })
                .catch(error => {
                    if (error.response) {
                        if (!toast.isActive(error.message)) {
                            toast.error(error.message, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                toastId: error.message,
                            });
                        }
                        // Ошибка пришла с сервера (код ответа не 2xx)
                        if (error.response.status === 401) {
                            navigate("/login");
                        } else {
                            console.error(`Ошибка от сервера: ${error.response.status}`);
                        }
                    } else if (error.request) {
                        // Запрос был сделан, но ответ не был получен
                        console.error('Ответ не был получен. Возможно, проблемы с сетью.');
                    } else {
                        // Произошла ошибка при настройке запроса
                        console.error('Произошла ошибка при настройке запроса:', error.message);
                    }
                });
        }
    }, []);

    const handleChatClick = (id) => {
        // При клике на чат, перейдите на страницу чата с соответствующим ID
        navigate(`/messages/${id}`);
    };

    return (
        <div className="chat-list">
            {chatData.map((chat) => (
                <div key={chat.id} className={`chat ${theme === 'dark' ? 'dark' : ''}`} onClick={() => handleChatClick(chat.recipientProfileId)}>
                    <div className="avatar">
                        <img src={chat.recipientProfileImg}/>
                    </div>
                    <div className="chat-info">
                        <div className={`name ${theme === 'dark' ? 'dark' : ''}`}>{chat.recipientName}</div>
                        {/*<div className="last-message">{chat.messages.length > 0 ? chat.messages[0].text : ""}</div>*/}
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
