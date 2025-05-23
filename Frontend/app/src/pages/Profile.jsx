import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import AccountData from "../components/Profile/accountData"; 
import StudentData from "../components/Profile/studentData";  
import "../statics/profile/page.css"; 

export default function Profile() {
    const [account, setAccount] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const accountResponse  = await api.get("/me");
            setAccount(accountResponse.data);

            if (accountResponse.data.student_id) {
                const studentResponse = await api.get(`/students/${accountResponse.data.student_id}`);
                setStudent(studentResponse.data);
            }
        } catch (err) {
            setError("Error loading profile.");
        } finally {
            setLoading(false);
        }
        };
    
        fetchProfile();
    }, []);
    
    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }
    
    if (error) {
        return <div className="profile-error">{error}</div>;
    }
    
    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1 className="profile-title">Your Profile</h1>
            </header>
    
            <main className="profile-main">
                <div className="profile-card">
                    <AccountData account={account} />
                    {student && <StudentData student={student} />}
                </div>
            </main>
        </div>
    );
}
