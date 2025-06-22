import "../statics/librarianDashboard/page.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserNameFromToken } from "../utils/auth";
import api from "../api/apiClient";

const LibrarianDashboard = () => {
  const name = getUserNameFromToken();
  const navigate = useNavigate();

  const [booksCount, setBooksCount] = useState("0");
  const [editionsCount, setEditionsCount] = useState("0");
  const [reservedLoans, setReservedLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);
  const [books, setBooks] = useState([]);
  const [editions, setEditions] = useState([]);
  const [reportFines, setReportFines] = useState([]);
  const [borrowedLoans, setBorrowedLoans] = useState([]);
  const [loadingBorrowed, setLoadingBorrowed] = useState(true);
  const [errorBorrowed, setErrorBorrowed] = useState(null);

  const [fines, setFines] = useState([]);

  const [booksByEditionId, setBooksByEditionId] = useState({});
  const [borrowedBooksByEditionId, setBorrowedBooksByEditionId] = useState({});

  const [activeLoans, setActiveLoans] = useState("0");
  const [loansCount, setLoansCount] = useState("0");

  const [editionBooks, setEditionBooks] = useState({});
  const [editionPublishers, setEditionPublishers] = useState({});

  const [searchReserved, setSearchReserved] = useState("");
  const [searchBorrowed, setSearchBorrowed] = useState("");
  const [searchBooks, setSearchBooks] = useState("");
  const [searchEditions, setSearchEditions] = useState("");

  const [students, setStudents] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedFineId, setSelectedFineId] = useState("");

  const [allfines, setAllFines] = useState([]);


  const [fineAssignments, setFineAssignments] = useState([]);

  const [studentBorrowedEditions, setStudentBorrowedEditions] = useState([]);
  const [selectedEditionId, setSelectedEditionId] = useState("");

  const [reportStart, setReportStart] = useState("");
  const [reportEnd, setReportEnd] = useState("");
  const [reportLoans, setReportLoans] = useState([]);

useEffect(() => {
  if (!selectedStudentId) return;

  const fetchBorrowed = async () => {
    try {
      const res = await api.get(`/students/${selectedStudentId}/borrowed`);
      setStudentBorrowedEditions(res.data);
    } catch (err) {
      console.error("Error fetching borrowed editions:", err);
    }
  };

  fetchBorrowed();
}, [selectedStudentId]);

const fetchFineAssignments = async () => {
  try {
    const res = await api.get("/fines/students");
    setFineAssignments(res.data);
  } catch (err) {
    console.error("Error fetching fine assignments:", err);
  }
};

useEffect(() => {
  fetchFineAssignments();
}, []);
useEffect(() => {
  const fetchAllFines = async () => {
    try {
      const res = await api.get("/fines");
      setAllFines(res.data);
    } catch (err) {
      console.error("Error fetching all fines:", err);
    }
  };
  fetchAllFines();
}, []);
  
useEffect(() => {
  api.get("/students").then((res) => setStudents(res.data));
}, []);

const handleAssignFine = async () => {
  try {
    await api.post(`/fines/${selectedFineId}/students/${selectedStudentId}`, {
      edition_id: selectedEditionId,
    });
    alert("Student assigned to fine.");
    fetchFineAssignments();
  } catch (err) {
    alert("Error assigning fine: " + (err.response?.data?.detail || err.message));
  }
};


  const fetchReservedLoans = async () => {
    try {
      const res = await api.get("/loans/reservated");
      setReservedLoans(res.data);
    } catch {
      setErrorLoans("Error while loading reservations");
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchBorrowedLoans = async () => {
    try {
      const res = await api.get("/loans/borrowed");
      setBorrowedLoans(res.data);
    } catch {
      setErrorBorrowed("Error while loading borrowings");
    } finally {
      setLoadingBorrowed(false);
    }
  };

  useEffect(() => {
    api.get("/books/count").then((res) => setBooksCount(res.data.count));
    api.get("/editions/count").then((res) => setEditionsCount(res.data.count));
    api.get("/active-loans/count").then((res) => setActiveLoans(res.data.count));
    api.get("/loans/count").then((res) => setLoansCount(res.data.count));

    fetchReservedLoans();
    fetchBorrowedLoans();
  }, []);

  useEffect(() => {
  const fetchFines = async () => {
    try {
      const res = await api.get("/fines");
      const unpaid = res.data.filter((fine) => !fine.is_paid);
      setFines(unpaid);
    } catch (err) {
      console.error("Error fetching fines:", err);
    }
  };
  fetchFines();
}, []);

  useEffect(() => {
    const fetchBookNames = async () => {
      const map = {};
      for (const loan of reservedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          map[loan.edition.edition_id] = res.data.title;
        } catch {
          map[loan.edition.edition_id] = "Error fetching title";
        }
      }
      setBooksByEditionId(map);
    };
    if (reservedLoans.length > 0) fetchBookNames();
  }, [reservedLoans]);

  useEffect(() => {
    const fetchBorrowedBookNames = async () => {
      const map = {};
      for (const loan of borrowedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          map[loan.edition.edition_id] = res.data.title;
        } catch {
          map[loan.edition.edition_id] = "Error fetching title";
        }
      }
      setBorrowedBooksByEditionId(map);
    };
    if (borrowedLoans.length > 0) fetchBorrowedBookNames();
  }, [borrowedLoans]);

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
    api.get("/editions").then((res) => setEditions(res.data));
  }, []);

const handlePayFine = async (fineId, studentId) => {
  try {
    await api.patch(`/fines/${fineId}/pay`, {
      student_id: studentId, 
    });
    alert("Fine marked as paid.");
  } catch (err) {
    alert("Error paying fine: " + (err.response?.data?.detail || err.message));
  }
};

const handleGenerateReport = async () => {
  if (!reportStart) {
    alert("Please select a start date.");
    return;
  }

  try {
    let fineUrl = `/fines/date-filtered?start=${reportStart}`;
    let loanUrl = `/loans/date-filtered?start=${reportStart}`;

    if (reportEnd) {
      fineUrl += `&end=${reportEnd}`;
      loanUrl += `&end=${reportEnd}`;
    }

    const [fineRes, loanRes] = await Promise.all([
      api.get(fineUrl),
      api.get(loanUrl),
    ]);

    setReportFines(fineRes.data);
    setReportLoans(loanRes.data);

    alert(`Report generated: ${fineRes.data.length} fines, ${loanRes.data.length} loans.`);
  } catch (err) {
    alert("Error generating reports: " + (err.response?.data?.detail || err.message));
  }
};



  const handleChangeStatusToBorrowed = async (editionId) => {
    try {
      await api.patch(`/editions/${editionId}/borrowed/`);
      fetchReservedLoans();
      fetchBorrowedLoans();
      alert("Status changed to BORROWED");
    } catch (err) {
      alert("Error changing status: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleChangeStatusToAvailable = async (editionId, studentId) => {
    try {
      await api.patch(`/loans/${editionId}/return`);
      await api.patch(`/editions/${editionId}/available/`);
      await api.patch(`/students/${studentId}/limit-increase`);
      fetchReservedLoans();
      fetchBorrowedLoans();
      alert("Status changed to AVAILABLE and student's limit increased");
    } catch (err) {
      alert("Error changing status: " + (err.response?.data?.detail || err.message));
    }
  };
const handleDeleteBook = async (bookId) => {
  const confirm = window.confirm("Are you sure you want to delete this book?");
  if (!confirm) return;
  try {
    await api.delete(`/books/${bookId}`);
    setBooks((prev) => prev.filter((b) => b.book_id !== bookId));
    alert("Book deleted successfully.");
    
    // Pobierz ponownie edycje
    const res = await api.get("/editions");
    setEditions(res.data);
  } catch (err) {
    alert("Error deleting book: " + (err.response?.data?.detail || err.message));
  }
};

  const handleDeleteEdition = async (editionId) => {
    const confirm = window.confirm("Are you sure you want to delete this edition?");
    if (!confirm) return;
    try {
      await api.delete(`/editions/${editionId}`);
      setEditions((prev) => prev.filter((e) => e.edition_id !== editionId));
      alert("Edition deleted successfully.");
    } catch (err) {
      alert("Error deleting edition: " + (err.response?.data?.detail || err.message));
    }
  };

  useEffect(() => {
    const fetchEditionBooksAndPublishers = async () => {
      const booksMap = {};
      const publishersMap = {};
      for (const edition of editions) {
        try {
          const resBook = await api.get(`/editions/${edition.edition_id}/book`);
          booksMap[edition.edition_id] = resBook.data.title;
        } catch {
          booksMap[edition.edition_id] = "Error fetching title";
        }
        try {
          const resPublisher = await api.get(`/editions/${edition.edition_id}/publisher`);
          publishersMap[edition.edition_id] = resPublisher.data.name;
        } catch {
          publishersMap[edition.edition_id] = "Error fetching publisher";
        }
      }
      setEditionBooks(booksMap);
      setEditionPublishers(publishersMap);
    };

    if (editions.length > 0) {
      fetchEditionBooksAndPublishers();
    }
  }, [editions]);

  const filteredReservedLoans = reservedLoans.filter((loan) =>
    (booksByEditionId[loan.edition.edition_id] || "")
      .toLowerCase()
      .includes(searchReserved.toLowerCase()) ||
    loan.student.name.toLowerCase().includes(searchReserved.toLowerCase()) ||
    loan.student.surname.toLowerCase().includes(searchReserved.toLowerCase())
  );

  const filteredBorrowedLoans = borrowedLoans.filter((loan) =>
    (borrowedBooksByEditionId[loan.edition.edition_id] || "")
      .toLowerCase()
      .includes(searchBorrowed.toLowerCase()) ||
    loan.student.name.toLowerCase().includes(searchBorrowed.toLowerCase()) ||
    loan.student.surname.toLowerCase().includes(searchBorrowed.toLowerCase())
  );

  const filteredBooks = books.filter((book) =>
    (book.title || "").toLowerCase().includes(searchBooks.toLowerCase())
  );

  const filteredEditions = editions.filter((edition) => {
    const title = (editionBooks[edition.edition_id] || "").toLowerCase();
    const query = searchEditions.toLowerCase();
    return title.includes(query);
  });


  return (
    <div className="librarian-dashboard">
      <section className="profile-section">
        <h2 className="section-title">Librarian Dashboard</h2>
        <p><strong>Name:</strong> {name}</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Quick Actions</h2>
        <button className="action-button" onClick={() => navigate("books/add")}>
          ➕ ADD BOOK
        </button>
        <button className="action-button" onClick={() => navigate("editions/add")}>
          ➕ ADD EDITION
        </button>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Statistics</h2>
        <p><strong>Books:</strong> {booksCount}</p>
        <p><strong>Editions:</strong> {editionsCount}</p>
        <p><strong>Active Reservations:</strong> {activeLoans}</p>
        <p><strong>Total Loans:</strong> {loansCount}</p>
      </section>


      <section className="profile-section">
  <h2 className="section-title">Generate Report</h2>
  <div className="form-group">
    <label>Start Date:</label>
    <input type="date" value={reportStart} onChange={(e) => setReportStart(e.target.value)} />
  </div>
  <div className="form-group">
    <label>End Date:</label>
    <input type="date" value={reportEnd} onChange={(e) => setReportEnd(e.target.value)} />
    <small>(Leave empty to use today as the end date)</small>
  </div>
  <button className="action-button" onClick={handleGenerateReport}>
    GENERATE REPORT
  </button>
{(reportLoans.length > 0 || reportFines.length > 0) && (
  <>
    {reportLoans.length > 0 && (
      <section className="profile-section">
        <h2 className="section-title">Report: Loans Between {reportStart} and {reportEnd || "now"}</h2>
        <p><strong>Total:</strong> {reportLoans.length} loans</p>
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>Loan Date</th>
                <th>Return Date</th>
                <th>Student</th>
                <th>Book</th>
                <th>Edition Id</th>
              </tr>
            </thead>
            <tbody>
              {reportLoans.map((loan) => (
                <tr key={loan.loan_id}>
                  <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                  <td>{loan.return_date ? new Date(loan.return_date).toLocaleDateString() : "Not Returned"}</td>
                  <td>{loan.student?.name} {loan.student?.surname}</td>
                  <td>{loan.edition?.book?.title || "N/A"}</td>
                  <td>{loan.edition?.edition_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )}

    {reportFines.length > 0 && (
      <section className="profile-section">
        <h2 className="section-title">Report: Fines Between {reportStart} and {reportEnd || "now"}</h2>
        <p><strong>Total:</strong> {reportFines.length} fines</p>
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>Fine ID</th>
                <th>Student</th>
                <th>Book Title</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Assigned At</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {reportFines.map((fine) => (
                <tr key={`${fine.fine_id}-${fine.student_id}`}>
                  <td>{fine.fine_id}</td>
                  <td>{fine.student_name} {fine.student_surname}</td>
                  <td>{fine.title || "N/A"}</td>
                  <td>{fine.fine_type}</td>
                  <td>{fine.value} zł</td>
                  <td>{new Date(fine.assigned_at).toLocaleDateString()}</td>
                  <td>{fine.is_paid ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )}
  </>
)}


</section>

      <section className="profile-section">
        <h2 className="section-title">Currently Reserved Books</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by book or student..."
          value={searchReserved}
          onChange={(e) => setSearchReserved(e.target.value)}
        />
        {filteredReservedLoans.length > 0 && (
          <div className="scrollable-table-container">
            <table className="borrowed-loans-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th className="center">Student First Name</th>
                  <th className="center">Student Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservedLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{booksByEditionId[loan.edition.edition_id] || "..."}</td>
                    <td>{loan.student.name}</td>
                    <td>{loan.student.surname}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleChangeStatusToBorrowed(loan.edition.edition_id)}
                      >
                        BORROWED
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="section-title">Currently Borrowed Books</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by book or student..."
          value={searchBorrowed}
          onChange={(e) => setSearchBorrowed(e.target.value)}
        />
        {filteredBorrowedLoans.length > 0 && (
          <div className="scrollable-table-container">
            <table className="borrowed-loans-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student First Name</th>
                  <th>Student Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowedLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{borrowedBooksByEditionId[loan.edition.edition_id] || "..."}</td>
                    <td>{loan.student.name}</td>
                    <td>{loan.student.surname}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleChangeStatusToAvailable(loan.edition.edition_id, loan.student.student_id)}
                      >
                        AVAILABLE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="section-title">Choose a Book to Edit</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={searchBooks}
          onChange={(e) => setSearchBooks(e.target.value)}
        />
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Title</th>
                <th>Publication Date</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.book_id}>
                  <td onClick={() => navigate(`/books/edit/${book.book_id}`)}>{book.book_id}</td>
                  <td onClick={() => navigate(`/books/edit/${book.book_id}`)}>{book.title}</td>
                  <td onClick={() => navigate(`/books/edit/${book.book_id}`)}>{book.release_date}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBook(book.book_id)}
                    >
                      🗑 DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Choose an Edition to Edit</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={searchEditions}
          onChange={(e) => setSearchEditions(e.target.value)}
        />
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Publisher</th>
                <th>Status</th>
                <th>Format</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredEditions.map((edition) => (
                <tr key={edition.edition_id}>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{editionBooks[edition.edition_id]}</td>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{editionPublishers[edition.edition_id]}</td>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{edition.status}</td>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{edition.book_format}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteEdition(edition.edition_id)}
                    >
                      🗑 DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      <section className="profile-section">
  <h2 className="section-title">Assign Fine to Student</h2>

  <div className="form-group">
    <label>Select Fine:</label>
    <select
      value={selectedFineId}
      onChange={(e) => setSelectedFineId(e.target.value)}
    >
      <option value="">-- Choose fine --</option>
      {allfines.map((fine) => (
        <option key={fine.fine_id} value={fine.fine_id}>
          #{fine.fine_id} | {fine.fine_type.toUpperCase()} | {fine.value} zł
        </option>
      ))}
    </select>
  </div>

  <div className="form-group">
    <label>Select Student:</label>
    <select
      value={selectedStudentId}
      onChange={(e) => setSelectedStudentId(e.target.value)}
    >
      <option value="">-- Choose student --</option>
      {students.map((s) => (
        <option key={s.student_id} value={s.student_id}>
          {s.name} {s.surname}
        </option>
      ))}
    </select>
  </div>

      <div className="form-group">
  <label>Select Borrowed Edition:</label>
  <select
    value={selectedEditionId}
    onChange={(e) => setSelectedEditionId(e.target.value)}
    disabled={!selectedStudentId}
  >
    <option value="">-- Choose edition --</option>
    {studentBorrowedEditions.map((loan) => (
      <option key={loan.edition.edition_id} value={loan.edition.edition_id}>
        {loan.edition.book.title} ({loan.edition.book_format}) – status: {loan.edition.status}
      </option>
    ))}
  </select>
</div>


<button
  className="action-button"
  onClick={handleAssignFine}
  disabled={!selectedFineId || !selectedStudentId || !selectedEditionId}
>
  ASSIGN FINE
</button>
</section>

<section className="profile-section">
  <h2 className="section-title">Student Fines</h2>
  <div className="scrollable-table-container">
    <table className="borrowed-loans-table">
      <thead>
        <tr>
          <th>Fine ID</th>
          <th>Student</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Fine Imposition Date</th>
          <th>Paid</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
            {fineAssignments.filter(fa => !fa.is_paid).length > 0 ? (
        fineAssignments
          .filter(fa => !fa.is_paid)
          .map((fa) => (
            <tr key={`${fa.fine_id}-${fa.student_id}`}>
              <td>{fa.fine_id}</td>
              <td>{fa.student_name} {fa.student_surname}</td>
              <td>{fa.fine_type}</td>
              <td>{fa.value} zł</td>
              <td>{new Date(fa.assigned_at).toLocaleDateString("en-US")}</td>
              <td>{fa.is_paid ? "Yes" : "No"}</td>
              <td>
                {!fa.is_paid && (
                  <button
                    className="action-button"
                    onClick={() => handlePayFine(fa.fine_id, fa.student_id)}
                  >
                    PAY
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
              No fines assigned yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>



    </div>
  );
};

export default LibrarianDashboard;
