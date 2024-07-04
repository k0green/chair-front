import React, {Fragment, useContext, useEffect, useState} from 'react';
import '../styles/Register.css';
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {getEditUserInfo, getUserInfoForEdit} from "./api";

function Register() {


    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [userData, setUserData] = useState([]);
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        getUserInfoForEdit( navigate, userId)
            .then(response => {
                setUserData(userData);
                setEmail(userData.email);
                setName(userData.name);
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
                setPasswordError("Please enter a valid password with at least 6 characters," +
                    " 1 uppercase letter, 1 number, and 1 special character");
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
                setPasswordError("Please enter a valid password with at least 6 characters," +
                    " 1 uppercase letter, 1 number, and 1 special character");
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

        getEditUserInfo( navigate, data)
            .then(serverData => {
                localStorage.setItem('userName', serverData.name);
                localStorage.setItem('userId', serverData.id);
                localStorage.setItem('userEmail', serverData.email);
                localStorage.setItem('userRole', serverData.role);
                navigate("/")
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