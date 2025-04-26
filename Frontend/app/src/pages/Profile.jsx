import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

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

            const studentResponse = await api.get(`/students/${accountResponse.data.student_id}`);
            setStudent(studentResponse.data);
        } catch (err) {
            setError("Błąd podczas ładowania profilu.");
        } finally {
            setLoading(false);
        }
        };
    
        fetchProfile();
    }, []);
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>;
    }
    
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }
    
    return (
        <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white px-6 py-4 shadow">
            <h1 className="text-2xl font-bold">Twój Profil</h1>
        </header>
    
        <main className="p-6">
            <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dane Konta</h2>
            <p><strong>Login:</strong> {account.login}</p>
    
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Dane Studenta</h2>
                <p><strong>Imię:</strong> {student.name}</p>
                <p><strong>Nazwisko:</strong> {student.surname}</p>
                <p><strong>Telefon:</strong> {student.phone_number ?? "Brak numeru"}</p>
            </div>
            </div>
        </main>
        </div>
    );
    }