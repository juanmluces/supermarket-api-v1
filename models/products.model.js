const getProductById = (pId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT id, marca as "brand", nombre as "productName", imagen as "imageUrl", precio as "price", fk_categoria as "categoryId" from products WHERE id = ?', [pId], (error, rows) => {
      if (error) reject(error);
      if (!rows || rows.length === 0) resolve(null);
      resolve(rows[0]);
    })
  })
}

const getAllProductsByPage = (pPage) => {
  const offset = ((20 * pPage) - 20);
  let maxPages;
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) as total from products', (err, count) => {
      if (err) reject(err);
      if(count == undefined) count = [{total: 0}];
      maxPages = Math.ceil(count[0].total / 20);
      db.query('SELECT id, marca as "brand", nombre as "productName", imagen as "imageUrl", precio as "price", fk_categoria as "categoryId" from products limit 20 offset ?', [offset], (err, rows) => {
        if (err) reject(err);
        const result = { products: rows, maxPages }
        resolve(result)
      });
    });
  });
}

const getAllProductsByCategoryByPage = (pCategoryId, pPage) => {
  const offset = ((20 * pPage) - 20);
  let maxPages;
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) as total from products where fk_categoria = ? ', [pCategoryId], (err, count) => {
      if (err) reject(err);
      if(count == undefined) count = [{total: 0}]
      maxPages = Math.ceil(count[0].total / 20);
      db.query('SELECT id, marca as "brand", nombre as "productName", imagen as "imageUrl", precio as "price", fk_categoria as "categoryId" from products where fk_categoria = ? limit 20 offset ?', [pCategoryId, offset], (err, rows) => {
        if (err) reject(err);
        const result = { products: rows, maxPages };
        resolve(result)
      })
    })
  })
}

const getProductsContainsNameByPage = (pName, pPage) => {
  const offset = ((20 * pPage) - 20);
  let maxPages;
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) as total FROM products WHERE nombre LIKE ? OR marca LIKE ?', [`%${pName}%`, `%${pName}%`], (err, count) => {
      if (err) reject(err);
      if(count == undefined) count = [{total: 0}]
      maxPages = Math.ceil(count[0].total / 20);
      console.log({count});

      db.query('SELECT id, marca as "brand", nombre as "productName", imagen as "imageUrl", precio as "price", fk_categoria as "categoryId" FROM products WHERE nombre LIKE ? OR marca LIKE ? Limit 20 offset ?', [`%${pName}%`, `%${pName}%`, offset], (err, rows) => {
        if (err) reject(err);
        const result = { products: rows, maxPages }
        resolve(result);
      })
    })
  })
}

const getProductsPriceRange = (pFrom, pTo, pPage) => {
  const offset = ((20 * pPage) - 20);
  let maxPages;
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) as total FROM products WHERE precio  BETWEEN ? AND ?', [pFrom, pTo], (err, count) => {
      if (err) reject(err);
      console.log({count});
      if(count == undefined) count = [{total: 0}]
      maxPages = Math.ceil(count[0].total / 20);
      db.query('SELECT id, marca as "brand", nombre as "productName", imagen as "imageUrl", precio as "price", fk_categoria as "categoryId" FROM products WHERE precio  BETWEEN ? AND ? Limit 20 offset ?', [pFrom, pTo, offset], (err, rows) => {
        if (err) reject(err);
        const result = { products: rows, maxPages }
        resolve(result);
      })
    })

  })
}

const postFilterProducts = (filterBody, pPage) =>{
  const {
    name,
    brand,
    range,
    category,
  } = filterBody;
  const offset = ((20 * pPage) - 20);
  let maxPages;
  return new Promise((resolve, reject) => {

    const queryVariables = [];
    if(name) queryVariables.push(`%${name}%`);
    if(brand) queryVariables.push(`%${brand}%`);
    if(category) queryVariables.push(category);
    if(range){
      if(!range.from) range.from = 0;
      if(!range.to) range.to = 999;
      queryVariables.push(range.from);
      queryVariables.push(range.to);
    }
    
    db.query(`SELECT COUNT(*) as total FROM products WHERE id >= 1 ${name ?' AND nombre LIKE ?' : ''} ${brand ?' AND marca LIKE ?' : ''} ${category ?' AND fk_categoria = ?' : ''} ${range ?' AND precio BETWEEN ? AND ?' : ''}`, queryVariables, (err, count) => {
      if (err) reject(err);
      if(count == undefined) count = [{total: 0}]
      maxPages = Math.ceil(count[0].total / 20);

      queryVariables.push(offset)

      db.query(`SELECT id, marca as "brand", nombre as "productName", imagen as "imageUrl", precio as "price", fk_categoria as "categoryId" FROM products WHERE id >= 1 ${name ?' AND nombre LIKE ?' : ''} ${brand ?' AND marca LIKE ?' : ''} ${category ?' AND fk_categoria = ?' : ''} ${range ?' AND precio BETWEEN ? AND ?' : ''} Limit 20 offset ?`, queryVariables, (err, rows) => {
        if (err) reject(err);
        const result = { products: rows, maxPages }
        resolve(result);
      })
    })
  })
  
}

module.exports = { getProductById, getAllProductsByPage, getAllProductsByCategoryByPage, getProductsContainsNameByPage, getProductsPriceRange, postFilterProducts }