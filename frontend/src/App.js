import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PANValidation from './components/PANValidation';
import ClientList from './components/ClientList';
import UserManagement from './components/UserList';
import Login from './components/Login';
import PanEntryForm from './components/PanEntryForm';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Replace Switch with Routes, and component with element */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/validate-pan" element={<PANValidation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client-list" element={<ClientList />} />
        <Route path="/user-list" element={<UserManagement />} />
        <Route path="/pan-entry" element={<PanEntryForm />} />
        {/* <Route path="*" element={<Navigate to="/not-found" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;


