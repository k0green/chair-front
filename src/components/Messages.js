import React, {useRef, useState, useEffect, useContext} from 'react';
import '../styles/Messages.css';
import {isVisible} from "@testing-library/user-event/dist/utils";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import {
    faBoltLightning,
    faCancel,
    faCheckCircle,
    faEdit,
    faHandPointer, faPaperclip,
    faPencil,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FaTrash} from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {useDropzone} from "react-dropzone";

const MessageComponent = ({ id, isMessageViewed }) => {

    const { theme } = useContext(ThemeContext);

    const [chatData, setChatData] = useState([]);
    const [messages, setMessages] = useState([]);

    const [isChoosing, setIsChoosing] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { language, translations } = useContext(LanguageContext);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [files, setFiles] = useState([]);


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
                            type: message.type,
                        })),
                    };

                    setMessages(data.messages);
                    setChatData(data);
                })
                .catch(error => {
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
                    if (error.response) {
                        if (error.response.status === 401) {
                            navigate("/login");
                        } else {
                            console.error(`Ошибка от сервера: ${error.response.status}`);
                        }
                    } else if (error.request) {
                        console.error('Ответ не был получен. Возможно, проблемы с сетью.');
                    } else {
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

        connection.on("ReceiveAllMessages", (messages) => {
            console.log("Messages all received: ", messages);
            messages.forEach(message => {
                /*if (message.senderId !== localStorage.getItem('userId')) {*/
                message.isMine = message.senderId === userId
                    setMessages(oldMessages => {
                        const index = oldMessages.findIndex(m => m.id === message.id);
                        if (index !== -1) {
                            // Если сообщение помечено как удаленное, удаляем его из списка
                            if (message.isDeleted === true) {
                                return [...oldMessages.slice(0, index), ...oldMessages.slice(index + 1)];
                            } else {
                                // Иначе заменяем существующее сообщение
                                return [...oldMessages.slice(0, index), message, ...oldMessages.slice(index + 1)];
                            }
                        } else {
                            // Если сообщение не существует в списке, добавляем его
                            return [...oldMessages, message];
                        }
                    });
/*                }*/
            });
        });


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
        const hasUnreadMessages = messages.some(
            (message) => !message.isMine && !message.isRead
        );

        // Если есть непрочитанные входящие сообщения, показываем полоску
        if (hasUnreadMessages) {
            setIsBarVisible(true);
        } else {
            setIsBarVisible(false);
        }
        down()
    }, [messages]);



    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const messageId = uuidv4();
            // Создаем новый объект сообщения с датой и временем и добавляем его в массив messages
            const newMessageObject = {
                id: messageId,
                text: newMessage,
                isMine: true,
                isRead: false,
                createdDate: new Date(),
            };

            const messageData = {
                id: messageId,
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
                    handleMarkAsRead()
                })
                .catch(error => {
                    // Handle error, e.g., show an error message
                    console.error('Error saving data:', error);
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
            down();
        }
    };

    const handleMarkAsRead = () => {
/*            const updatedMessages = messages.map((message) => ({
                ...message,
                isRead: message.isMine ? message.isRead : true,
            }));
            setMessages(updatedMessages);*/
        const token = Cookies.get('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get(`http://localhost:5155/message/mark-as-read/`+chatData.id)
            .then(response => {})
            .catch(error => {
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
            });
    };

    const down = () => {
        let messagesElement = document.getElementById('messages');
        messagesElement.scrollTo({
            top: messagesElement.scrollHeight,
            behavior: 'smooth'
        });
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

    const Dropzone = () => {
        const { getRootProps, getInputProps } = useDropzone({
            accept: 'image/*',
            onDrop: acceptedFiles => {
                setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))]);
            },
            multiple: true
        });

        const images = files.map((file, index) => (
            <div className="dropzone-centrize" key={file.name}>
                <img src={file.preview} style={{width: '50%'}} alt="preview" />
                <button className='trash-icon' onClick={() => {
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    setFiles(newFiles);
                }}><FontAwesomeIcon icon={faTrash} />  Удалить</button>
            </div>
        ));

        return (
            <div className="dropzone-centrize">
                {images}
                <div {...getRootProps({style: {border: '2px solid blue', padding: '20px', width: '400px', height: '400px'}})}>
                    <input {...getInputProps()} />
                    <p>{translations[language]['DragAndDrop']}</p>
                </div>
            </div>
        );
    }

    const handleUpload = async () => {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:5155/minio/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const url = response.data.url;

            /*setEditedPhotos(prevState => [...prevState, ...response.data]);*/
                const messageId = uuidv4();
                // Создаем новый объект сообщения с датой и временем и добавляем его в массив messages
                const newMessageObject = {
                    id: messageId,
                    text: url,
                    isMine: true,
                    isRead: false,
                    createdDate: new Date(),
                    type: 1
                };

                const messageData = {
                    id: messageId,
                    text: url,
                    isDeleted: false,
                    isEdited: false,
                    isRead: false,
                    chatId: chatData.id,
                    recipientId: chatData.recipientId,
                    senderId: chatData.senderId,
                    type: 1
                    //"replyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                };

                // Make a POST request to your server endpoint
                axios.post('http://localhost:5155/message/add', messageData)
                    .then(response => {
                        //navigate("/profile")
                        handleMarkAsRead()
                    })
                    .catch(error => {
                        // Handle error, e.g., show an error message
                        console.error('Error saving data:', error);
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
                down();
            }

        setFiles([]); // очистите files
        setUploadPhotoModal(false);
    };

    const handleAddPhoto = () => {
        setUploadPhotoModal(true);
    };

    return (
        <div className="chat-container">
            <div className={`message-header ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="message-header-image">
                    <div className="avatar"><img src={chatData.recipientProfileImg} className="avatar-image"/></div>
                    <div className={`name ${theme === 'dark' ? 'dark' : ''}`}>{chatData.recipientName}</div>
                </div>
                <div>
                    {isChoosing ? (
                        <div className="choose-buttons">
                            <button className="message-control-button" onClick={handleEdit}>
                                <FontAwesomeIcon icon={faEdit}/><> {translations[language]['Edit']}</>
                            </button>
                            <button className="message-control-button" onClick={handleDelete}>
                                <FontAwesomeIcon icon={faTrash}/><> {translations[language]['Delete']}</>
                            </button>
                            <button className="message-control-button" onClick={handleCancel}>
                                <FontAwesomeIcon icon={faCancel}/>
                            </button>
                        </div>
                    ) : (
                        <button className="message-control-button" onClick={handleChoose} style={{ marginLeft: 'auto' }}>
                            <FontAwesomeIcon icon={faCheckCircle}/><> {translations[language]['Select']}</>
                        </button>
                    )}
                </div>
            </div>
            <div id="messages" className="message-list">
                {Object.keys(groupedMessages).map((date) => (
                    <div key={date} className="message-group">
                        <div className={`date ${theme === 'dark' ? 'dark' : ''}`}>{date}</div>
                        {groupedMessages[date].map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.isMine ? 'mine' : `theirs ${theme === 'dark' ? 'dark' : ''}`} ${selectedMessageId === message.id ? 'selected' : ''}`}
                                onClick={() => handleMessageClick(message.id)}
                            >
                                {message.type === 1 ? (
                                    <img
                                        src={message.text}
                                        alt=""
                                        style={{
                                            width: '300px',
                                            height: '300px',
                                            borderRadius: '15px'
                                        }}
                                    />
                                ) : (
                                    message.text
                                )}
                                <div className={`timestamp ${selectedMessageId === message.id ? 'selected' : ''}`}>
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
                {translations[language]['MarkAsRead']}
            </div>
{/*            <div className="mark-as-read" onClick={down}>
                Down
            </div>*/}

            <div className={`message-input-div ${theme === 'dark' ? 'dark' : ''}`}>
                <button style={{backgroundColor: "transparent", color: "gray", border: "none", scale: "1.5", marginRight: "10px"}} onClick={handleAddPhoto}>
                    <FontAwesomeIcon icon={faPaperclip} className={`item-icon ${theme === 'dark' ? 'dark' : ''}`} />
                </button>
                <textarea
                    id="textarea-message"
                    className={`message-input ${theme === 'dark' ? 'dark' : ''}`}
                    placeholder={translations[language]['EnterMessage']}
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button className="send-button" onClick={handleButtonClick}>
                    {isEditing ? translations[language]['Save'] : translations[language]['Send']}
                </button>
            </div>
            {uploadPhotoModal && (
                <div className="filter-modal">
                    <div className="modal-content">
                    <span className="close" onClick={() => setUploadPhotoModal(false)}>
                        &times;
                    </span>
                        <div className="dropzone-centrize">
                            <Dropzone />
                            <button className="dropzone-order-button" onClick={handleUpload}><p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageComponent;