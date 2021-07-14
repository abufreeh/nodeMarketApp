const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const Account = require('../models/account');
const Category = require('../models/category');
const Product = require('../models/product');

router.get('/', isAuth, async (request, response) => {
    const categories = await Category.find().populate('accountId');
    response.render('dashboard', {
        categories: categories
    });
});

router.get('/products/:categoryId', isAuth, async(request, response) => {
    const categoryId = request.params.categoryId;
    const category = await Category.findById(categoryId);
    const products = await Product.find({ categoryId: categoryId });
    response.render('products', {
        category: category,
        products: products
    });
})

router.get('/editProduct/:productId', isAuth, async(request, response) => {
    const productId = request.params.productId;
    const categories = await Category.find();
    const product = await Product.findById(productId);
    response.render('edit_product', {
        product: product,
        categories: categories
    });
})


module.exports = router;