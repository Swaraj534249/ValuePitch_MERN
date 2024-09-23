import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Assuming you're using react-router for navigation

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientId, setClientId] = useState(''); 
  const [clients, setClients] = useState([]); 
  const [role, setRole] = useState('user');  // Add state for role
  const [password, setPassword] = useState('');  // Add state for password
  const [error, setError] = useState('');
  const navigate = useNavigate();

    // Get the logged-in user's information from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users`);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    }
  };

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
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]+$/;

    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!phonePattern.test(phoneNumber)) {
      setError('Phone number must contain only numbers.');
      return;
    }

    try {
      if (selectedUser) {
        await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, { name, email, phoneNumber, client: clientId, role, password });
      } else {
        await axios.post('http://localhost:5000/api/users', { name, email, phoneNumber, client: clientId, role, password });
      }
      setName('');
      setEmail('');
      setPhoneNumber('');
      setClientId('');
      setPassword('');  // Clear password field after submission
      setRole('user');  // Reset role to default
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.error : 'An unexpected error occurred.');
    }
  };

  const handleLogout = () => {
    // Clear the local storage (or session storage)
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    // Navigate to the login page
    navigate('/login');
  };

  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setPhoneNumber(selectedUser.phoneNumber);
      setClientId(selectedUser.client);
      setRole(selectedUser.role || 'user');  // Set role when editing
      setPassword('');  // Clear password when editing an existing user
    } else {
      setName('');
      setEmail('');
      setPhoneNumber('');
      setClientId('');
      setRole('user');  // Reset role
      setPassword('');  // Clear password
    }
  }, [selectedUser]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">User Management</h2>
      <form onSubmit={handleSubmit} >
        <div className="mt-3 d-flex align-items-center">
      <div className="me-2 flex-grow-1">
        <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="User Name" required />
        </div>
        <div className="me-2 flex-grow-1">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email" required />
        </div>
        <div className="me-2 flex-grow-1">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" required />
        </div>
        </div>
        <div className="mt-3 mb-3 d-flex align-items-center">
        <div className="me-2 flex-grow-1">
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-control" placeholder="Phone Number" required />
        </div>
        <div className="me-2 flex-grow-1">
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="form-control" required>
          <option value="">Select Client</option>
          {clients.map(client => (
            <option key={client._id} value={client._id}>{client.name}</option>
          ))}
        </select>
        </div>
        <div className="me-2 flex-grow-1">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        </div>
        </div>
        <button type="submit" className="btn btn-primary w-20 me-2">{selectedUser ? 'Update User' : 'Add User'}</button>
        <button type="button" className="btn btn-primary w-20 me-2" onClick={() => navigate('/client-list')}>Add Client</button>
        <button type="button" className="btn btn-danger w-20 me-2" onClick={handleLogout}>
        Logout
      </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>

      <h3>User List</h3>
      <table className="table table-striped table-bordered mt-4">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Phone Number</th>
            <th>Client</th>
            <th>Role</th>
            {loggedInUser.role === 'admin' && (
            <th>Actions</th>
          )}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password || 'N/A'}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.client ? user.client.name : 'N/A'}</td>
              <td>{user.role}</td>
                {loggedInUser.role === 'admin' && (
              <td>
                    <button className="btn btn-primary w-20 me-2" onClick={() => setSelectedUser(user)}>Edit</button>
                    <button className="btn btn-primary w-20 me-2" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
