import React from "react";
import "../statics/about/page.css";

export default function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1 className="about-title">About Us</h1>
      </header>
      <main className="about-main">
        <section className="about-section">
          <h2 className="section-heading">Our Vision</h2>
          <p className="section-paragraph">
            Welcome to our School Library Management System — an innovative
            solution designed to streamline and enhance the daily operations of
            our school library. Our platform is built with a clear mission: to
            support librarians and students by providing a fast, secure, and
            intuitive system for managing books, users, and library processes.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-heading">Vision</h2>
          <p className="section-paragraph">
            We aim to make library management simple, efficient, and
            user-friendly. Whether it’s organizing the collection, assisting
            students with finding their next great read, or keeping track of
            borrowings and returns, our system empowers librarians to focus on
            what matters most: fostering a love for reading and learning.
          </p>
        </section>
      </main>
    </div>
  );
}
