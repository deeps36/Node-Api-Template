// Use ES modules and import necessary modules
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// User Registration Handler
export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    // Create a privacy entry for the user
    await db.privacy.create({
      uid: user.user_id,
      pid: 0,
    });

    // Generate JWT tokens
    const tokenPayload = { id: user.user_id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    successResponse(res, {
      msg: 'User registered successfully',
      user,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, error.message);
  }
};

// User Login Handler
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.user.findOne({ where: { username } });

    if (!user) {
      return errorResponse(res, 'Invalid username or password.', 401);
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid username or password.', 401);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    successResponse(res, {
      id: user.user_id,
      name: user.name,
      isMaster: user.isMaster,
      mobile: user.mobile,
      type_id: user.type_id,
      token,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 'Internal server error', 500);
  }
};
