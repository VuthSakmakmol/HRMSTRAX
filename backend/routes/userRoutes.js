// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Only GeneralManager can manage users
router.use(protect, authorizeRoles('GeneralManager'));

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
