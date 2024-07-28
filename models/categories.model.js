const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT id, name, image as "imageUrl" from categories', (err, rows) => {
      if (err) reject(err);
      if (!rows || rows.length === 0) resolve(null);
      resolve(rows);
    })
  })
}

const getCategoryById = (pId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT id, name, image as "imageUrl" from categories WHERE id = ?', [pId], (err, rows) => {
      if (err) reject(err);
      if (!rows || rows.length === 0) resolve(null);
      resolve(rows[0]);
    })
  })
}

module.exports = { getAllCategories, getCategoryById }