import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import EditionInfo from "../components/EditionDetails/EditionInfo";
import "../statics/editionDetails/page.css";

const EditionDetails = () => {
  const { id } = useParams();
  const [edition, setEdition] = useState(null);
  const [student, setStudent] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const editionRes = await api.get(`/editions/${id}`);
        setEdition(editionRes.data);

        const accountRes = await api.get("/me");
        setAccount(accountRes.data);

        if (accountRes.data.student_id) {
          const studentRes = await api.get(`/students/${accountRes.data.student_id}`);
          setStudent(studentRes.data);
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReservation = async () => {
    if (!edition?.edition_id) return;
    if (!student) {
      alert("Student data is missing.");
      return;
    }
    if (student.books_limit <= 0) {
      alert("You have reached your book limit. Please return some books before reserving.");
      return;
    }

    try {
      await api.post(`/students/${account.student_id}/loans`, {
        edition_id: edition.edition_id,
        loan_date: new Date().toISOString(),
      });

      await api.patch(`/editions/${edition.edition_id}/reserved/`);

      await api.patch(`/students/${account.student_id}/limit-decrease`);

      setEdition({ ...edition, status: "reserved" });

      alert("Reservation successful!");
    } catch (err) {
      alert("Reservation failed: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edition-details">
      <EditionInfo edition={edition} />
      {account?.role === "student" ? (
        edition?.status === "available" ? (
          <button className="reserve-button" onClick={handleReservation}>
            Reserve This Edition
          </button>
        ) : (
          <p className="already-reserved">This edition is currently not available.</p>
        )
      ) : null}
    </div>
  );
};

export default EditionDetails;
