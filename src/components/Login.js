import React, {useState, Fragment, useEffect, useContext} from "react";
import Cookies from 'js-cookie';
import "../styles/Login.css";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { ThemeContext } from './ThemeContext';
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {login} from "./api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);


    const handleEmailChange = (value) => {
        setEmail(value);
        if (value.trim() === "") {
            setEmailError("");
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError(translations[language]['PleaseEnterValidEmailAddress']);
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
                setPasswordError(translations[language]['PasswordValidation']);
            } else {
                setPasswordError("");
            }
        }
    };

    const handleSave = async () => {
        const data = {
            Email: email,
            Password: password,
            RememberMe: true,
        };

        if(email === null | password === null | email === '' || password === ""){
            return(
                toast.error("Fields are empty", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "Fields are empty",
                })
            );
        }

        const response = await login(navigate, data);
        if(response){
            localStorage.setItem('userName', response.name);
            localStorage.setItem('userId', response.id);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userRole', response.role);
            toast.success(translations[language]['Success'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Success',
            });
            navigate('/');
        }
    };

    return (
        <Fragment>
            <div className="login-container">
                <form className="login-form">
                    <div className={`login-header ${theme === 'dark' ? 'dark' : ''}`}>Login</div>
                    <label className={`login-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtEmail">Email</label>
                    <input
                        className={`login-input ${theme === 'dark' ? 'dark' : ''}`}
                        id="txtEmail"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                    />
                    {emailError && <div className="login-error">{emailError}</div>}
                    <label className={`login-label ${theme === 'dark' ? 'dark' : ''}`} htmlFor="txtPassword">{translations[language]['Password']}</label>
                    <input
                        className={`login-input ${theme === 'dark' ? 'dark' : ''}`}
                        type="password"
                        id="txtPassword"
                        placeholder={translations[language]['Password']}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    {passwordError && <div className="login-error">{passwordError}</div>}
                    <p className={`${theme === 'dark' ? 'register-redirect-text' : ''}`}>{translations[language]['DontHaveAnAccount']}? <Link className={`${theme === 'dark' ? 'register-redirect-link' : ''}`}to="/register">Register here</Link></p>
                    <button
                        type="button"
                        className={`register-button ${emailError || passwordError ? "" : "active"}`}
                        onClick={() => handleSave()}
                        //disabled={!email || !password || emailError || passwordError}
                    >
                        {translations[language]['SignIn']}
                    </button>
                </form>
            </div>
        </Fragment>
    );
}

export default Login;