import React, {useState} from 'react';
import '../styles/Profile.css'; // Файл стилей для страницы профиля
import ServiceCard from '../components/ServiceCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment, faCross, faPencil, faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
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

const Profile = ({user, services, contacts, current}) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [editedContacts, setEditedContacts] = useState([...contacts]);

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
                    })
                    .catch((error) => {
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


    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img src={user.imageUrl} alt="User Avatar" className="avatar-image"/>
                </div>
                <div className="profile-bio">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={editedUser.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                            />
                            <input
                                type="text"
                                name="bio"
                                value={editedUser.description}
                                onChange={handleInputChange}
                                placeholder="Bio"
                            />
                        </>
                    ) : (
                        <>
                            <h1>{user.name}</h1>
                            <p>{user.description}</p>
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
                                            />
                                        ) : (
                                            <>{contact ? contact.name : ''}</>
                                        )}
                                    </div>
                                )
                            );
                        })}
                    </div>

                    {!current ? (
                        <button className="message-button" onClick={handleMessageClick}>
                            <FontAwesomeIcon icon={faComment} /> Написать сообщение
                        </button>
                    ) : (
                        !isEditing ? (
                            <div>
                                <button className="message-button" onClick={handleEditSaveClick}>
                                    <FontAwesomeIcon icon={faPencil}/> Редактировать
                                </button>
                            </div>
                            ) : (
                                <div>
                                <button className="message-button" onClick={handleEditSaveClick}>
                                    <FontAwesomeIcon icon={faPencil}/> Сохранить
                                </button>
                                <button className="message-button" onClick={handleCancelEditClick}>
                                    <FontAwesomeIcon icon={faCross}/> Отмена
                                </button>
                                </div>
                            )
                    )}
                </div>
                {
                    userRole === 'executor' ?
                        <button className="newAppointmentButton" onClick={handleNewServiceClick}>
                            Добавить
                        </button> : <p></p>
                }
            </div>
            <div className="services-list">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} isProfile = {user.userId.toString() === userId.toString()}/>
                ))}
            </div>
        </div>
    );
}

export default Profile;
