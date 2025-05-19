import React, { useState } from "react";
import api from "../api/apiClient";

const AdminDashboard = () => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddLibrarian, setShowAddLibrarian] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showUpdateAccount, setShowUpdateAccount] = useState(false);

  const [foundUser, setFoundUser] = useState(null);
  const [userLogin, setUserLogin] = useState("");

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Add Student Section */}
      <div className="section">
        <h3 onClick={() => setShowAddStudent(!showAddStudent)} className="section-header">
          {showAddStudent ? "▼" : "▶"} Add Student
        </h3>
        <p>Click to show options to add new student!</p>

        {showAddStudent && (
          <form
            className="section-content"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const name = form.name.value;
              const surname = form.surname.value;
              const phone_number = form.phone_number.value;

              api.post("/add_student", { name, surname, phone_number })
                .then(() => alert("Student added successfully!"))
                .catch((error) => alert("Error adding student: " + error));
            }}
          >
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
            <br />
            <label>
              Surname:
              <input type="text" name="surname" required />
            </label>
            <br />
            <label>
              Phone Number:
              <input type="text" name="phone_number" required />
            </label>
            <br />
            <button type="submit">Add Student</button>
          </form>
        )}

        <hr />

        <h3 onClick={() => setShowAddLibrarian(!showAddLibrarian)} className="section-header">
          {showAddLibrarian ? "▼" : "▶"} Add Librarian
        </h3>
        <p>Click to show options to add new librarian!</p>

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
              <input type="text" name="login" required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" required />
            </label>
            <br />
            <button type="submit">Add Librarian</button>
          </form>
        )}

        <hr />

        <h3 onClick={() => setShowAddAdmin(!showAddAdmin)} className="section-header">
          {showAddAdmin ? "▼" : "▶"} Add Admin
        </h3>
        <p>Click to show options to add new admin!</p>

        {showAddAdmin && (
          <form
            className="section-content"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const login = form.login.value;
              const password = form.password.value;

              api.post("/add_admin", { login, password })
                .then(() => alert("Admin added successfully!"))
                .catch((error) => alert("Error adding admin: " + error));
            }}
          >
            <label>
              Login:
              <input type="text" name="login" required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" required />
            </label>
            <br />
            <button type="submit">Add Admin</button>
          </form>
        )}

        <hr />

        <h3 onClick={() => setShowUpdateAccount(!showUpdateAccount)} className="section-header">
          {showUpdateAccount ? "▼" : "▶"} Update Account
        </h3>
        <p>Click to show options to update account!</p>

        {showUpdateAccount && (
          <div className="section-content">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                api
                  .get(`/admin/account/${userLogin}`)
                  .then((res) => setFoundUser(res.data))
                  .catch(() => alert("User not found"));
              }}
            >
              <label>
                Login:
                <input
                  type="text"
                  value={userLogin}
                  onChange={(e) => setUserLogin(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Find User</button>
            </form>

            {foundUser && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const updatedPassword = form.password.value;
                  const updatedRole = form.role.value;

                  api
                    .patch(`/admin/account/${foundUser.account_id}`, {
                      ...(updatedPassword && { password: updatedPassword }),
                      ...(updatedRole && { role: updatedRole }),
                    })
                    .then(() => alert("User updated successfully!"))
                    .catch((error) => alert("Error updating user: " + error));
                }}
              >
                <p>
                  <strong>Login:</strong> {foundUser.login}
                </p>
                <label>
                  New Password:
                  <input type="password" name="password" />
                </label>
                <br />
                <label>
                  Role:
                  <select name="role" defaultValue={foundUser.role}>
                    <option value="student">student</option>
                    <option value="librarian">librarian</option>
                    <option value="admin">admin</option>
                  </select>
                </label>
                <br />
                <button type="submit">Update User</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
