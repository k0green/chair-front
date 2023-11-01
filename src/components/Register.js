import React, { Fragment, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

import '../styles/Register.css';
import {Link, useNavigate} from "react-router-dom";

function Register() {
    const options = [
        {value: 'someId1', label: 'admin'},
        {value: 'someId2', label: 'user'},
    ];

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
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

    const handleRoleChange = (value) => {
        setRole(value);
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

        const url = "http://localhost:5155/account/register"; // Update the URL to the registration endpoint

        axios
            .post(url, data)
            .then((result) => {
                localStorage.setItem('token', result.data);
                navigate("/");
            })
            .catch((error) => {
                alert(error);
            });
    };

    return (
        <Fragment>
            <div className="register-container">
                <form className="register-form">
                    <div className="register-header">Register</div>
                    <label className="register-label" htmlFor="txtName">Name</label>
                    <input
                        className="register-input"
                        type="text"
                        id="txtName"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    {nameError && <div className="register-error">{nameError}</div>}
                    <label className="register-label" htmlFor="txtEmail">Email</label>
                    <input
                        className="register-input"
                        type="text"
                        id="txtEmail"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                    />
                    {emailError && <div className="register-error">{emailError}</div>}
                    <label className="register-label" htmlFor="txtPassword">Password</label>
                    <input
                        className="register-input"
                        type="password"
                        id="txtPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    {password && <div className="register-error">{passwordError}</div>}
                    <label className="register-label" htmlFor="txtConfirmPassword">Confirm password</label>
                    <input
                        className="register-input"
                        type="password"
                        id="txtConfirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    />
                    {confirmPasswordError && <div className="register-error">{confirmPasswordError}</div>}
                    <label className="register-label" htmlFor="txtName">Phone</label>
                    <input
                        className="register-input"
                        type="text"
                        id="txtPhone"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                    {nameError && <div className="register-error">{nameError}</div>}
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                    <button
                        className={`register-button ${nameError || emailError || passwordError || confirmPasswordError ? "" : "active"}`}
                        onClick={() => handleSave()}
                        //disabled={!name || !email || !password || !confirmPassword || !role ||nameError || emailError || passwordError || confirmPasswordError}
                    >
                        Sign-up
                    </button>
                </form>
            </div>
        </Fragment>
    );
}
export default Register;