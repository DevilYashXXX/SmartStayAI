import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import Modal from "../components/Modal";
import { baseUrl } from "../components/common/baseUrl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import your custom AuthContext

const RegisterPage = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const [option, setOption] = useState(null); // 'register' or 'login'
  const [userType, setUserType] = useState(null); // 'student' or 'owner'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    propertyDetails: "",
    password: "",
    confirmPassword: "", // For confirmation in registration
  });
  const [error, setError] = useState(""); // Error message state

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleOptionSelect = (selectedOption) => {
    setOption(selectedOption);
    setModalOpen(false);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (option === "register" && !userType) {
      setError("Please select a role (Student or Property Owner)");
      return;
    }

    if (
      option === "register" &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    let path;
    if (option === "register") {
      path = "register";
    } else {
      path = "login";
    }

    // Prepare form data based on user type
    const data = {
      ...formData,
      userType: userType || null,
    };

    axios
      .post(`${baseUrl}/api/${path}`, data)
      .then((response) => {
        console.log("Response data:", response.data);
        if (response.data.token) {
          login(response.data.token, response.data.data?.user_type); // Set token and update auth context
          navigate("/"); // Redirect to home or desired route on successful login
        } else {
          // Handle registration success or errors
          alert(response.data.message || "Registration successful");
        }
      })
      .catch((error) => {
        console.error("There was an error:", error);
        // Handle error feedback
        alert("There was an error. Please try again.");
      });
  };

  return (
    <div className="register-page">
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSelectOption={handleOptionSelect}
      />
      {option && (
        <>
          <h2>
            {option.charAt(0).toUpperCase() + option.slice(1)} as a{" "}
            {userType
              ? userType.charAt(0).toUpperCase() + userType.slice(1)
              : "User"}
          </h2>
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          {/* Display error message */}
          <form onSubmit={handleSubmit}>
            {option === "register" && (
              <>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  required
                />

                <label>Current Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <div className="address-details">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />

                  <label>State:</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />

                  <label>Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />

                  <label>Postal Code:</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="user-type-selection">
                  <label>
                    <input
                      type="radio"
                      value="student"
                      checked={userType === "student"}
                      onChange={handleUserTypeChange}
                    />
                    Student
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="owner"
                      checked={userType === "owner"}
                      onChange={handleUserTypeChange}
                    />
                    Property Owner
                  </label>
                </div>

                {userType === "owner" && (
                  <>
                    <label>Property Details:</label>
                    <input
                      type="text"
                      name="propertyDetails"
                      value={formData.propertyDetails}
                      onChange={handleInputChange}
                      required
                    />
                  </>
                )}

                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />

                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}

            {option === "login" && (
              <>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />

                <label>Forgot Password?</label>
                <input type="text" placeholder="Enter your email" />
              </>
            )}

            <button type="submit">
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
