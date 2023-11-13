const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { Todo } = require('../models');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const userId = req.user.userId;
    const username = req.user.username;

    if (!userId || !username) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    if (!userHasPermission(userId)) {
      return res.status(403).json({ error: 'Forbidden: User does not have permission' });
    }

    const todo = await Todo.create({ title, description, userId });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all todos (requires authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific todo (requires authentication)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a todo (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.title = title;
    todo.description = description;

    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a todo (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete all todos (requires authentication)
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await Todo.destroy({ where: {} });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
