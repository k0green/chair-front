import React, { useRef, useState, useEffect } from 'react';
import '../styles/Messages.css';
import {isVisible} from "@testing-library/user-event/dist/utils";

const MessageComponent = ({ id, isMessageViewed }) => {
    const [messages, setMessages] = useState([
        { text: 'Привет!', isMine: false, isViewed: true, timestamp: new Date('2023-09-10T10:30:00') },
        { text: 'Привет! Как дела?', isMine: true, isViewed: true, timestamp: new Date('2023-09-10T10:30:10') },
        { text: 'Отлично, спасибо!', isMine: false, isViewed: false, timestamp: new Date('2023-09-11T00:30:00') },
    ]);


    const [newMessage, setNewMessage] = useState('');
    const [viewedMessages, setViewedMessages] = useState({});
    const [isBarVisible, setIsBarVisible] = useState(true);
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const userRef = useRef(null);

    useEffect(() => {
        // Проверяем, есть ли непрочитанные входящие сообщения
        const hasUnreadMessages = messages.some(
            (message) => !message.isMine && !message.isViewed
        );

        // Если есть непрочитанные входящие сообщения, показываем полоску
        if (hasUnreadMessages) {
            setIsBarVisible(true);
        } else {
            setIsBarVisible(false);
        }
    }, [messages]);



    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            // Создаем новый объект сообщения с датой и временем и добавляем его в массив messages
            const newMessageObject = {
                text: newMessage,
                isMine: true,
                isViewed: false,
                timestamp: new Date(),
            };

            const updatedMessages = messages.map((message) => ({
                ...message,
                isViewed: message.isMine ? message.isViewed : true,
            }));

            setMessages([...updatedMessages, newMessageObject]);

            // Очищаем поле ввода после отправки
            setNewMessage('');

            setIsBarVisible(false);

            // Прокручиваем элемент пользователя вниз списка сообщений
            if (userRef.current) {
                userRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            setIsBarVisible(false);
        }
    };

    const handleMarkAsRead = () => {
            const updatedMessages = messages.map((message) => ({
                ...message,
                isViewed: message.isMine ? message.isViewed : true,
            }));
            setMessages(updatedMessages);
    };



    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long' };
        return new Date(date).toLocaleDateString('ru-RU', options);
    };

    const getCircleColor = (message) => {
        return viewedMessages[message.id] ? 'darkblue' : 'gray';
    };

    const groupedMessages = {};
    messages.forEach((message) => {
        const dateKey = formatDate(message.timestamp);
        if (!groupedMessages[dateKey]) {
            groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(message);
    });

    return (
        <div className="chat-container">
            <div className="message-header">
                <div className="avatar"></div>
                <div className="name">Имя собеседника</div>
            </div>
            <div className="message-list">
                {Object.keys(groupedMessages).map((date) => (
                    <div key={date} className="message-group">
                        <div className="date">{date}</div>
                        {groupedMessages[date].map((message, index) => (
                            <div key={index} className={`message ${message.isMine ? 'mine' : 'theirs'}`}>
                                {message.text}
                                <div className="timestamp">
                                    {message.isMine && (
                                        <div className={`circle ${message.isViewed ? 'viewed' : 'not-viewed'}`}></div>
                                    )}
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    {!message.isMine && (
                                        <div className={`circle ${message.isViewed ? 'viewed' : 'not-viewed'}`}></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mark-as-read" onClick={handleMarkAsRead} style={{ display: isBarVisible ? "block" : "none" }}>
                Пометить все как прочитанные
            </div>

            <div className="message-input-div">
        <textarea
            className="message-input"
            type="text"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
        />
                <button className="send-button" onClick={handleSendMessage}>
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default MessageComponent;