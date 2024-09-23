import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Assuming you're using react-router for navigation
import PanEntryForm from './PanEntryForm';

const PanValidator = () => {
  const [pan, setPan] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [allPans, setAllPans] = useState([]);
  const navigate = useNavigate();

  // Fetch all PAN entries when the component loads
  useEffect(() => {
    const fetchAllPans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pans'); // Adjust this endpoint to match your backend API
        setAllPans(response.data.data); // Assuming `data` contains the array of PAN entries
      } catch (err) {
        console.error('Error fetching PAN entries:', err);
      }
    };

    fetchAllPans();
  }, []);

  const validatePan = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/validate-pan', { pan });
      console.log(response);
      setResult(response.data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
      setResult(null); // Clear previous results
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">PAN Validator</h1>
      <div className="mt-3 d-flex align-items-center">
      <div className="me-2 flex-grow-2">
      <input
        type="text"
        className="form-control"
        value={pan}
        onChange={(e) => setPan(e.target.value)}
        placeholder="Enter PAN"
      />
      </div>
      <button className="btn btn-primary w-20 me-2" onClick={validatePan}>Validate</button>
      <button type="button" className="btn btn-primary w-20 me-2" onClick={() => navigate('/login')}>Login</button>
      </div>
      {result && (
        <div className="container mt-5">
          <h2 className="text-center">Validation Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error.message}</div>}

<PanEntryForm/>
      {/* Display all PAN entries below the error message */}
      <div className="container mt-5">
     <h3>All PAN Entries</h3>
      <table className="table table-striped table-bordered mt-4">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Name on Card</th>
            <th>Pan Number</th>
          </tr>
        </thead>
        <tbody>
          {allPans.map(allPan => (
            <tr key={allPan._id}>
              <td>{allPan.name}</td>
              <td>{allPan.name_on_card}</td>
              <td>{allPan.pan_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PanValidator;
