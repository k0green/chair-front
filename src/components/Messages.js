import React, { useRef, useState, useEffect } from 'react';
import '../styles/Messages.css';
import {isVisible} from "@testing-library/user-event/dist/utils";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

const MessageComponent = ({ id, isMessageViewed }) => {

    const [chatData, setChatData] = useState([]);
    const [messages, setMessages] = useState([]);

    const [isChoosing, setIsChoosing] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        // Implement saving/editing logic here
        const editedMessageIndex = messages.findIndex((message) => message.id === selectedMessageId);
        if (editedMessageIndex !== -1) {
            const updatedMessages = [...messages];
            updatedMessages[editedMessageIndex].text = newMessage;

            // Make a PUT request to your server endpoint for editing
            axios.post(`http://localhost:5155/message/edit-text`, { id: selectedMessageId, name: newMessage })
                .then(response => {
                    setMessages(updatedMessages);
                    setIsEditing(false);
                    setSelectedMessageId(null);
                    // Очищаем поле ввода после отправки
                    setNewMessage('');
                })
                .catch(error => {
                    console.error('Error editing message:', error);
                    setIsEditing(false);
                    setSelectedMessageId(null);
                });
        }
    };

    const accessToken = Cookies.get('token');

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5155/messageHub",{
                accessTokenFactory: () => accessToken
            })
        .build();

    const handleButtonClick = () => {
        if (isEditing) {
            handleSave();
        } else {
            handleSendMessage();
        }
    };

    const handleChoose = () => {
        setIsChoosing(true);
    };

    const handleEdit = () => {
        // Implement editing logic here
        const selectedMessage = messages.find((message) => message.id === selectedMessageId);
        if (selectedMessage) {
            setNewMessage(selectedMessage.text);
            setIsEditing(true);
        }
    };

    const handleDelete = () => {
        // Implement deleting logic here
        axios.delete(`http://localhost:5155/message/remove/${selectedMessageId}`)
            .then(response => {
                // Update messages state after successful deletion
                const updatedMessages = messages.filter(message => message.id !== selectedMessageId);
                setMessages(updatedMessages);
                setIsChoosing(false);
            })
            .catch(error => {
                console.error('Error deleting message:', error);
                setIsChoosing(false);
            });
    };

    const handleCancel = () => {
        setIsChoosing(false);
        setSelectedMessageId(null);
        setNewMessage(null);
    };

    const handleMessageClick = (messageId) => {
        if (isChoosing) {
            // Toggle selection
            setSelectedMessageId(messageId);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        // Выполнение запроса при монтировании компонента
        const token = Cookies.get('token');
        const userId = localStorage.getItem('userId');
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`http://localhost:5155/chat/`+id)
                .then(response => {
                    const data = {
                        id: response.data.id,
                        recipientId: response.data.recipientId,
                        senderId: response.data.senderId,
                        recipientName: response.data.recipientName,
                        recipientProfileId: response.data.recipientProfileId,
                        recipientProfileImg: response.data.recipientProfileImg,
                        unreadMessagesAmount: response.data.unreadMessagesAmount,
                        messages: response.data.messages.map(message => ({
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
                            id: message.id,
                        })),
                    };

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

        connection.on("ReceiveMessage", (message) => {
            console.log("Message received: ", message);
            if (message.senderId !== localStorage.getItem('userId')) {
                setMessages(messages => {
                    const index = messages.findIndex(m => m.id === message.id);
                    if (index !== -1) {
                        // Если сообщение помечено как удаленное, удаляем его из списка
                        if (message.isDeleted === true) {
                            return [...messages.slice(0, index), ...messages.slice(index + 1)];
                        } else {
                            // Иначе заменяем существующее сообщение
                            return [...messages.slice(0, index), message, ...messages.slice(index + 1)];
                        }
                    } else {
                        // Если сообщение не существует в списке, добавляем его
                        return [...messages, message];
                    }
                });
            }
        });



        // Запуск соединения при загрузке страницы или компонента
        connection.start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err))

        return () => {
            connection.off("ReceiveMessage");
        };
    }, [id]);

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
            (message) => !message.isMine && !message.isRead
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
                isRead: false,
                createdDate: new Date(),
            };

            const messageData = {
                text: newMessage,
                isDeleted: false,
                isEdited: false,
                isRead: false,
                chatId: chatData.id,
                recipientId: chatData.recipientId,
                senderId: chatData.senderId,
                //"replyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            // Make a POST request to your server endpoint
            axios.post('http://localhost:5155/message/add', messageData)
                .then(response => {
                    //navigate("/profile")
                })
                .catch(error => {
                    // Handle error, e.g., show an error message
                    console.error('Error saving data:', error);
                });

            const updatedMessages = messages.map((message) => ({
                ...message,
                isRead: message.isMine ? message.isRead : true,
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
                isRead: message.isMine ? message.isRead : true,
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
        const dateKey = formatDate(message.createdDate);
        if (!groupedMessages[dateKey]) {
            groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(message);
    });

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="chat-container">
            <div className="message-header">
                <div className="avatar"><img src={chatData.recipientProfileImg} alt="User Avatar" className="avatar-image"/></div>
                <div className="name">{chatData.recipientName}</div>
                {isChoosing ? (
                    <div className="choose-buttons">
                        <button onClick={handleEdit}>
                            <img src="edit-icon.png" alt="Edit" />
                        </button>
                        <button onClick={handleDelete}>
                            <img src="delete-icon.png" alt="Delete" />
                        </button>
                        <button onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={handleChoose} style={{ marginLeft: 'auto' }}>
                        Choose
                    </button>
                )}
            </div>
            <div className="message-list">
                {Object.keys(groupedMessages).map((date) => (
                    <div key={date} className="message-group">
                        <div className="date">{date}</div>
                        {groupedMessages[date].map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.isMine ? 'mine' : 'theirs'} ${selectedMessageId === message.id ? 'selected' : ''}`}
                                onClick={() => handleMessageClick(message.id)}
                            >
                                {message.text}
                                <div className="timestamp">
                                    {message.isMine && (
                                        <div className={`circle ${message.isRead ? 'viewed' : 'not-viewed'}`}></div>
                                    )}
                                    <div>{formatTime(message.createdDate)}</div>
                                    {!message.isMine && (
                                        <div className={`circle ${message.isRead ? 'viewed' : 'not-viewed'}`}></div>
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
                    id="textarea-message"
                    className="message-input"
                    type="text"
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button className="send-button" onClick={handleButtonClick}>
                    {isEditing ? 'Сохранить' : 'Отправить'}
                </button>
            </div>
        </div>
    );
};

export default MessageComponent;