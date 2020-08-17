const express = require('express');
const router = express.Router();
const {
    isUser
} = require('../config/auth')

// Get Product model
const Product = require('./../models/products')

// Get Commerical Property model
const CommericalProperty = require('./../models/comm_products');

/*
 * GET wishlist page
 */
router.get('/property', function (req, res) {
    if (req.session.wishlist && req.session.wishlist.length == 0) {
        delete req.session.wishlist;
        // res.redirect('/wishlist/wishlist');
        // res.send("Deleted");
    } else {
        res.render('user/wishlist', {
            title: 'wishlist',
            wishlist: req.session.wishlist
        });
    }
});

/*
 * GET add product to wishlist
 */
router.get('/add/:_id', isUser.ensureAuthenticated, function (req, res) {
    const _id = req.params._id;
    Product.findById({
        _id: _id
    }, function (err, p) {
        if (err) console.log(err);
        else if (typeof req.session.wishlist === "undefined") {
                req.session.wishlist = [];
                req.session.wishlist.push({
                    _id: p._id,
                    title: p.title,
                    price: p.price,
                    avatar: "/uploads/avatar/" + p.avatar
            })
        } else {
            let wishlist = req.session.wishlist;
            var newItem = true;
            for (var i = 0; i < wishlist.length; i++) {
                if (wishlist[i]._id === _id) {
                    newItem = false;
                    req.flash('error_msg', 'Property already in wishlist');
                    break;
                }
            }
            if (newItem) {
                wishlist.push({
                    _id: p._id,
                    title: p.title,
                    price: p.price,
                    avatar: "/uploads/avatar/" + p.avatar
                });
            }
        }
        req.flash('success_msg', 'Product added!');
        res.redirect('/wishlist/property');
    });
});
/*
 * GET add commerical property to wishlist
 */
router.get('/add1/:_id', isUser.ensureAuthenticated, function (req, res) {
    const _id = req.params._id;
    CommericalProperty.findById({
        _id: _id
    }, function (err, p) {
        if (err) console.log(err);
        else if (typeof req.session.wishlist === "undefined") {
            req.session.wishlist = [];
            req.session.wishlist.push({
                _id: p._id,
                title: p.title,
                price: p.price,
                avatar: "/uploads/avatar/" + p.avatar
            })
        } else {
            let wishlist = req.session.wishlist;
            var newItem = true;
            for (var i = 0; i < wishlist.length; i++) {
                if (wishlist[i]._id === _id) {
                    newItem = false;
                    req.flash('error_msg', 'Property already in wishlist');
                    break;
                }
            }
            if (newItem) {
                wishlist.push({
                    _id: p._id,
                    title: p.title,
                    price: p.price,
                    avatar: "/uploads/avatar/" + p.avatar
                });
            }
        }
        req.flash('success_msg', 'Product added!');
        res.redirect('/wishlist/property');
    });
});
/*
 * GET clear cart
 */
router.get('/clear', function (req, res) {
    delete req.session.wishlist;
    req.flash('success_msg', 'Cart cleared!');
    res.redirect('/wishlist/property');
});
/*
 * GET update product
 */
router.get('/update/:product', function (req, res) {
    const slug = req.params.product;
    const wishlist = req.session.wishlist;
    const action = req.query.action;
    for (const i = 0; i < wishlist.length; i++) {
        if (wishlist[i].title == slug) {
            switch (action) {
                case "clear":
                    wishlist.splice(i, 1);
                    if (wishlist.length == 0)
                        delete req.session.wishlist;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    res.redirect('/wishlist/property');
});
module.exports = router;