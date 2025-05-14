import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8080/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch profile data.");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:8080/api/user/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessage("Password changed successfully");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch((err) => {
        if (err.response) {
          setMessage(err.response.data.message || "Password change failed");
        } else {
          setMessage("Server error");
        }
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container" style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>

      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>

      {message && <p style={{ color: message.includes("successfully") ? "green" : "red", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default Profile;
