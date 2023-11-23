import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";

/*const chatData = [
    {
        id: 1,
        name: 'Собеседник 1',
        lastMessage: 'Привет, как дела?',
        unreadCount: 3,
        avatar: 'https://klike.net/uploads/posts/2022-08/1661925591_j-34.jpg',
    },
    {
        id: 2,
        name: 'Собеседник 2',
        lastMessage: 'Что нового?',
        unreadCount: 0,
        avatar: 'https://wallpapercave.com/wp/wp9784502.jpg',
    },
    // Добавьте другие чаты по аналогии
];*/

function ChatList() {
    const navigate = useNavigate();

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

    /*const chatData = [
        {
            id: 1,
            name: 'Собеседник 1',
            lastMessage: 'Привет, как дела?',
            unreadCount: 3,
            avatar: 'https://klike.net/uploads/posts/2022-08/1661925591_j-34.jpg',
        },
        {
            id: 2,
            recipientName: 'Собеседник 2',
            lastMessage: 'Что нового?',
            unreadMessagesAmount: 0,
            recipientProfileImg: 'https://wallpapercave.com/wp/wp9784502.jpg',
        },
        // Добавьте другие чаты по аналогии
    ];*/

    const handleChatClick = (id) => {
        // При клике на чат, перейдите на страницу чата с соответствующим ID
        navigate(`/messages/${id}`);
    };

    return (
        <div className="chat-list">
            {chatData.map((chat) => (
                <div key={chat.id} className="chat" onClick={() => handleChatClick(chat.recipientProfileId)}>
                    <div className="avatar">
                        <img src={chat.recipientProfileImg} alt={chat.recipientName} />
                    </div>
                    <div className="chat-info">
                        <div className="name">{chat.recipientName}</div>
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
