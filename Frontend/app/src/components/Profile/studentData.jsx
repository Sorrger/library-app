import React from "react";
import "../../statics/profile/studentData.css"
const StudentData = ({ student }) => {
    return (
        <div className="profile-section">
            <h2 className="section-title">Student Data</h2>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Surname:</strong> {student.surname}</p>
            <p><strong>Phone number:</strong> {student.phone_number ?? "Brak numeru"}</p>
        </div>
    );
};

export default StudentData;
