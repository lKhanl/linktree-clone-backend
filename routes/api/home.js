const { Router } = require('express');
const config = require('../../config');

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Hello World!' });
});

module.exports = router;
