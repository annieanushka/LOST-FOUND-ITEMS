const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'lostandfound_secret_key';

/* ================= REGISTER ================= */

router.post('/register', async (req, res) => {

  try {

    console.log("REGISTER BODY:", req.body);

    const { name, email, phone, password } = req.body;

    /* CHECK REQUIRED FIELDS */

    if (!name || !email || !phone || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    /* CHECK EXISTING EMAIL */

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "Email already registered!"
      });

    }

    /* HASH PASSWORD */

    const hashedPassword =
      await bcrypt.hash(password, 10);

    /* CREATE USER */

    const user = await User.create({

      name,
      email,
      phone,
      password: hashedPassword

    });

    /* CREATE TOKEN */

    const token = jwt.sign(

      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }

    );

    console.log("USER REGISTERED:", user.email);

    /* SEND RESPONSE */

    res.status(201).json({

      success: true,
      message: "Registered successfully!",
      token,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone

      }

    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({

      success: false,
      message: error.message

    });

  }

});


/* ================= LOGIN ================= */

router.post('/login', async (req, res) => {

  try {

    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({

        success: false,
        message: "Email and password required"

      });

    }

    /* FIND USER */

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        success: false,
        message: "Invalid email or password!"

      });

    }

    /* CHECK PASSWORD */

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({

        success: false,
        message: "Invalid email or password!"

      });

    }

    /* CREATE TOKEN */

    const token = jwt.sign(

      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }

    );

    console.log("LOGIN SUCCESS:", user.email);

    res.status(200).json({

      success: true,
      message: "Login successful!",
      token,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone

      }

    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({

      success: false,
      message: error.message

    });

  }

});

module.exports = router;