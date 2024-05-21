import React, {Fragment, useContext, useEffect, useState} from 'react';
import Select from 'react-select';
import axios from 'axios';

import '../styles/Register.css';
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";

function Register() {


    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [userData, setUserData] = useState([]);
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        const userId = localStorage.getItem('userId')
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            axios.get(`http://localhost:5155/account/user-info/edit/${userId}`)
                .then(response => {
                    // Преобразование данных с сервера в необходимый формат
                    const userData = {
                        id: response.data.id,
                        name: response.data.name,
                        email: response.data.email,
                    };

                    setUserData(userData);
                    setEmail(userData.email);
                    setName(userData.name);
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
    }, []);

    const handleNameChange = (value) => {
        setName(value);
        if (value.trim() === '') {
            setNameError('Name cannot be empty');
        } else {
            const nameRegex = /^[А-Яа-яA-Za-z@$_ ]+$/;
            if (!nameRegex.test(value)) {
                setNameError('Name can only contain letters and @ $ _');
            } else {
                setNameError('');
            }
        }
    };

    const handleEmailChange = (value) => {
        console.log("Save button clicked");
        setEmail(value);
        if (value.trim() === "") {
            setEmailError("");
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError("Please enter a valid email address");
            } else {
                setEmailError("");
            }
        }
    };

    const handlePasswordChange = (value) => {
        setOldPassword(value);
        if (value.trim() === "") {
            setPasswordError("");
        } else {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{6,}$/;
            if (!passwordRegex.test(value)) {
                setPasswordError("Please enter a valid password with at least 6 characters, 1 uppercase letter, 1 number, and 1 special character");
            } else {
                setPasswordError("");
            }
        }
    };

    const handleNewPasswordChange = (value) => {
        setNewPassword(value);
        if (value.trim() === "") {
            setPasswordError("");
        } else {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{6,}$/;
            if (!passwordRegex.test(value)) {
                setPasswordError("Please enter a valid password with at least 6 characters, 1 uppercase letter, 1 number, and 1 special character");
            } else {
                setPasswordError("");
            }
        }
    };

    const handleSave = () => {
        const data = {
            Id: userData.id,
            Name: name,
            Email: email,
            OldPassword: oldPassword,
            NewPassword: newPassword,
        };

        console.log(data);
        const url = "http://localhost:5155/account/user-info/edit"; // Update the URL to the registration endpoint

        axios
            .post(url, data)
            .then((result) => {
                Cookies.set('token', result.data, { expires: 1 });
                axios.get(`http://localhost:5155/account/user-info?email=`+data.Email)
                    .then(response => {
                        const serverData = {
                            id: response.data.id,
                            name: response.data.name,
                            email: response.data.email,
                            role: response.data.role
                        }
                        console.log(serverData)
                        localStorage.setItem('userName', serverData.name);
                        localStorage.setItem('userId', serverData.id);
                        localStorage.setItem('userEmail', serverData.email);
                        localStorage.setItem('userRole', serverData.role);
                    })
                    .catch(error => {
                        // Handle error
                        console.error('Error fetching data:', error);
                    });
                navigate("/")
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
                alert(error);
            });
    };

    return (
        <Fragment>
            <div className="register-container">
                <form className="register-form">
                    <div className={`register-header ${theme === 'dark' ? 'dark' : ''}`}>{translations[language]['Register']}</div>
                    <label className={`register-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtName">{translations[language]['Name']}</label>
                    <input
                        className={`register-input ${theme === 'dark' ? 'dark' : ''}`}
                        id="txtName"
                        placeholder={translations[language]['Name']}
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    {nameError && <div className="register-error">{nameError}</div>}
                    <label className={`register-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtEmail">Email</label>
                    <input
                        className={`register-input ${theme === 'dark' ? 'dark' : ''}`}
                        id="txtEmail"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                    />
                    {emailError && <div className="register-error">{emailError}</div>}
                    <label className={`register-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtPassword">{translations[language]['Password']}</label>
                    <input
                        className={`register-input ${theme === 'dark' ? 'dark' : ''}`}
                        type="password"
                        id="txtPassword"
                        placeholder={translations[language]['Password']}
                        value={oldPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    {oldPassword && <div className="register-error">{passwordError}</div>}
                    <label className={`register-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtConfirmPassword">{translations[language]['ConfirmPassword']}</label>
                    <input
                        className={`register-input ${theme === 'dark' ? 'dark' : ''}`}
                        type="password"
                        id="txtConfirmPassword"
                        placeholder={translations[language]['ConfirmPassword']}
                        value={newPassword}
                        onChange={(e) => handleNewPasswordChange(e.target.value)}
                    />
                    {confirmPasswordError && <div className="register-error">{confirmPasswordError}</div>}
                    <button
                        className={`register-button ${nameError || emailError || passwordError || confirmPasswordError ? "" : "active"}`}
                        onClick={() => handleSave()}
                        //disabled={!name || !email || !password || !confirmPassword || !role ||nameError || emailError || passwordError || confirmPasswordError}
                    >
                        {translations[language]['Save']}
                    </button>
                </form>
            </div>
        </Fragment>
    );
}
export default Register;