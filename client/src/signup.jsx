import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Add home icon from react-icons
import './signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [emp, setEmp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                name,
                emp,
                email,
                password
            });
            console.log(response.data);
            alert(response.data);
            navigate("/login");
        } catch (err) {
            console.error('Error registering', err);
            alert('Error registering user');
        }
    };

    return (
        <div className="signup-container">
            <div className="form-container">
                <h2 className="signup-title">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={name} 
                            required 
                            onChange={(e) => setName(e.target.value)} 
                            className="input-field" 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Employee ID" 
                            value={emp} 
                            required 
                            onChange={(e) => setEmp(e.target.value)} 
                            className="input-field" 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Email" 
                            value={email} 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="input-field" 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="input-field" 
                        />
                    </div>
                    <button type="submit" className="submit-btn">Register</button>
                    <p className="signup-text">
                        Already have an account? <a href="/login">Login</a>
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

export default Signup;
