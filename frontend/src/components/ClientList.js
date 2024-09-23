import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Assuming you're using react-router for navigation

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get the logged-in user's information from local storage
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch clients');
    }
  };

  const handleDelete = async (id) => {
    if (loggedInUser.role !== 'admin') {
      setError('You do not have permission to delete users.');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError('Failed to delete client');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (selectedClient) {
        await axios.put(`http://localhost:5000/api/clients/${selectedClient._id}`, { name, industry, contactInformation });
      } else {
        await axios.post('http://localhost:5000/api/clients', { name, industry, contactInformation });
      }
      // Reset form fields after successful submission
      setName('');
      setIndustry('');
      setContactInformation('');
      setSelectedClient(null);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.error : 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setName(selectedClient.name);
      setIndustry(selectedClient.industry);
      setContactInformation(selectedClient.contactInformation);
    } else {
      setName('');
      setIndustry('');
      setContactInformation('');
    }
  }, [selectedClient]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Client Management</h2>

      <form onSubmit={handleSubmit} className="mt-3 d-flex align-items-center">
      <div className="me-2 flex-grow-1">
        <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Client Name" required />
        </div>
        <div className="me-2 flex-grow-1">
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="form-control" placeholder="Industry" required />
        </div>
        <div className="me-2 flex-grow-1">
        <input value={contactInformation} onChange={(e) => setContactInformation(e.target.value)} className="form-control" placeholder="Contact Information" required />
        </div>
        <button type="submit" className="btn btn-primary w-20 me-2">{selectedClient ? 'Update Client' : 'Add Client'}</button>
        <button type="button" className="btn btn-primary w-20 me-2" onClick={() => navigate('/user-list')}>Add User</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>

      <h3>Client List</h3>
      <table className="table table-striped table-bordered mt-4">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Industry</th>
            <th>Contact Information</th>
            {loggedInUser.role === 'admin' && (
            <th>Actions</th>
          )}
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client._id}>
              <td>{client.name}</td>
              <td>{client.industry}</td>
              <td>{client.contactInformation}</td>
              {loggedInUser.role === 'admin' && (
              <td>
                <button className="btn btn-primary w-20 me-2" onClick={() => setSelectedClient(client)}>Edit</button>
                <button className="btn btn-primary w-20 me-2" onClick={() => handleDelete(client._id)}>Delete</button>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientManagement;
