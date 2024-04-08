import React, {useState, Fragment, useEffect, useContext} from "react";
import Cookies from 'js-cookie';
import "../styles/Login.css";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { ThemeContext } from './ThemeContext';
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";

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

    const handleSave = () => {
        const data = {
            Email: email,
            Password: password,
            RememberMe: true,
        };
        const url = "http://localhost:5155/account/login"; // some url

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
                            console.error('Error fetching data:', error);
                        });
                navigate("/")
            })
            .catch((error) => {
                alert(error);
            });
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