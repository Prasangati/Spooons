import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../EditProfile.css";
import BASE_URL from "../utils/config";
import api from "../utils/axiosConfig";

const EditProfile = ({ userId }) => {
  const [profile, setProfile] = useState({ username: "", email: "", password: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

    // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`${BASE_URL}/api/users/${userId}`);
        setProfile({
          username: response.data.username || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.patch(`${BASE_URL}/api/users/${userId}`, profile);
      if (response.status === 200) {
        setMessage("Profile updated successfully!");
        setTimeout(() => navigate(`/profile/${userId}`), 1000);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="edit-profile-container">
            <form className="edit-profile-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password"/>
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio:</label>
                    <textarea id="bio" name="bio" placeholder="Write a short bio about yourself"></textarea>
                </div>
                <button type="submit" className="edit-profile-btn">Save Changes</button>
            </form>
        </div>
    );
}