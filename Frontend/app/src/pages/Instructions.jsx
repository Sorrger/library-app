import React from 'react';
import { getUserRoleFromToken } from '../utils/auth'

const Instructions = () => {
  const userRole = getUserRoleFromToken();

  let pdfPath = '';
  switch (userRole) {
    case 'UserRole.admin':
      pdfPath = 'admin.pdf';
      break;
    case 'UserRole.librarian':
      pdfPath = "librarian.pdf";
      break;
    default:
      pdfPath = "student.pdf";
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src={pdfPath}
        title="Instructions"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default Instructions;
