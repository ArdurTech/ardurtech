import React, { useState } from 'react'; // Ensure useState is imported
import axios from 'axios';
import '../styles/LeaveRequest.css';


const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    department: '',
    date: '',
    absenceType: [],
    reason: '',
    absenceFrom: '',
    absenceThrough: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        absenceType: checked 
          ? [...prevData.absenceType, value] 
          : prevData.absenceType.filter(type => type !== value)
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/leave-requests', formData);
      console.log('Leave request submitted:', response.data);
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };


  return (
    <div className="leave-request-container">
      <header className="leave-request-header">
        <img src="https://www.ardurtechnology.com/images/faviconlogo.png" alt="Company Logo" className="company-logo" />
        <h1 className="header-title">Leave Request</h1>
      </header>

      <form className="leave-request-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="input-field">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="input-field">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Employee ID</label>
            <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} />
          </div>
          <div className="input-field">
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="input-field">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="checkbox-group">
            <label><input type="checkbox" value="Sick" checked={formData.absenceType.includes('Sick')} onChange={handleChange} /> Sick</label>
            <label><input type="checkbox" value="Personal Leave" checked={formData.absenceType.includes('Personal Leave')} onChange={handleChange} /> Personal Leave</label>
            <label><input type="checkbox" value="Bereavement" checked={formData.absenceType.includes('Bereavement')} onChange={handleChange} /> Bereavement</label>
          </div>
          <div className="checkbox-group">
            <label><input type="checkbox" value="Maternity/Paternity" checked={formData.absenceType.includes('Maternity/Paternity')} onChange={handleChange} /> Maternity/Paternity</label>
            <label><input type="checkbox" value="Time off without payment" checked={formData.absenceType.includes('Time off without payment')} onChange={handleChange} /> Time off without payment</label>
            <label><input type="checkbox" value="Others" checked={formData.absenceType.includes('Others')} onChange={handleChange} /> Others</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Reason</label>
            <textarea name="reason" rows="3" value={formData.reason} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Absence From</label>
            <input type="date" name="absenceFrom" value={formData.absenceFrom} onChange={handleChange} />
          </div>
          <div className="input-field">
            <label>Absence Through</label>
            <input type="date" name="absenceThrough" value={formData.absenceThrough} onChange={handleChange} />
          </div>
        </div>

        <div className="certification-note">
          <p><strong>Certification:</strong> I hereby request leave for the above-mentioned reasons and certify that the information provided is true and accurate.</p>
        </div>

        <div className="submit-btn">
          <button type="submit">Submit</button>
        </div>
      </form>

      <footer className="leave-request-footer">
        Document Management Software by Ardur Technology
      </footer>
    </div>
  );
};

export default LeaveRequest;
