import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Assuming you're using react-router for navigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users`);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { user } = response.data;

      console.log(response);
      
      // Store the token in localStorage (or sessionStorage)
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to user page
      navigate('/user-list');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleLogin} className="mt-3 d-flex align-items-center">
      <div className="me-2 flex-grow-1">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        </div>
        <div className="me-2 flex-grow-1">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        </div>
        <button type="submit" className="btn btn-primary w-20 me-2">Login</button>
        <button type="button" className="btn btn-primary w-20 me-2" onClick={() => navigate('/validate-pan')}>PAN Validation</button>
        {error && <div style={{ color: 'red' }} className="text-danger mt-2">{error}</div>}
      </form>

      <table className="table table-striped table-bordered mt-4">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Phone Number</th>
            <th>Client</th>
            <th>Role</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Login;
