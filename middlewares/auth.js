const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middlewares/auth');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = user;
    next();
  });
}

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const userId = req.user.id;
    const username = req.user.username;

    const token = jwt.sign({ userId, username }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });

    const todo = await Todo.create({title, description });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { authenticateToken };
