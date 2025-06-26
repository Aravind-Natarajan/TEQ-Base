import React, { useState } from 'react';
import axios from 'axios';
import './studentregister.css'; // Ensure the CSS file is correctly imported

function StudentRegister() {
  const [regno, setRegno] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [slot, setSlot] = useState('');
  const [trainer, setTrainer] = useState('');
  const [mode, setMode] = useState('');
  const [status, setStatus] = useState('');

  // Store student data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/studentreg', {
        regno,
        name,
        course,
        slot,
        trainer,
        mode,
        status
      });
      console.log(response.data);
      alert(response.data);
    } catch (err) {
      console.error('Error registering', err);
      alert('Error registering Student data');
    }
  };

  // Retrieve student data
  const handleRetrieve = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/student/${regno}`);
      const student = response.data;
      setName(student.name);
      setCourse(student.course);
      setSlot(student.slot);
      setTrainer(student.trainer);
      setMode(student.mode);
      setStatus(student.status);
    } catch (err) {
      console.error('Error retrieving student data', err);
      alert('Student not found');
    }
  };

  // Update student data
  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:5000/studentreg', {
        regno,
        name,
        course,
        slot,
        trainer,
        mode,
        status
      });
      console.log(response.data);
      alert(response.data);
      setRegno('');
      setName('');
      setCourse('');
      setSlot('');
      setTrainer('');
      setMode('');
      setStatus('')
    } catch (err) {
      console.error('Error updating', err);
      alert('Error updating Student data');
    }
  };

  // Delete student data
  // const handleDelete = async () => {
  //   try {
  //     const response = await axios.delete(`http://localhost:5000/studentreg/${regno}`);
  //     console.log(response.data);
  //     alert(response.data);
  //     // Clear the form fields
  //     setRegno('');
  //     setName('');
  //     setCourse('');
  //     setSlot('');
  //     setTrainer('');
  //     setMode('');
  //     setStatus('')
  //   } catch (err) {
  //     console.error('Error deleting', err);
  //     alert('Error deleting Student data');
  //   }
  // };

  return (
    <div className="sr-main-form">
      <h1>Student Register</h1>
      <form onSubmit={handleSubmit} className="sr-form">
        <div className="row-ret">
        <input
          type="text"
          className="sr-input"
          placeholder="Register Number"
          value={regno}
          required
          onChange={(e) => setRegno(e.target.value)}
          name="regno"
        />
        <button type="button" className="sr-retrieve" onClick={handleRetrieve}>Retrieve</button>
        </div>
        <input
          type="text"
          className="sr-input"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          name="name"
        />
        <input
          type="text"
          className="sr-input"
          placeholder="Course"
          value={course}
          required
          onChange={(e) => setCourse(e.target.value)}
          name="course"
        />
        <input
          type="text"
          className="sr-input"
          placeholder="Slot"
          value={slot}
          required
          onChange={(e) => setSlot(e.target.value)}
          name="slot"
        />
        <input
          type="text"
          className="sr-input"
          placeholder="Trainer Name"
          value={trainer}
          required
          onChange={(e) => setTrainer(e.target.value)}
          name="trainer"
        />
        <input
          type="text"
          className="sr-input"
          placeholder="Mode"
          value={mode}
          required
          onChange={(e) => setMode(e.target.value)}
          name="mode"
        />
        <input
          type="text"
          className="sr-input"
          placeholder="Status"
          value={status}
          required
          onChange={(e) => setStatus(e.target.value)}
          name="status"
        />
        <div className="btn-container">
          <button type="submit" className="sr-add">Add</button>
          <button type="button" className="sr-update" onClick={handleUpdate}>Update</button>
          {/* <button type="button" className="sr-delete" onClick={handleDelete}>Delete</button> */}
        </div>
      </form>
    </div>
  );
}

export default StudentRegister;
