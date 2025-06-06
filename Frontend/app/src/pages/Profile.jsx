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

  const handleCancelReservation = async (reservationId) => {
    try {
      if (!account.student_id) {
        alert("Brak danych studenta, nie można anulować rezerwacji.");
        return;
      }

      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) return;

      const editionId = reservation.edition?.edition_id;
      if (!editionId) throw new Error("Missing edition ID");

      await api.patch(`/loans/${editionId}/return`);
      await api.patch(`/editions/${editionId}/available/`);
      await api.patch(`/students/${account.student_id}/limit-increase`);


      setReservations(prev => prev.filter(r => r.id !== reservationId));

      const { data: updatedStudent } = await api.get(`/students/${account.student_id}`);
      setStudent(updatedStudent);


    } catch (err) {
      console.error("Nie udało się anulować rezerwacji:", err);
      alert("Wystąpił błąd podczas anulowania rezerwacji.");
    }
  };


  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;

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
              onCancelReservation={handleCancelReservation}
              onReturnBorrowed={(id) => setBorrowed(bs => bs.filter(b => b.id !== id))}
            />
          )}
        </div>
      </main>
    </div>
  );
}
