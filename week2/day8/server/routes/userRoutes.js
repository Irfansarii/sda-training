const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await userService.authenticateUser(
      req.body.email,
      req.body.password
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;