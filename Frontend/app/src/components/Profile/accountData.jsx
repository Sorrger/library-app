import React from "react";
import "../../statics/profile/accountData.css"

const AccountData = ({ account }) => {
    return (
        <div className="profile-section">
            <h2 className="section-title">Account Details</h2>
            <p><strong>Login:</strong> {account.login}</p>
            <p><strong>Role:</strong> {account.role}</p>
            <p><strong>Student ID:</strong> {account.student_id || "N/A"}</p>
            <p><strong>Account ID:</strong> {account.account_id}</p>
        </div>
    );
};

export default AccountData;
