import React from "react";
import "../../statics/profile/accountData.css"

const AccountData = ({ account }) => {
    return (
        <div className="profile-section">
            <h2 className="section-title">Account Details</h2>
            <p><strong>Login:</strong> {account.login}</p>

        </div>
    );
};

export default AccountData;
