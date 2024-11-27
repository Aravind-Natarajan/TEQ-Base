import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHome } from 'react-icons/fa'; 
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './wel_emp.css';
import Img from './assets/pro.png'

function WelEmp() {
  const [empId, setEmpId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Get the employee ID from localStorage when the component mounts
    const storedEmpId = localStorage.getItem('empId');

    if (storedEmpId) {
      setEmpId(storedEmpId);
    } else {
      // If the employee ID is not found, redirect to login
      window.location.href = '/login';
    }
  }, []);

  // Fetch employee details and student data based on empId and employeeName
  useEffect(() => {
    if (empId) {
      const fetchEmployeeData = async () => {
        try {
          const employeeResponse = await axios.get(`http://localhost:3001/employee/${empId}`);
          setEmployeeName(employeeResponse.data.name);  // Store the employee name

          const studentsResponse = await axios.get(`http://localhost:3001/students/by-trainer/${employeeResponse.data.name}`);
          setStudents(studentsResponse.data);  // Store the student data

          const response = await axios.get('http://localhost:3001/images');
        setImages(response.data);  // Set the fetched data into state


          setLoading(false);  // Done loading
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Error fetching data. Please try again.');
          setLoading(false);
        }
    };
      fetchEmployeeData();
    }
  }, [empId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="welcome-container">
      {/* Home Button */}
      <Link to="/"><div className="home-icon">
        <FaHome />
      </div></Link>

      <div className="content">
        {/* Header with employee name and report button */}
        <div className="header">
          <h1>Welcome, {employeeName}</h1>

          {/* Display trainer image if available */}
          {images.map((image, index) => (
            employeeName == image.name ? (
              <img src={image.path} alt="Trainer" className="trainer-image" />
            ) : (
              <img src={Img} alt="Default Trainer" className="trainer-image" />
            )
          ))}
          
        </div>

        {/* Student Table */}
        <div className="roww">
          <h2>Student Details</h2>
          <Link to="/report" state={{ employeeName }} className="report-btn">
            <FaEdit /> Report
          </Link>
        </div>
        
        {students.length > 0 ? (
          <table className="student-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Reg.No</th>
                <th>Name</th>
                <th>Course</th>
                <th>Slot</th>
                <th>Trainer</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.regno}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.slot === 1 ? "10:00 to 12:30" : student.slot === 2 ? "02:30 to 04:30" : student.slot === 3 ? "04:30 to 06:30" : "06:30 to 08:30"}</td>
                  <td>{student.trainer}</td>
                  <td>{student.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found for this trainer.</p>
        )}
        {/* images */}
        <div className="image-table-container">
      <h2>Images List</h2>
      <table className="image-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Path</th>
            <th>Filename</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={image._id}>
              <td>{index + 1}</td>
              <td>{image.name}</td>
              <td>{image.path}</td>
              <td>{image.filename || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* image */}
      </div>
    </div>
  );
}

export default WelEmp;
