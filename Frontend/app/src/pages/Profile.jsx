import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import AccountData from "../components/Profile/accountData"; 
import StudentData from "../components/Profile/studentData";  
import "../statics/profile/page.css"; 

export default function Profile() {
  const [account, setAccount] = useState(null);
  const [student, setStudent] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: acct } = await api.get('/me');
        setAccount(acct);

        if (acct.student_id) {
          const [studentRes, resRes, borRes] = await Promise.all([
            api.get(`/students/${acct.student_id}`),
            api.get(`/students/${acct.student_id}/reservations`),
            api.get(`/students/${acct.student_id}/borrowed`)
          ]);

          setStudent(studentRes.data);
          setReservations(resRes.data);
          setBorrowed(borRes.data);
        }
      } catch (err) {
        console.error(err);
        setError('Error loading profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error)   return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1 className="profile-title">Your Profile</h1>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <AccountData account={account} />
          {student && (
            <StudentData
              student={student}
              reservations={reservations}
              borrowed={borrowed}
              onCancelReservation={(id) => setReservations(rs => rs.filter(r => r.id !== id))}
              onReturnBorrowed={(id) => setBorrowed(bs => bs.filter(b => b.id !== id))}
            />
          )}
        </div>
      </main>
    </div>
  );
}
