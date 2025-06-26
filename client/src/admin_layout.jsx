import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; // Use NavLink for active styling
import { FaHome } from 'react-icons/fa';
import './admin_layout.css';

function AdminLayout() {
  return (
    <>
      {/* Home button container */}
      <div className="home-button-container">
        <NavLink to="/">
          <div className="home-icon">
            <FaHome />
          </div>
        </NavLink>
        <h1>T<span>4</span>TEQ Software Solutions</h1>
      </div>

      {/* Dashboard Layout */}
      <div className="dashboard">
        {/* Sidebar */}
        <nav>
  <ul>
    <li>
      <NavLink to="stureg" className={({ isActive }) => (isActive ? 'active' : '')}>
        Student Register
      </NavLink>
    </li>
    <li>
      <NavLink to="empdet" className={({ isActive }) => (isActive ? 'active' : '')}>
        Employee Details
      </NavLink>
    </li>
    <li>
      <NavLink to="studentdetails" className={({ isActive }) => (isActive ? 'active' : '')}>
        Student Details
      </NavLink>
    </li>
    <li>
      <NavLink to="class" className={({ isActive }) => (isActive ? 'active' : '')}>
        Class Schedule
      </NavLink>
    </li>
    <li>
      <NavLink to="repshow" className={({ isActive }) => (isActive ? 'active' : '')}>
        Employee Report Data
      </NavLink>
    </li>
    <li>
      <NavLink to="uploadphoto" className={({ isActive }) => (isActive ? 'active' : '')}>
        Upload Picture
      </NavLink>
    </li>
  </ul>
</nav>


        {/* Content Area */}
        <div className="out">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
