import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../statics/admindashboard/adminDashboard.css';
import api from "../api/apiClient";

const AdminDashboard = () => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddLibrarian, setShowAddLibrarian] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // ---- Search by login ----
  const [loginSearch, setLoginSearch] = useState("");
  const [account, setAccount] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const login = loginSearch.trim();
    if (!login) {
      setAccount(null);
      return;
    }

    api.get("/account", { params: { login } })
      .then(res => setAccount(res.data))
      .catch(err => {
        if (err.response?.status === 404) {
          setAccount(null);
        } else {
          console.error("Error fetching account:", err);
        }
      });
  }, [loginSearch]);
  const handleUpdate = (e) => {
    e.preventDefault();
    api.patch(`/account/${account.account_id}`, {
      password: newPassword || undefined,
      role: newRole
    })
      .then(res => {
        alert("Zaktualizowano konto!");
        setAccount(res.data);
        setNewPassword("");
      })
      .catch(err => alert("Błąd aktualizacji: " + err));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search account by login…"
          value={loginSearch}
          onChange={e => setLoginSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Result & Update */}
      <div className="accounts-list">
        <h2>Account Details</h2>
        {account ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Login</th><th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{account.account_id}</td>
                  <td>{account.login}</td>
                  <td>{account.role}</td>
                </tr>
              </tbody>
            </table>

            <form className="section-content" onSubmit={handleUpdate}>
              <h3>Update Account</h3>
              <label>
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </label>
              <br />
              <label>
                Role:
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                >
                  <option value="student">student</option>
                  <option value="librarian">librarian</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              <br />
              <button type="submit">Update Account</button>
            </form>
          </>
        ) : (
          <p>No account found.</p>
        )}
      </div>


      <div className="section">
        <h3
          onClick={() => setShowAddStudent(!showAddStudent)}
          className="section-header"
        >
          {showAddStudent ? "▼" : "▶"} Add Student
          <p>Click to show options to add new student!</p>
        </h3>
        {showAddStudent && (
          <form
            className="section-content"
            onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              const name = form.name.value;
              const surname = form.surname.value;
              const phone_number = form.phone_number.value;
              api.post("/add_student", { name, surname, phone_number })
                 .then(() => alert("Student added successfully!"))
                 .catch(err => alert("Error adding student: " + err));
            }}
          >
            <label>
              Name:
              <input type="text" name="name" />
            </label><br/>
            <label>
              Surname:
              <input type="text" name="surname" />
            </label><br/>
            <label>
              Phone Number:
              <input type="text" name="phone_number" />
            </label><br/>
            <button type="submit">Add Student</button>
          </form>
        )}

        <hr/>

        <h3
          onClick={() => setShowAddLibrarian(!showAddLibrarian)}
          className="section-header"
        >
          {showAddLibrarian ? "▼" : "▶"} Add Librarian
          <p>Click to show options to add new librarian!</p>
        </h3>
        {showAddLibrarian && (
          <form
            className="section-content"
            onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              const login = form.login.value;
              const password = form.password.value;
              api.post("/add_librarian", { login, password })
                 .then(() => alert("Librarian added successfully!"))
                 .catch(err => alert("Error adding librarian: " + err));
            }}
          >
            <label>
              Login:
              <input type="text" name="login" />
            </label><br/>
            <label>
              Password:
              <input type="password" name="password" />
            </label><br/>
            <button type="submit">Add Librarian</button>
          </form>
        )}

        <hr/>

        <h3
          onClick={() => setShowAddAdmin(!showAddAdmin)}
          className="section-header"
        >
          {showAddAdmin ? "▼" : "▶"} Add Admin
          <p>Click to show options to add new admin!</p>
        </h3>
        {showAddAdmin && (
          <form
            className="section-content"
            onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              const login = form.login.value;
              const password = form.password.value;
              api.post("/add_admin", { login, password })
                 .then(() => alert("Admin added successfully!"))
                 .catch(err => alert("Error adding admin: " + err));
            }}
          >
            <label>
              Login:
              <input type="text" name="login" />
            </label><br/>
            <label>
              Password:
              <input type="password" name="password" />
            </label><br/>
            <button type="submit">Add Admin</button>
          </form>
        )}

        <button onClick={() => navigate("/librarian-dashboard")}>
          Go to Librarian Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
