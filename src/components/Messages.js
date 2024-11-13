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
import {
    addMessage,
    BASE_URL,
    deleteMessage,
    editMessageText,
    getChatById, LoadingAnimation,
    markAsReadMessage,
    uploadMinioPhoto
} from "./api";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import {faSave} from "@fortawesome/free-solid-svg-icons/faSave";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";

const MessageComponent = ({ id }) => {

    const { theme } = useContext(ThemeContext);

    const [chatData, setChatData] = useState([]);
    const [messages, setMessages] = useState([]);

    const [isChoosing, setIsChoosing] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { language, translations } = useContext(LanguageContext);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [isUpload, setIsUpload] = useState(false);

    const handleSave = () => {
        const editedMessageIndex = messages.findIndex((message) => message.id === selectedMessageId);
        if (editedMessageIndex !== -1) {
            const updatedMessages = [...messages];
            updatedMessages[editedMessageIndex].text = newMessage;

            editMessageText(navigate, selectedMessageId, newMessage)
                .then(response => {
                    setMessages(updatedMessages);
                    setIsEditing(false);
                    setSelectedMessageId(null);
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
        .withUrl(`${BASE_URL}/messageHub`,{
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
        const selectedMessage = messages.find((message) => message.id === selectedMessageId);
        if (selectedMessage) {
            setNewMessage(selectedMessage.text);
            setIsEditing(true);
        }
    };

    const handleDelete = () => {
        deleteMessage(navigate, selectedMessageId)
            .then(response => {
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

    const handleMessageClick = (messageId, isMine) => {
        if (isChoosing && isMine) {
            setSelectedMessageId(messageId);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        getChatById(navigate, id)
            .then(response => {
                setMessages(response.messages);
                setChatData(response);
            });

        connection.on("ReceiveMessage", (message) => {
            console.log("Message received: ", message);
            if (message.senderId !== localStorage.getItem('userId')) {
                setMessages(messages => {
                    const index = messages.findIndex(m => m.id === message.id);
                    if (index !== -1) {
                        if (message.isDeleted === true) {
                            return [...messages.slice(0, index), ...messages.slice(index + 1)];
                        } else {
                            return [...messages.slice(0, index), message, ...messages.slice(index + 1)];
                        }
                    } else {
                        return [...messages, message];
                    }
                });
            }
        });

        connection.on("ReceiveAllMessages", (messages) => {
            console.log("Messages all received: ", messages);
            messages.forEach(message => {
                message.isMine = message.senderId === userId
                    setMessages(oldMessages => {
                        const index = oldMessages.findIndex(m => m.id === message.id);
                        if (index !== -1) {
                            if (message.isDeleted === true) {
                                return [...oldMessages.slice(0, index), ...oldMessages.slice(index + 1)];
                            } else {
                                return [...oldMessages.slice(0, index), message, ...oldMessages.slice(index + 1)];
                            }
                        } else {
                            return [...oldMessages, message];
                        }
                    });
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

            addMessage(navigate, messageData)
                .then(response => {
                    handleMarkAsRead()
                })
                .catch(error => {
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

            setNewMessage('');

            setIsBarVisible(false);

            if (userRef.current) {
                userRef.current.scrollIntoView({ behavior: 'smooth' });
            }

            setIsBarVisible(false);
            down();
        }
    };

    const handleMarkAsRead = () => {
        const token = Cookies.get('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        markAsReadMessage(navigate, chatData.id)
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
            <div className="price-filter" key={file.name} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                    <FontAwesomeIcon icon={faTrash} onClick={() => {
                        const newFiles = [...files];
                        newFiles.splice(index, 1);
                        setFiles(newFiles);
                    }} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "#ff0000" } : { color: "#ff0000" })}}/>
                </div>
                <img src={file.preview} style={{width: '50%'}} alt="preview" />
            </div>
        ));

        return (
            <div className="dropzone-centrize">
                <div {...getRootProps({style: {border: '2px solid blue', borderRadius: "10px", padding: '20px', minWidth: "200px", minHeight: "200px", width: '30%'}})}>
                    <input {...getInputProps()} />
                    <p>{translations[language]['DragAndDrop']}</p>
                </div>
                {images}
            </div>
        );
    }

    const handleUpload = async () => {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            let url = '';

            uploadMinioPhoto(navigate, formData)
                .then(serverData => {
                    url = serverData.data.url;
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

                const messageId = uuidv4();
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

            addMessage(navigate, messageData)
                .then(response => {
                    handleMarkAsRead()
                })
                .catch(error => {
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

                setNewMessage('');

                setIsBarVisible(false);

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

    const handleReturnClick = () => {
        navigate("/chats");
    };

    return (
        <div className={window.innerWidth > 1000 ? "chat-container": ""}>
            <div className={`message-header ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="message-header-image">
                    <FontAwesomeIcon icon={faArrowLeft} onClick={handleReturnClick} style={{...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    <div className="avatar"><img src={chatData.recipientProfileImg} className="avatar-image" alt={""}/></div>
                    <div className={`name ${theme === 'dark' ? 'dark' : ''}`}>{chatData.recipientName}</div>
                </div>
                <div>
                    {isChoosing ? (
                        window.innerWidth > 700 ? (<div className="choose-buttons">
                            <button className="message-control-button" onClick={handleEdit}>
                                <FontAwesomeIcon icon={faEdit}/><> {translations[language]['Edit']}</>
                            </button>
                            <button className="message-control-button" onClick={handleDelete}>
                                <FontAwesomeIcon icon={faTrash}/><> {translations[language]['Delete']}</>
                            </button>
                            <button className="message-control-button" onClick={handleCancel}>
                                <FontAwesomeIcon icon={faCancel}/>
                            </button>
                        </div>) : (<div className="choose-buttons">
                            <button className="message-control-button" onClick={handleEdit}>
                                <FontAwesomeIcon icon={faEdit}/><></>
                            </button>
                            <button className="message-control-button" onClick={handleDelete}>
                                <FontAwesomeIcon icon={faTrash}/><></>
                            </button>
                            <button className="message-control-button" onClick={handleCancel}>
                                <FontAwesomeIcon icon={faCancel}/>
                            </button>
                        </div>)
                    ) : (
                        <button className="message-control-button" onClick={handleChoose} style={{ marginLeft: 'auto' }}>
                            <FontAwesomeIcon icon={faCheckCircle}/><> {translations[language]['Select']}</>
                        </button>
                    )}
                </div>
            </div>
            <div id="messages" className="message-list" style={{marginTop: "80px"}}>
                {Object.keys(groupedMessages).map((date) => (
                    <div key={date} className="message-group">
                        <div className={`date ${theme === 'dark' ? 'dark' : ''}`}>{date}</div>
                        {groupedMessages[date].map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.isMine ? 'mine' : `theirs ${theme === 'dark' ? 'dark' : ''}`} ${selectedMessageId === message.id ? 'selected' : ''}`}
                                onClick={() => handleMessageClick(message.id, message.isMine)}
                            >
                                {message.type === 1 ? (
                                    <img
                                        className="messageImage"
                                        src={message.text}
                                        alt=""
                                        style={{
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
            <div className={`filter-overlay ${uploadPhotoModal ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="filter-content">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setUploadPhotoModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                        <Dropzone />
                    </div>
                    <div className="price-inputs">
                        <div className="input-group" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                            <button className="filter-button"
                                    onClick={handleUpload}
                                    disabled={isUpload}
                            >
                                {isUpload ? <LoadingAnimation /> : <><FontAwesomeIcon icon={faSave} /> {translations[language]['Save']}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageComponent;