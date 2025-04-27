import React from "react";
import "../../statics/profile/StudentData.css"
const StudentData = ({ student }) => {
    return (
        <div className="profile-section">
            <h2 className="section-title">Dane Studenta</h2>
            <p><strong>Imię:</strong> {student.name}</p>
            <p><strong>Nazwisko:</strong> {student.surname}</p>
            <p><strong>Telefon:</strong> {student.phone_number ?? "Brak numeru"}</p>
        </div>
    );
};

export default StudentData;
