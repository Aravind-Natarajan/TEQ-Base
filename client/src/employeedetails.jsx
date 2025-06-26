import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './employeedetails.css';

const EmployeeDetails = () => {
  const [signups, setSignups] = useState([]);  // Holds employee signups data
  const [loading, setLoading] = useState(true);  // Tracks loading state
  const [error, setError] = useState(null);  // Tracks any errors

  // Fetch data on component mount using useEffect
  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/signups');
        console.log('Fetched Response:', response);  // Log the entire response
        console.log('Fetched Data:', response.data);  // Log only the data

        // Check if response.data is an array or contains an array
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSignups(response.data);  // Set the signups data if it's an array
        } else {
          setError('Error: No data found or data format is incorrect.');
          console.error('Response data is empty or not in expected format:', response.data);
        }
      } catch (err) {
        setError('Error fetching signups data: ' + err.message);
        console.error('Error:', err.message);
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    fetchSignups();  // Trigger the fetch on component mount
  }, []);  // Empty array ensures it runs only once when the component mounts

  // Display loading state while data is being fetched
  if (loading) return <div className="loading">Loading...</div>;

  // Display error message if there is an issue with the data
  if (error) return <div className="error">{error}</div>;

  // Render the signups data using map
  return (
    <div className="employee-details-container">
      <h2 className="page-title">Employee Details</h2>
      {/* Check if there is any data to display */}
      {signups.length > 0 ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Emp_id</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {/* Use map to render each signup as a table row */}
            {signups.map((signup, index) => (
              <tr key={signup.emp}>
                <td>{index + 1}</td>  {/* Index + 1 to show serial number */}
                <td>{signup.emp}</td>  {/* Employee ID */}
                <td>{signup.name}</td>  {/* Employee Name */}
                <td>{signup.email}</td>  {/* Employee Email */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No signups data available.</div>  // Message if no data to display
      )}
    </div>
  );
};

export default EmployeeDetails;
