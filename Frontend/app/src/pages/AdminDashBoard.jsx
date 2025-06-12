import React, { useState, useEffect } from "react";
import "../statics/admindashboard/adminDashboard.css";
import api from "../api/apiClient";

const AdminDashboard = () => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [account, setAccount] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddLibrarian, setShowAddLibrarian] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showManageAccounts, setShowManageAccounts] = useState(false);

  const fetchAccounts = () => {
    api.get("/accounts")
      .then(res => {
        setAllAccounts(res.data);
        setFilteredAccounts(res.data);
      })
      .catch(err => console.error("Error fetching accounts:", err));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredAccounts(
      allAccounts.filter(acc => acc.login.toLowerCase().includes(query))
    );
  }, [searchQuery, allAccounts]);

  const handleSelectAccount = (acc) => {
    setAccount(acc);
    setNewPassword("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.patch(`/account/${account.account_id}`, {
      password: newPassword || undefined,
      role: account.role
    })
      .then(res => {
        alert("Zaktualizowano konto!");
        setAccount(res.data);
        setNewPassword("");
        setAllAccounts(prev =>
          prev.map(a => (a.account_id === res.data.account_id ? res.data : a))
        );
      })
      .catch(err => alert("Błąd aktualizacji: " + err));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      api.delete(`/account/${account.account_id}`)
        .then(() => {
          alert("Account deleted");
          setAllAccounts(prev =>
            prev.filter(a => a.account_id !== account.account_id)
          );
          setAccount(null);
        })
        .catch(err => alert("Error deleting account: " + err));
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="section">
        <h2>Add Users</h2>

        <h3 onClick={() => setShowAddStudent(!showAddStudent)} className="section-header">
          {showAddStudent ? "▼" : "▶"} Add Student
        </h3>
        {showAddStudent && (
          <form className="section-content" onSubmit={e => {
            e.preventDefault();
            const { name, surname, phone_number } = e.target;
            api.post("/add_student", {
              name: name.value,
              surname: surname.value,
              phone_number: phone_number.value
            }).then(() => {
              alert("Student added!");
              fetchAccounts();
              e.target.reset();
            }).catch(err => alert("Error: " + err));
          }}>
            <label>Name: <input name="name" required /></label><br />
            <label>Surname: <input name="surname" required /></label><br />
            <label>Phone Number: <input name="phone_number" /></label><br />
            <button type="submit">Add Student</button>
          </form>
        )}

        <hr />

        <h3 onClick={() => setShowAddLibrarian(!showAddLibrarian)} className="section-header">
          {showAddLibrarian ? "▼" : "▶"} Add Librarian
        </h3>
        {showAddLibrarian && (
          <form className="section-content" onSubmit={e => {
            e.preventDefault();
            const { login, password } = e.target;
            api.post("/add_librarian", {
              login: login.value,
              password: password.value
            }).then(() => {
              alert("Librarian added!");
              fetchAccounts();
              e.target.reset();
            }).catch(err => alert("Error: " + err));
          }}>
            <label>Login: <input name="login" required /></label><br />
            <label>Password: <input type="password" name="password" required /></label><br />
            <button type="submit">Add Librarian</button>
          </form>
        )}

        <hr />

        <h3 onClick={() => setShowAddAdmin(!showAddAdmin)} className="section-header">
          {showAddAdmin ? "▼" : "▶"} Add Admin
        </h3>
        {showAddAdmin && (
          <form className="section-content" onSubmit={e => {
            e.preventDefault();
            const { login, password } = e.target;
            api.post("/add_admin", {
              login: login.value,
              password: password.value
            }).then(() => {
              alert("Admin added!");
              fetchAccounts();
              e.target.reset();
            }).catch(err => alert("Error: " + err));
          }}>
            <label>Login: <input name="login" required /></label><br />
            <label>Password: <input type="password" name="password" required /></label><br />
            <button type="submit">Add Admin</button>
          </form>
        )}
      </div>

      <div className="section">
        <h3
          onClick={() => setShowManageAccounts(!showManageAccounts)}
          className="section-header"
        >
          {showManageAccounts ? "▼" : "▶"} Search & Manage Accounts
        </h3>

        {showManageAccounts && (
          <>
            <div className="section-content">
              <input
                type="text"
                placeholder="Search users by login…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />

              <div className="search-results-scroll">
                {filteredAccounts.map(acc => (
                  <div
                    key={acc.account_id}
                    className="search-result-item"
                    onClick={() => handleSelectAccount(acc)}
                  >
                    {acc.login} ({acc.role})
                  </div>
                ))}
              </div>
            </div>

            {account && (
              <div className="account-table-container">
                <table className="account-table">
                  <thead>
                    <tr><th>ID</th><th>Login</th><th>Role</th></tr>
                  </thead>
                  <tbody>
                    <tr  className="account-row">
                      <td>{account.account_id}</td>
                      <td>{account.login}</td>
                      <td>{account.role}</td>
                    </tr>
                  </tbody>
                </table>
                <form onSubmit={handleUpdate}>
                  <h3>Update Account</h3>

                  <label>
                    New Password:
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                    />
                  </label><br />

                  <label>
                    Change Role:
                    <select
                      value={account.role}
                      onChange={e => setAccount({ ...account, role: e.target.value })}
                    >
                      <option value="student">Student</option>
                      <option value="librarian">Librarian</option>
                    </select>
                  </label><br />

                  <button type="submit">Update Account</button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete Account
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
