import React, { useState } from 'react';
import axios from 'axios';

const PanEntryForm = () => {
  const [panNumber, setPanNumber] = useState('');
  const [dobMatch, setDobMatch] = useState('');
  const [panActive, setPanActive] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [aadhaarSeedingStatus, setAadhaarSeedingStatus] = useState('');
  const [name, setName] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic validation for required fields
    if (!panNumber) {
      setError('PAN Number is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/pans', {
        pan_number: panNumber,
        dob_match:dobMatch,
        pan_active: panActive,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        aadhaar_seeding_status: aadhaarSeedingStatus,
        name,
        name_on_card: nameOnCard,
      });

      setSuccessMessage('PAN entry added successfully!');
      // Clear the form fields after successful submission
      setPanNumber('');
      setDobMatch('');
      setPanActive('');
      setFirstName('');
      setLastName('');
      setMiddleName('');
      setAadhaarSeedingStatus('');
      setName('');
      setNameOnCard('');
    } catch (err) {
      console.error(err);
      setError('Failed to add PAN entry.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Add PAN Entry</h2>
      <form onSubmit={handleSubmit} >
        <div className="mt-3 d-flex align-items-center">
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            placeholder="PAN Number"
            required
          />
        </div>
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={dobMatch}
            onChange={(e) => setDobMatch(e.target.value)}
            placeholder="Date of Birth Match"
          />
        </div>
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={panActive}
            onChange={(e) => setPanActive(e.target.value)}
            placeholder="PAN Active Status"
          />
        </div>
        </div>
        <div className="mt-3 d-flex align-items-center">
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Middle Name"
          />
        </div>
        </div>
        <div className="mt-3 mb-3 d-flex align-items-center">
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={aadhaarSeedingStatus}
            onChange={(e) => setAadhaarSeedingStatus(e.target.value)}
            placeholder="Aadhaar Seeding Status"
          />
        </div>
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            className="form-control"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            placeholder="Name on Card"
          />
        </div>
        </div>
        <button type="submit" className="btn btn-primary w-20">Add PAN</button>
        {error && <div className="text-danger mt-2">{error}</div>}
        {successMessage && <div className="text-success mt-2">{successMessage}</div>}
      </form>
    </div>
  );
};

export default PanEntryForm;
