import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import EditionInfo from "../components/EditionDetails/EditionInfo";
import "../statics/editionDetails/page.css";

const EditionDetails = () => {
  const { id } = useParams();
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchEditionDetails = async () => {
      try {
        const response = await api.get(`/editions/${id}`);
        setEdition(response.data);
      } catch (err) {
        setError("Failed to load edition details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAccount = async () => {
      try {
        const res = await api.get("/me");
        setAccount(res.data);
      } catch (e) {
        console.error("Failed to fetch account data.");
      }
    };

    fetchEditionDetails();
    fetchAccount();
  }, [id]);

  const handleReservation = async () => {
    if (!edition?.edition_id) return;

    try {
      // utworzenie loanu
      await api.post(`/students/${account.student_id}/loans`, {
        edition_id: edition.edition_id,
        loan_date: new Date().toISOString(),
      });

      // zmiana statusu edycji
      await api.patch(`/editions/${edition.edition_id}/reserved/`);

      // zmniejszenie limitu studenta
      await api.patch(`/students/${account.student_id}/limit-decrease`);

      // odświeżenie stanu komponentu
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

      {edition?.status === "available" ? (
        <button className="reserve-button" onClick={handleReservation}>
          Reserve This Edition
        </button>
      ) : (
        <p className="already-reserved">This edition is currently not available.</p>
      )}
    </div>
  );
};

export default EditionDetails;
