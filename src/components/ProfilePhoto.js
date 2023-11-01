import React from 'react';
import '../styles/ProfilePhoto.css';

const ProfilePhoto = ({ photoUrl }) => {
    return (
        <div className="profile-photo">
            <img src={photoUrl} alt="User" />
        </div>
    );
};

export default ProfilePhoto;
