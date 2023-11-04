import React, {useState, Fragment, useEffect} from "react";
import Cookies from 'js-cookie';
import "../styles/Login.css";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

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
                            // Handle error
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
                <div className="login-header">Login</div>
                    <label className="login-label" htmlFor="txtEmail">Email</label>
                    <input
                        className="login-input"
                        type="text"
                        id="txtEmail"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                    />
                    {emailError && <div className="login-error">{emailError}</div>}
                    <label className="login-label" htmlFor="txtPassword">Password</label>
                    <input
                        className="login-input"
                        type="password"
                        id="txtPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    {passwordError && <div className="login-error">{passwordError}</div>}
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    <button
                        type="button"
                        className={`register-button ${emailError || passwordError ? "" : "active"}`}
                        onClick={() => handleSave()}
                        //disabled={!email || !password || emailError || passwordError}
                    >
                        Sign-up
                    </button>
                </form>
            </div>
        </Fragment>
    );
}

export default Login;