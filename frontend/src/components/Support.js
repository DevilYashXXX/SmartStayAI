import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { baseUrl } from '../components/common/baseUrl';

function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(baseUrl+'/api/support', formData)
      .then(response => {
        setSuccessMessage('Your housing support query has been submitted successfully.');
        setErrorMessage('');
        setFormData({
          name: '',
          email: '',
          message: ''
        }); // Clear form after successful submission
      })
      .catch(error => {
        setErrorMessage('There was an error submitting your query. Please try again.');
        setSuccessMessage('');
      });
  };

  return (
    <main className="main-content">
      {/* Watermark */}
      <div className="watermark">SmartStay AI</div>
      
      <h1>Support</h1>
      <p>Contact us for housing, verification, or booking assistance.</p>

      <h2>Contact Information</h2>
      <p>Email: <a href="mailto:support@smartstay.ai">support@smartstay.ai</a></p>
      <p>Phone: <a href="tel:123-456-7890">123-456-7890</a></p>

      <h2>FAQs</h2>
      <p>
        Check out our <a href="#support-form" className="faq-link">FAQs</a> for common housing questions.
      </p>

      <h2 id="support-form">Support Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleInputChange}
          required
        ></textarea>

        <button type="submit" className="btn">Submit</button>
      </form>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </main>
  );
}

export default Support;
