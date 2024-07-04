import React, {Fragment, useContext, useState} from 'react';
import '../styles/Register.css';
import {Link, useNavigate} from "react-router-dom";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {registerQuery} from "./api";

function Register() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');


    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleNameChange = (value) => {
        setName(value);
        if (value.trim() === '') {
            setNameError('Name cannot be empty');
        } else {
            const nameRegex = /^[A-Za-z@$_]+$/;
            if (!nameRegex.test(value)) {
                setNameError('Name can only contain letters and @ $ _');
            } else {
                setNameError('');
            }
        }
    };

    const handlePhoneChange = (value) => {
        setPhone(value);
        if (value.trim() === '') {
            setPhoneError('Name cannot be empty');
        } else {
            const phoneRegex = /^[A-Za-z@$_]+$/;
            if (!phoneRegex.test(value)) {
                setPhoneError('Name can only contain letters and @ $ _');
            } else {
                setPhoneError('');
            }
        }
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        if (value !== password) {
            setConfirmPasswordError("Passwords must match");
        } else {
            setConfirmPasswordError("");
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
        setPassword(value);
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
            Name: name,
            Email: email,
            Password: password,
            ConfirmPassword: confirmPassword,
            Phone: phone,
        };

        registerQuery(navigate, data)
            .then(serverData => {
                localStorage.setItem('userName', serverData.name);
                localStorage.setItem('userId', serverData.id);
                localStorage.setItem('userEmail', serverData.email);
                localStorage.setItem('userRole', serverData.role);
                navigate("/")
                window.location.reload()
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
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    {password && <div className="register-error">{passwordError}</div>}
                    <label className={`register-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtConfirmPassword">{translations[language]['ConfirmPassword']}</label>
                    <input
                        className={`register-input ${theme === 'dark' ? 'dark' : ''}`}
                        type="password"
                        id="txtConfirmPassword"
                        placeholder={translations[language]['ConfirmPassword']}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    />
                    {confirmPasswordError && <div className="register-error">{confirmPasswordError}</div>}
                    <label className={`register-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtName">{translations[language]['Phone']}</label>
                    <input
                        className={`register-input ${theme === 'dark' ? 'dark' : ''}`}
                        id="txtPhone"
                        placeholder={translations[language]['Phone']}
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                    {nameError && <div className="register-error">{nameError}</div>}
                    <p className={`${theme === 'dark' ? 'login-redirect-text' : ''}`}>{translations[language]['YouAlreadyHaveAnAccount']}? <Link className={`${theme === 'dark' ? 'login-redirect-link' : ''}`} to="/login">Login here</Link></p>
                    <button
                        className={`register-button ${nameError || emailError || passwordError || confirmPasswordError ? "" : "active"}`}
                        onClick={() => handleSave()}
                        //disabled={!name || !email || !password || !confirmPassword || !role ||nameError || emailError || passwordError || confirmPasswordError}
                    >
                        {translations[language]['SignUp']}
                    </button>
                </form>
            </div>
        </Fragment>
    );
}
export default Register;