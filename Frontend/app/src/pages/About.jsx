import React from "react";
import "../statics/About.css";
export default function About(){
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white px-6 py-4 shadow">
                <h1 className="text-2xl font-bold">About Us</h1>
            </header>
            <main className="p-6">
                <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
                <p className="mb-4">Welcome to our School Library Management System — an innovative solution designed to streamline and enhance the daily operations of our school library. 
                    Our platform is built with a clear mission: 
                    to support librarians and students by providing a fast, secure, and intuitive system for managing books, users, and library processes.</p>
                <h2 className="text-xl font-semibold mb-4">Vision</h2>
                <p className="mb-4">We aim to make library management simple, efficient, and user-friendly. Whether it’s organizing the collection, assisting students with finding their next great read, 
                    or keeping track of borrowings and returns, our system empowers librarians to focus on what matters most: fostering a love for reading and learning.</p>
            </main>
        <footer>
            <p>All rights reserved &copy; 2025</p>
        </footer>
        </div>

    )
}