/* eslint-disable */
const express = require('express');

const router = express.Router();
const authRoutes = require('./auth/auth.js');
const fileRoutes = require('./fileRoutes.js');
router.use('/auth', authRoutes);
router.use('/files', fileRoutes);
router.use('*', (req, res) =>
  res.status(404).json({ error: '404: Page Not Found!' }),
);

module.exports = router;
