const express = require('express');
const router = express.Router();

// Get Product Model
const Product = require('./../models/products');

// Get Category model
const Category = require('./../models/category');

// Get Commerical property Model
const CommericalProperty = require('./../models/comm_products');
const CommericalCategory = require('./../models/commericalcategory');

/*
 * GET all products
 */
router.get('/',(req, res) => {
   Product.find()
      .sort({
         date: -1,
      })
      .limit(3)
      .exec((err, products) => {
         if (err) return console.log(err);
         else {
            CommericalProperty.find()
               .sort({
                  date: -1
               })
               .limit(3)
               .exec((err, commericalProperty) => {
                  if (err) return console.log(err);
                  else {
                     res.render('user/index', {
                        title: 'home',
                        products: products,
                        commericalProperty: commericalProperty
                     });
                  }
               })
         }
      });
});
/*
 *  Get all residential property
 */
router.get('/properties', (req, res) => {
   Category.find((req, categories) => {
      Product.find()
         .sort({
            date: -1,
         })
         .exec((err, products) => {
            if (err) return console.log(err);
            res.render('user/properties', {
               title: 'properties',
               products: products,
               residental: true
            });
         });
   });
});
/*
 * Get all Commerical property
 */
router.get('/commerical', (req, res) => {
   CommericalCategory.find((req, categories) => {
      CommericalProperty.find()
         .sort({
            date: -1,
         })
         .exec((err, products) => {
            if (err) return console.log(err);
            res.render('user/commerical-properties', {
               title: 'properties',
               products: products,
               residental: false
            });
         });
   });
});

/*
 * GET products by category
 */
router.get('/properties/:category', (req, res) => {
   const categorySlug = req.params.category;
   Category.findOne({
         slug: categorySlug,
      },
      (err, c) => {
         Product.find({
               category: categorySlug
            })
            .sort({
               date: -1
            })
            .exec((err, products) => {
               if (err) console.log(err);
               res.render('user/category-properties', {
                  title: 'properties',
                  products: products,
                  residental: true
               });
            });
      },
   );
});
/*
 * GET commerical property by category
 */
router.get('/commerical/:category', (req, res) => {
   const categorySlug = req.params.category;
   CommericalCategory.findOne({
         slug: categorySlug,
      },
      (err, c) => {
         CommericalProperty.find({
               category: categorySlug
            })
            .sort({
               date: -1
            })
            .exec((err, products) => {
               if (err) console.log(err);
               res.render('user/commerical-category-properties', {
                  title: 'properties',
                  products: products,
                  residental: false
               });
            });
      },
   );
});

/*
 * GET product details
 */
router.get('/properties/:category/:product/:_id', (req, res) => {
   Product.findById({
      _id: req.params._id
   }, (err, product) => {
      if (err) return console.log(err)
      res.render('user/properties-single', {
         title: 'properties',
         product: product
      })
   })
});

/*
 * GET commerical property details
 */
router.get('/properties/:category/:product/:_id', (req, res) => {
   CommericalProperty.findById({
      _id: req.params._id
   }, (err, product) => {
      if (err) return console.log(err)
      res.render('user/properties-single', {
         title: 'properties',
         product: product
      })
   })
});
/*
 * GET commerical property details
 */
router.get('/commerical/:category/:product/:_id', (req, res) => {
   CommericalProperty.findById({
      _id: req.params._id
   }, (err, product) => {
      if (err) return console.log(err)
      res.render('user/properties-single', {
         title: 'properties',
         product: product
      })
   })
});
// Exports
module.exports = router;