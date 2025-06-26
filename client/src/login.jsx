import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Add home icon from react-icons
import './login.css'

function Login() {
    const [emp, setEmp] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                emp,
                password
            });

            if (response.status === 200 && response.data.message === "Success") {
                localStorage.setItem('empId', emp);
                navigate("/welcome");
            } else {
                alert(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error during login:', err);

            if (err.response) {
                alert(err.response.data.message || 'An error occurred. Please try again.');
            } else if (err.request) {
                alert('No response from the server. Please check your connection.');
            } else {
                alert('Error: ' + err.message);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <h2 className='login-title'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Employee ID"
                            autoComplete="on"
                            name="emp"
                            value={emp}
                            onChange={(e) => setEmp(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="on"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Login</button>
                    <p className="signup-text">
                        Don't have an account? <a href="/signup">Sign up</a>
                    </p>
                </form>
            </div>

            {/* Home Icon */}
            <div className="home-icon" onClick={() => navigate('/')}>
                <FaHome />
            </div>
        </div>
    );
}

export default Login;
