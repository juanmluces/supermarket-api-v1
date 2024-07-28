const router = require('express').Router();
const { 
  getAllProductsByPage, 
  getProductById, 
  getAllProductsByCategoryByPage, 
  getProductsContainsNameByPage,
  getProductsPriceRange,
  postFilterProducts
 } = require('../models/products.model');

router.get('/', async (req, res) => {
  try {
    return res.redirect('page/1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});
router.get('/page', (req, res) => {
  try {
    return res.redirect('1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});
router.get('/page/:pageNum', async (req, res) => {
  try {
    const { pageNum } = req.params;
    const intPageNum = parseInt(pageNum)
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("page/").shift();
    if(!intPageNum || isNaN(intPageNum )|| intPageNum <= 0) return res.json({statusCode: 1, errorMessae: 'Parametro de página incorrecto, debe ser un número mayor que 0'}) 
    const products = await getAllProductsByPage(pageNum)
    products.page = pageNum
    products.nextPage = pageNum < products.maxPages ?  products.nextPage = fullUrl + 'page/' + (intPageNum + 1) : null
    products.prevPage = (pageNum > 1 && pageNum <= products.maxPages) ? fullUrl + 'page/' + (intPageNum - 1) : null;
   return res.json(products)
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    return res.json(product);
  } catch (error) {
    return res.json({ error: error.message });
    
  } 
});

router.get('/category/:cId', (req, res) => {
  try {
    return res.redirect('page/1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get('/category/:cId/page', (req, res) => {
  try {
    return res.redirect('1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get('/category/:cId/page/:pageNum', async (req, res) => {
  try {
    const { cId, pageNum } = req.params;
    const intPageNum = parseInt(pageNum);
    const intCatId = parseInt(cId);
    if(!intPageNum 
      || isNaN(intPageNum )
      || intPageNum <= 0
      || !intCatId
      || isNaN(intCatId)
      || intCatId <= 0
      ) return res.json({statusCode: 1, errorMessae: 'Parametro de página o id categoría incorrecto, debe ser un número mayor que 0'}) 
    const products = await getAllProductsByCategoryByPage(cId, pageNum);
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("page/").shift();
    products.page = pageNum;
    products.nextPage = pageNum < products.maxPages ?  products.nextPage = fullUrl + 'page/' + (intPageNum + 1) : null
    products.prevPage = (pageNum > 1 && pageNum <= products.maxPages) ? fullUrl + 'page/' + (intPageNum - 1) : null;
    return res.json(products)
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get('/name/:pName/page', (req, res) => {
  try {
    return res.redirect('1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get('/name/:pName', (req, res) => {
  try {
    return res.redirect('page/1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.get('/name/:pName/page/:pageNum', async (req, res) => {
  try {
    const { pName, pageNum } = req.params;
    const intPageNum = parseInt(pageNum);
    if(!intPageNum || isNaN(intPageNum) || intPageNum <= 0) return res.json({statusCode: 1, errorMessae: 'Parametro de página incorrecto, debe ser un número mayor que 0'});
    const products = await getProductsContainsNameByPage(pName, pageNum);
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("page/").shift();
    products.page = pageNum;
    products.nextPage = pageNum < products.maxPages ?  products.nextPage = fullUrl + 'page/' + (intPageNum + 1) : null
    products.prevPage = (pageNum > 1 && pageNum <= products.maxPages) ? fullUrl + 'page/' + (intPageNum - 1) : null;
    return res.json(products);
  } catch (error) {
    return res.json({ error: error.message });
    
  }
});

router.get('/price/from/:pFrom/to/:pTo/page/:pageNum', async (req, res) =>{
  try {
    const { pFrom, pTo, pageNum } = req.params;
    const intPageNum = parseInt(pageNum);
    if(!intPageNum || isNaN(intPageNum) || intPageNum <= 0) return res.json({statusCode: 1, errorMessae: 'Parametro de página incorrecto, debe ser un número mayor que 0'});
    const products = await getProductsPriceRange(pFrom, pTo, intPageNum);
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("page/").shift();
    products.page = pageNum;
    products.nextPage = pageNum < products.maxPages ?  products.nextPage = fullUrl + 'page/' + (intPageNum + 1) : null
    products.prevPage = (pageNum > 1 && pageNum <= products.maxPages) ? fullUrl + 'page/' + (intPageNum - 1) : null;
    return res.json(products)
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.post('/filter', (req, res) => {
  try {
    return res.redirect(307,'filter/page/1');
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.post('/filter/page/:pageNum', async (req, res) => {
  try {
    const { pageNum } = req.params 
    const intPageNum = parseInt(pageNum);
    if(!intPageNum || isNaN(intPageNum) || intPageNum <= 0) return res.json({statusCode: 1, errorMessae: 'Parametro de página incorrecto, debe ser un número mayor que 0'});
    const body = req.body;
    const products = await postFilterProducts(body, intPageNum)
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("page/").shift();
    products.page = pageNum;
    products.nextPage = pageNum < products.maxPages ?  products.nextPage = fullUrl + 'page/' + (intPageNum + 1) : null
    products.body = body;
    products.prevPage = (pageNum > 1 && pageNum <= products.maxPages) ? fullUrl + 'page/' + (intPageNum - 1) : null;
    return res.json(products)
  } catch (error) {
    return res.json({ error: error.message });
    
  }
    
});

module.exports = router