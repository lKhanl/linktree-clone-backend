const { Router } = require('express');
// User Model
const User = require('../../models/User');
// import bcrypt for password hashing
const bcrypt = require('bcryptjs');

const router = Router();

// get user
router.get('/', async (req, res) => {
  try {

    const exist = await User.findById(req.user.id).select('-password').select('-_id');
    if (!exist) return res.status(400).json({ msg: 'User not found' });

    res.status(200).json(exist);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// update user
router.put('/', async (req, res) => {

  const { username, name, password, email, newPassword } = req.body;

  // Simple validation
  if (!password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(400).json({ msg: 'User not found' });

  try {

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    if (username) user.username = username;
    if (name) user.name = name;
    if (email) user.email = email;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);

      if (!salt) throw Error('Something went wrong with bcrypt');
      const hash = await bcrypt.hash(newPassword, salt);

      if (!hash) throw Error('Something went wrong hashing the password');
      user.password = hash;
    }

    const updatedUser = await user.save();
    if (!updatedUser) throw Error('Something went wrong saving the user');

    res.status(200).json({message: 'User updated'});
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// delete user
router.delete('/', async (req, res) => {

  try {

    const user = await User.findById(req.user.id);
    if (!user) throw Error('User does not exist');

    const removed = await user.remove();
    if (!removed) throw Error('Something went wrong trying to delete the user');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
