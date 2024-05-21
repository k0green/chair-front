import React, {useContext, useState} from 'react';
import '../styles/Profile.css'; // Файл стилей для страницы профиля
import ServiceCard from '../components/ServiceCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoltLightning,
    faCancel,
    faComment,
    faCross,
    faPencil,
    faSave,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import EditServiceCard from "./EditServiceCard";
import {useNavigate} from "react-router-dom";
import telegram from '../icons/telegram.svg';
import mobilePhone from '../icons/mobilePhone.png';
import instagram from '../icons/instagram.svg';
import viber from '../icons/viber.svg';
import vk from '../icons/vk.svg';
import whatsapp from '../icons/whatsapp.svg';
import webSite from '../icons/webSite.png';
import mail from '../icons/mail.png';
import axios from "axios";
import Cookies from "js-cookie";
import Dropzone, {useDropzone} from "react-dropzone";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";

const Profile = ({user, services, contacts, current}) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [editedContacts, setEditedContacts] = useState([...contacts]);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [file, setFile] = useState(null);
    const { language, translations } = useContext(LanguageContext);

    if (!user || !user.services) {
        return <div>Loading...</div>; // You can customize the loading state as needed
    }

    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const contactsIcons = [
        {
            id: 1,
            icon: telegram,
        },
        {
            id: 2,
            icon: mobilePhone,
        },
        {
            id: 3,
            icon: instagram,
        },
        {
            id: 4,
            icon: viber,
        },
        {
            id: 5,
            icon: vk,
        },
        {
            id: 6,
            icon: whatsapp,
        },
        {
            id: 7,
            icon: webSite,
        },
        {
            id: 8,
            icon: mail,
        }
    ];

    const handleNewServiceClick = () => {
            navigate("/service-card/add/"+user.id);
    };

    const handleMessageClick = () => {
            navigate("/messages/"+user.id);
    };

    const handleEditSaveClick = () => {
        if (isEditing) {
            const token = Cookies.get('token');
            if(!token)
                navigate("/login");
            else {
                editedUser.contacts = editedContacts;
                //editedUser.avatar = "";
                editedUser.services = [];
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                axios.put('http://localhost:5155/executor-profile/update', editedUser, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        console.log('Success:', response.data);
                        setIsEditing(false);
                        window.location.reload();
                    })
                    .catch((error) => {
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
                        console.error('Error:', error);
                    });
            }
        } else {
            // Enable editing mode
            setIsEditing(true);
            setEditedUser(user);
            setEditedContacts([...contacts]);
        }
    };


    const handleCancelEditClick = () => {
            setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleContactInputChange = (contactId, value) => {
        setEditedContacts((prevContacts) => {
            const updatedContacts = [...prevContacts];
            const index = updatedContacts.findIndex((c) => c.type === contactId);
            if (index !== -1) {
                updatedContacts[index] = { type: contactId, name: value };
            } else {
                updatedContacts.push({ type: contactId, name: value });
            }
            return updatedContacts;
        });
    };

    const handleAddPhoto = () => {
        setUploadPhotoModal(true);
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:5155/minio/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            editedUser.imageUrl = response.data;
        }

        setFile(null);
        setUploadPhotoModal(false);
    };

    const Dropzone = () => {
        const { getRootProps, getInputProps } = useDropzone({
            accept: 'image/*',
            onDrop: acceptedFiles => {
                setFile(Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0])
                }));
            },
            multiple: false
        });

        return (
            <div className="dropzone-centrize">
                <div {...getRootProps({style: {border: '2px solid blue', padding: '20px', width: '400px', height: '400px'}})}>
                    <input {...getInputProps()} />
                    {file && <img src={file.preview} style={{width: '50%'}} alt="preview" />}
                    {!file && <p>{translations[language]['DragAndDrop']}</p>}
                </div>
                {file && <button className='trash-icon' onClick={() => setFile(null)}><FontAwesomeIcon icon={faTrash} />  {translations[language]['Delete']}</button>}
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    {isEditing ? (
                        <>
                            <img onClick={handleAddPhoto} src={user.imageUrl} alt="" className="avatar-image"/>
                        </>
                    ) : (
                        <>
                            <img src={user.imageUrl} alt="" className="avatar-image"/>
                        </>
                    )}
                </div>
                <div className="profile-bio">
                    {isEditing ? (
                        <>
                            <input
                                className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                                type="text"
                                name="name"
                                value={editedUser.name}
                                onChange={handleInputChange}
                                placeholder={translations[language]['Name']}
                            />
                            <input
                                className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                                type="text"
                                name="bio"
                                value={editedUser.description}
                                onChange={handleInputChange}
                                placeholder={translations[language]['Description']}
                            />
                        </>
                    ) : (
                        <>
                            <h1 className={`profile-name ${theme === 'dark' ? 'dark' : ''}`}>{user.name}</h1>
                            <p className={`profile-description ${theme === 'dark' ? 'dark' : ''}`}>{user.description}</p>
                        </>
                    )}
                    <div className="contact-icons">
                        {contactsIcons.map((contactIcon) => {
                            const contact = contacts.find((c) => c.type === contactIcon.id);
                            const editedContact = editedContacts.find((c) => c.type === contactIcon.id);

                            return (
                                (isEditing || (contact && contact.name)) && ( // Покажем только если редактируем или у контакта есть значение
                                    <div key={contactIcon.id} className="contact-item">
                                        <img
                                            src={contactIcon.icon}
                                            alt={contactIcon.id}
                                            title={contactIcon.id}
                                            className="contact-icon"
                                            style={{ width: '10%', height: '10%' }}
                                        />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name={contactIcon.id.toString()}
                                                value={editedContact ? editedContact.name : ''}
                                                onChange={(e) => handleContactInputChange(contactIcon.id, e.target.value)}
                                                placeholder="Contact"
                                                className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                                            />
                                        ) : (
                                            <b className={`profile-description ${theme === 'dark' ? 'dark' : ''}`}>{contact ? contact.name : ''}</b>
                                        )}
                                    </div>
                                )
                            );
                        })}
                    </div>

                    {!current ? (
                        <button className="message-button" onClick={handleMessageClick}>
                            <FontAwesomeIcon icon={faComment} /> {translations[language]['SendMessage']}
                        </button>
                    ) : (
                        !isEditing ? (
                            <div>
                                <button className="message-button" onClick={handleEditSaveClick}>
                                    <FontAwesomeIcon icon={faPencil}/> {translations[language]['Edit']}
                                </button>
                            </div>
                            ) : (
                                <div>
                                <button className="message-button" onClick={handleEditSaveClick}>
                                    <FontAwesomeIcon icon={faSave}/> {translations[language]['Save']}
                                </button>
                                <button className="message-button" onClick={handleCancelEditClick}>
                                    <FontAwesomeIcon icon={faCancel}/> {translations[language]['Cancel']}
                                </button>
                                </div>
                            )
                    )}
                </div>
                {
                    userRole === 'executor' ?
                        <button className="newAppointmentButton" onClick={handleNewServiceClick}>
                            {translations[language]['Add']}
                        </button> : <p></p>
                }
            </div>
            <div className="services-list">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} isProfile = {user.userId.toString() === userId.toString()}/>
                ))}
            </div>
            {uploadPhotoModal && (
                <div className="filter-modal">
                    <div className="modal-content">
                    <span className="close" onClick={() => setUploadPhotoModal(false)}>
                        &times;
                    </span>
                        <Dropzone />
                        <button className="dropzone-order-button" onClick={handleUpload}><p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p></button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
