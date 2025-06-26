import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBackCircle } from "react-icons/io5";
import './report.css';

function Report() {
  const location = useLocation();
  const { employeeName } = location.state || {}; // Get the employee name from the previous page state

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedStudents, setCheckedStudents] = useState({});
  const [activities, setActivities] = useState({});
  const [teamName, setTeamName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  useEffect(() => {
    if (employeeName) {
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/students/by-trainer/${employeeName}`);
          setStudents(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Error fetching student data. Please try again.');
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [employeeName]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const slotStudents = { 1: [], 2: [], 3: [], 4: [] };

  students.forEach(student => {
    slotStudents[student.slot].push(student);
  });

  const handleCheckboxChange = (slot, studentName) => {
    setCheckedStudents(prevState => {
      const updatedCheckedStudents = { ...prevState };
      if (!updatedCheckedStudents[slot]) {
        updatedCheckedStudents[slot] = [];
      }
      if (updatedCheckedStudents[slot].includes(studentName)) {
        updatedCheckedStudents[slot] = updatedCheckedStudents[slot].filter(name => name !== studentName);
      } else {
        updatedCheckedStudents[slot].push(studentName);
      }
      return updatedCheckedStudents;
    });
  };

  const handleActivityChange = (slot, activity) => {
    setActivities(prevActivities => ({
      ...prevActivities,
      [slot]: activity
    }));
  };

  const handleTeamNameChange = (e) => setTeamName(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);

  const handleSubmit = async () => {
    try {
      const reportData = {
        employeeName,
        teamName,
        date,
        slots: Object.keys(slotStudents).map(slot => {
          const timing = slot === "1" ? "10:30 to 12:30" : slot === "2" ? "02:30 to 04:30" : slot === "3" ? "04:30 to 06:30" : "06:30 to 08:30";
          const studentsForSlot = slotStudents[slot].map(student => ({
            name: student.name,
            course: student.course,
            checked: checkedStudents[slot]?.includes(student.name) || false
          }));

          return {
            timing,
            activities: activities[slot] || "",
            students: studentsForSlot,
            studentCount: studentsForSlot.filter(student => student.checked).length
          };
        })
      };

      const response = await axios.post('http://localhost:5000/reports', reportData);
      console.log('Report saved:', response.data);
      alert('Report submitted successfully');
      
      setTeamName('');
      setCheckedStudents({});
      setActivities({});
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Error submitting report');
    }
  };

  return (
    <div className="report-container">
      <div className="header">
        <Link to="/welcome">
          <button className="back-btn">
            <IoArrowBackCircle />
          </button>
        </Link>
        <h1>Report for {employeeName || 'Employee'}</h1>
      </div>

      <div className="inputs">
        <div className="input-group">
          <label htmlFor="team">Team Name:</label>
          <input type="text" id="team" value={teamName} onChange={handleTeamNameChange} />
        </div>
        <div className="input-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" value={date} onChange={handleDateChange} />
        </div>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Timing</th>
            <th>Activities</th>
            <th>Student Name (Course)</th>
            <th>Student Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(slotStudents).map((slot) => {
            const studentsInSlot = slotStudents[slot];
            const timing = slot === "1" ? "10:30 to 12:30" : slot === "2" ? "02:30 to 04:30" : slot === "3" ? "04:30 to 06:30" : "06:30 to 08:30";
            return (
              <tr key={slot}>
                <td>{timing}</td>
                <td>
                  <textarea
                    value={activities[slot] || ''}
                    onChange={(e) => handleActivityChange(slot, e.target.value)}
                    cols={50}
                    rows={3}
                    placeholder="Enter activity"
                  />
                </td>
                <td>
                  {studentsInSlot.map((student, index) => (
                    <div key={index} className="student-item">
                      <input
                        type="checkbox"
                        checked={checkedStudents[slot]?.includes(student.name) || false}
                        onChange={() => handleCheckboxChange(slot, student.name)}
                      />
                      {student.name} ({student.course})
                    </div>
                  ))}
                </td>
                <td>
                  <textarea
                    cols={3}
                    rows={1}
                    value={checkedStudents[slot]?.length || 0}
                    readOnly
                    placeholder="Count"
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4} className="text-center">
              <button className="submit-btn" onClick={handleSubmit}>Submit Report</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Report;
