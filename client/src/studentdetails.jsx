import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './studentdetails.css';

function Studentdetails() {
  const [students, setStudents] = useState([]); // Store all students data
  const [filteredStudents, setFilteredStudents] = useState([]); // Store filtered students data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMessage, setFilterMessage] = useState(''); // State to handle filter message

  // Fetch data from backend when component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/studentdetails')
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data); // Initially show all students
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching student data');
        setLoading(false);
      });
  }, []);

  // Handle button click to filter students by trainer
  const handleButtonClick = (trainerName) => {
    const normalizedTrainerName = trainerName.trim().toLowerCase();
    const filtered = students.filter((student) => {
      return student.trainer && student.trainer.trim().toLowerCase() === normalizedTrainerName;
    });

    const uniqueStudents = [];
    const seenRegnos = new Set();
    
    filtered.forEach((student) => {
      if (!seenRegnos.has(student.regno)) {
        seenRegnos.add(student.regno);
        uniqueStudents.push(student);
      }
    });

    if (uniqueStudents.length === 0) {
      setFilterMessage(`No students found for trainer: ${trainerName}`);
    } else {
      setFilterMessage('');
    }

    setFilteredStudents(uniqueStudents);
  };


  // Function to set the session based on the slot value
  const getSession = (slot) => {
    switch (slot) {
      case 1: return "10:00 AM to 12:30 PM";
      case 2: return "02:30 PM to 04:30 PM";
      case 3: return "04:30 PM to 06:30 PM";
      case 4: return "06:30 PM to 08:30 PM";
      default: return "N/A";
    }
  };

  if (loading) return <div className="loading">Loading student data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-details-container">
      <div className="filter-buttons">
        {/* Buttons for each trainer */}
        <button onClick={() => handleButtonClick('Mohamed ayoop')} className="trainer-button">Mohamed ayoop</button>
        <button onClick={() => handleButtonClick('Anusha')} className="trainer-button">Anusha</button>
        <button onClick={() => handleButtonClick('Josephine')} className="trainer-button">Josephine</button>
        <button onClick={() => handleButtonClick('Prathiksha')} className="trainer-button">Prathiksha</button>
        <button onClick={() => handleButtonClick('Aravind')} className="trainer-button">Aravind</button>
        <button onClick={() => handleButtonClick('Shafic Ahamed')} className="trainer-button">Shafic Ahamed</button>
      </div>

      {/* Display filter message if no students match */}
      {filterMessage && <div className="filter-message">{filterMessage}</div>}

      <div className="table-container">
        <h2>Student Details</h2>
        {filteredStudents.length > 0 ? (
          <table className="student-table">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Reg No</th>
                <th>Name</th>
                <th>Course</th>
                <th>Slot</th>
                <th>Trainer</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.regno} >
                  <td>{index + 1}</td>
                  <td>{student.regno}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{getSession(student.slot)}</td>
                  <td>{student.trainer}</td>
                  <td>{student.mode}</td>
                  <td>{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No student data available for this trainer.</div>
        )}
      </div>
    </div>
  );
}

export default Studentdetails;
