import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const chatData = [
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
];

function ChatList() {
    const navigate = useNavigate();

    const handleChatClick = (id) => {
        // При клике на чат, перейдите на страницу чата с соответствующим ID
        navigate(`/messages/${id}`);
    };

    return (
        <div className="chat-list">
            {chatData.map((chat) => (
                <div key={chat.id} className="chat" onClick={() => handleChatClick(chat.id)}>
                    <div className="avatar">
                        <img src={chat.avatar} alt={chat.name} />
                    </div>
                    <div className="chat-info">
                        <div className="name">{chat.name}</div>
                        <div className="last-message">{chat.lastMessage}</div>
                    </div>
                    {chat.unreadCount > 0 && (
                        <div className="unread-count">{chat.unreadCount}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ChatList;
