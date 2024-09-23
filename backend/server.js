const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pan = require('./models/Pan'); // Assuming you have a Pan model
const Client = require('./models/Client');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const dbURI = 'mongodb+srv://root:P0bSUQRlNypXNbN7@cluster0.b7zgitx.mongodb.net/Valuepitch?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  // POST: /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Directly compare plain text password
    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Since we're not using JWT, just return the user info
    return res.json({ message: 'Login successful', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to fetch PAN details by PAN number
app.post('/api/validate-pan', async (req, res) => {
  try {
    const { pan } = req.body;

    // PAN format validation using regex
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    // Check if the provided PAN matches the regex
    if (!panRegex.test(pan)) {
      return res.status(400).json({
        status: "error",
        message: "PAN must be a valid 10-character alphanumeric string (e.g., ABCDE1234F)",
        errorCode: "INVALID_PAN_FORMAT"
      });
    }else{
        const panData = await Pan.findOne({ pan_number: pan });

        if (panData) {
          res.json({
            statusCode: 200,
            statusMsg: "Success",
            result: true,
            msg: "Valid PAN Number.",
            data: panData,
          });
        } else {
          res.status(404).json({
            status: "error",
            message: "PAN validation failed",
            errorCode: "INVALID_PAN",
            errorDetails: "The provided PAN is invalid or does not exist."
          });
        }
    }

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      errorDetails: error.message,
    });
  }
});

// API endpoint to fetch all PAN entries
app.get('/api/pans', async (req, res) => {
    try {
      const panData = await Pan.find();
    //   console.log(panData);
      
      if (panData.length > 0) {
        res.json({
          statusCode: 200,
          statusMsg: "Success",
          result: true,
          msg: "PAN entries retrieved successfully.",
          data: panData,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "No PAN entries found",
          errorCode: "NO_PAN_ENTRIES",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Server error",
        errorDetails: error.message,
      });
    }
  });

  app.post('/api/pans', async (req, res) => {
    try {
      const pan = new Pan(req.body);
      console.log(pan); 
      await pan.save();
      res.status(201).json({ message: 'Pan created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Client Management Routes

// Create Client
app.post('/api/clients', async (req, res) => {
    try {
      const client = new Client(req.body);
      console.log(client); 
      await client.save();
      res.status(201).json({ message: 'Client created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Read Clients
  app.get('/api/clients', async (req, res) => {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update Client
  app.put('/api/clients/:id', async (req, res) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json({ message: 'Client updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete Client
  app.delete('/api/clients/:id', async (req, res) => {
    try {
      await Client.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // User Management Routes
  
  // Create User
  app.post('/api/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Read Users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find().populate('client', 'name');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update User
  app.put('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete User
  app.delete('/api/users/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
