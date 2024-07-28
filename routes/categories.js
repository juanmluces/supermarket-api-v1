const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryById } = require('../models/categories.model')

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories)
  } catch (error) { res.json({ error: error.message }) }
})

router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    res.json(category);
  } catch (error) {
    res.json({error: error.message})
  }
} )


module.exports = router;
