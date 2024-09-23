const User = require('../models/User');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.registerUser = async (req, res) => {
  const { name, email, password, clientId, isAdmin } = req.body;

  try {
    const user = new User({ name, email, password, clientId, isAdmin });
    await user.save();

    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Other CRUD operations (login, getUsers)
