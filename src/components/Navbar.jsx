

import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Style/Navbar.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  getCurrentUser,
  logoutUser,
  updateUserPhoto
} from '../services/authService';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [showProfile, setShowProfile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Login ke baad user details update karna
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [location.pathname]);

  // Logout function
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setShowProfile(false);
    navigate('/auth');
  };
  const fileInputRef = useRef(null);

const handlePhotoChange = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image.");
    return;
  }

  if (file.size > 1024 * 1024) {
    alert("Please select an image smaller than 1 MB.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    const photo = reader.result;

    updateUserPhoto(currentUser.id, photo);

    setCurrentUser({
      ...currentUser,
      photo
    });
  };

  reader.readAsDataURL(file);
};

  return (
    <nav className="navbar">

      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <span>☸ Bharat Bytes</span>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><a href="/#learn">Learn</a></li>
        <li><a href="/#community">Community</a></li>
        <li><Link to="/favorites">My Favourites</Link></li>
      </ul>

      <div className="nav-actions">

        {currentUser ? (

          <div className="profile-container">

            <button
             
  className="profile-button"
  onClick={() => setShowProfile(!showProfile)}
  type="button"
>
  {currentUser.photo ? (
    <img
      src={currentUser.photo}
      alt="Profile"
      className="profile-avatar"
    />
  ) : (
    <div className="profile-avatar">
      {currentUser.name?.charAt(0).toUpperCase() || "U"}
    </div>
  )}
</button>
            

            {showProfile && (
              <div className="profile-dropdown">

                <div className="nav-profile-details">

  {currentUser.photo ? (
    <img
      src={currentUser.photo}
      alt="Profile"
      className="nav-profile-avatar-large"
    />
  ) : (
    <div className="nav-profile-avatar-large">
      {currentUser.name?.charAt(0).toUpperCase() || "U"}
    </div>
  )}

  <h4>{currentUser.name || "User"}</h4>
  <p>{currentUser.email}</p>

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handlePhotoChange}
    style={{ display: "none" }}
  />

  <button
    type="button"
    className="change-photo-button"
    onClick={() => fileInputRef.current.click()}
  >
    📷 Change Profile Photo
  </button>

</div>

<div className="dropdown-divider"></div>

                <button
                  className="logout-button"
                  onClick={handleLogout}
                  type="button"
                >
                  ↪ Logout
                </button>

              </div>
            )}

          </div>

        ) : (

          <Link to="/auth" className="btn-login">
            Login / Sign Up
          </Link>

        )}

      </div>

    </nav>
  );
}
