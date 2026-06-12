import React from 'react';
import '../App.css';
import { FaCalendarCheck } from 'react-icons/fa';

function UserProfile() {
  return (
    <main className="main-content">
      <h1>Student Profile</h1>
      <p>Manage your profile, housing preferences, and booking requests.</p>
      <h2>Profile Information</h2>
      <form>
        <label htmlFor="username">Name:</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="college">College:</label>
        <input type="text" id="college" name="college" />
        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" />
        <button type="submit" className="btn">Update Profile</button>
      </form>
      <h2>Booking Requests</h2>
      <div className="order-tracking">
        <p>Track owner confirmations and visit schedules.</p>
        <button type="button" className="btn">
          <FaCalendarCheck size={20} /> View Requests
        </button>
      </div>
    </main>
  );
}

export default UserProfile;
