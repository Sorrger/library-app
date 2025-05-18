import React, { useState } from "react";
import api from "../api/apiClient";

const AdminDashboard = () => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddLibrarian, setShowAddLibrarian] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="section">
        <h3 onClick={() => setShowAddStudent(!showAddStudent)} 
            className="section-header">
            {showAddStudent ? "▼" : "▶"} Add Student
            <p>Click to show options to add new student!</p>
        </h3>

        {showAddStudent && (
          <form
            className="section-content"
            onSubmit={(e) => {
                e.preventDefault();

                const form = e.target;
                const name = form.name.value;
                const surname = form.surname.value;
                const phone_number = form.phone_number.value;

                api.post("/add_student", {name, surname, phone_number})
                    .then(() => alert("Student added successfully!"))
                    .catch((error) => alert("Error adding student: " + error));

            }}
          >
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <br />
            <label>
              Surname:
              <input type="text" name="surname" />
            </label>
            <br />
            <label>
              Phone Number:
              <input type="text" name="phone_number" />
            </label>
            <br />
            <button type="submit">Add Student</button>
          </form>
        )}
        <hr></hr>
        <h3 onClick={() => setShowAddLibrarian(!showAddLibrarian)} 
            className="section-header">
            {showAddLibrarian ? "▼" : "▶"} Add Librarian
            <p>Click to show options to add new librarian!</p>
        </h3>
        
        {showAddLibrarian && (
          <form
            className="section-content"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const login = form.login.value;
              const password = form.password.value;
              api.post("/add_librarian", { login, password })
                .then(() => alert("Librarian added successfully!"))
                .catch((error) => alert("Error adding librarian: " + error));

            }}
          >
            <label>
              Login:
              <input type="text" name="login" />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" />
            </label>
            <button type="submit">Add Librarian</button>
          </form>
        )}
        <hr></hr>
        <h3 onClick={() => setShowAddAdmin(!showAddAdmin)} 
            className="section-header">
            {showAddAdmin ? "▼" : "▶"} Add Admin
            <p>Click to show options to add new admin!</p>

        </h3>
                {showAddAdmin && (
          <form
            className="section-content"
            onSubmit={(e) => {
              e.preventDefault();
                const form = e.target;
                const login = form.login.value;
                const password = form.password.value;
                api.post(("add_admin"), { login, password})
                .then(() => alert("Admin added successfully!"))
                .catch((error) => alert("Error adding admin: " + error));
            }}
          >
            <label>
              Login:
              <input type="text" name="login" />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" />
            </label>
            <button type="submit">Add new admin!</button>
            </form>
            )}
        </div>
    </div>
    
  );
};

export default AdminDashboard;
