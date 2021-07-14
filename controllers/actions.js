const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const Category = require('../models/category');
const Product = require('../models/product');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const isAuth = require('../middleware/isAuth');

router.post('/register', async(request, response) => {
    const id = mongoose.Types.ObjectId();
    const fullname = request.body.fullname;
    const email = request.body.email;
    const password = request.body.password;

    const account = await Account.findOne({ email: email });

    if(account){
        console.log('Email exists');
        response.redirect('/');
    }
    else{
        const hash_password = await bcryptjs.hash(password, 10);
        const _account = new Account({
            _id: id,
            fullname: fullname,
            email: email,
            password: hash_password,
            account_role: 'User'
        });
        _account.save()
        .then(account_created => {
            console.log(JSON.stringify(account_created));
            response.redirect('/');
        })
        .catch(error => {
            console.log(error);
            response.redirect('/');
        });
    }
});

router.post('/login', async (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    Account.findOne({ email: email })
    .then(async account => {
        const isPasswordMatch = await bcryptjs.compare(password, account.password);
        if(isPasswordMatch){
            request.session.userIsLoggedIn = true;
            request.session.user = account;
            request.session.save();
            response.redirect('/dashboard');
        }
        else{
            console.log("Passwords don't match");
            response.redirect('/');
        }
    })
    .catch(error => {
        console.log(error);
        response.redirect('/');
    });
});

router.get('/logout', isAuth, async (request, response) => {
    request.session.destroy();
    response.redirect('/');
});

router.post('/addProduct/:categoryId', isAuth, async(request, response) => {
    const id = mongoose.Types.ObjectId();
    const accountId = request.session.user._id;
    const productName = request.body.productName;
    const unitsInStock = request.body.unitsInStock;
    const productPrice = request.body.productPrice;
    const productDescription = request.body.productDescription;
    const productImage = request.body.productImage;
    const categoryId = request.params.categoryId;

    const _product = new Product({
        _id: id,
        productName: productName,
        unitsInStock: unitsInStock,
        productPrice: productPrice,
        productDescription: productDescription,
        productImage: productImage,
        isVisible: true,
        categoryId: categoryId,
        accountId: accountId
    });
    _product.save()
    .then(product_added => {
        console.log(product_added);
        response.redirect(`/dashboard/products/${categoryId}`);
    })
    .catch(error => {
        console.log(error);
        response.redirect(`/dashboard/products/${categoryId}`);
    })
})

router.post('/addCategory', isAuth, async (request, response) => {
    const id = mongoose.Types.ObjectId();
    const accountId = request.session.user._id;
    const categoryName = request.body.categoryName;
    const categoryOrder = request.body.categoryOrder;
    const categoryImage = request.body.categoryImage;

    const _category = new Category({
        _id: id,
        categoryName: categoryName,
        categoryOrder: categoryOrder,
        categoryImage: categoryImage,
        isVisible: true,
        accountId: accountId
    });
    _category.save()
    .then(category_added => {
        response.redirect('/dashboard');
    })
    .catch(error => {
        console.log(error);
        response.redirect('/dashboard');
    });
});


router.post('/editProductAction/:productId', isAuth, async(request, response) => {
    const accountId = request.session.user._id;
    const productName = request.body.productName;
    const unitsInStock = request.body.unitsInStock;
    const productPrice = request.body.productPrice;
    const productDescription = request.body.productDescription;
    const productImage = request.body.productImage;
    const categoryId = request.body.categoryId;
    const productId = request.params.productId;

    Product.findById(productId)
    .then(product => {

        product.accountId = accountId;
        product.productName = productName;
        product.unitsInStock = unitsInStock;
        product.productPrice = productPrice;
        product.productDescription = productDescription;
        product.productImage = productImage;
        product.categoryId = categoryId;
        product.save()
        .then(product_updated => {
            response.redirect('/dashboard/editProduct/' + productId);
        })
    })
    .catch(error => {
        response.redirect('/dashboard/editProduct/' + productId);
    })
})



router.get('/removeProduct/:productId/:categoryId', isAuth, async(request, response) => {
    const productId = request.params.productId;
    const categoryId = request.params.categoryId;
    Product.findByIdAndRemove(productId)
    .then(product_removed => {
        response.redirect(`/dashboard/products/${categoryId}`);
    })
    .catch(error => {
        response.redirect(`/dashboard/products/${categoryId}`);
    })
})

module.exports = router;