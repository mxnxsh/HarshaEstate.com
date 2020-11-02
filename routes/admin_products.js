const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
   check,
   validationResult
} = require('express-validator');
const fs = require('fs');

const auth = require('../config/auth');
const isAdmin = auth.isAdmin;
const helpers = require('./../middleware/helper');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      if (file.fieldname === 'avatar') {
         cb(null, './public/uploads/avatar');
      } else if (file.fieldname === 'gallery') {
         cb(null, './public/uploads/gallery');
      }
   },
   filename: function (req, file, cb) {
      if (file.fieldname === 'avatar') {
         cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
         );
      } else if (file.fieldname === 'gallery') {
         cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
         );
      }
   },
});

// Get Product model
const Product = require('./../models/products');
// Get Ctaegory model
const Category = require('./../models/category');

router.get('/', isAdmin,(req, res) => {
   Product.find({}, (err, products) => {
      res.render('admin/products', {
         products: products,
      });
   });
});

/*
 * GET add product
 */
router.get('/add_products', isAdmin,(req, res) => {
   const {
      title,
      desc,
      price,
      deposit,
      bathroom,
      floorArea,
      location,
   } = '';
   Category.find((err, categories) => {
      res.render('admin/add_products', {
         title: title,
         desc: desc,
         Rental: 'Rental',
         NonRental: 'NonRental',
         price: price,
         deposit: deposit,
         ReadyPosession: 'Ready posession',
         UnderConstrution: 'Under Constrution',
         bathroom: bathroom,
         floorArea: floorArea,
         location: location,
         categories: categories,
         Garden: 'Garden',
         PowerBackup: 'Power Backup',
         Lift: 'Lift',
         Temple: 'Temple',
         ChildrenPlayArea: 'Children Play Area',
         GYM: 'GYM',
         School: 'School',
         SuperMarket: 'Super Market',
         Station: 'Station',
      });
   });
});
/*
 * POST add product
 */
router.post('/add_products', (req, res) => {
   let upload = multer({
      storage: storage,
      fileFilter: helpers.imageFilter,
   }).fields([{
         name: 'avatar',
         maxCount: 1,
      },
      {
         name: 'gallery',
         maxCount: 10,
      },
   ]);
   upload(req, res, err => {
      const {
         title,
         desc,
         option1,
         price,
         deposit,
         option2,
         category,
         amenities,
         nearby,
         bathroom,
         floorArea,
         location,
         isOn
      } = req.body;
      const slug = title.replace(/\s+/g, '-').toLowerCase();
      var imageFile =
         typeof req.files['avatar'] !== 'undefined' ?
         req.files.avatar[0].filename :
         '';
      if (req.fileValidationError) {
         return res.send(req.fileValidationError);
      } else if (err instanceof multer.MulterError) {
         return res.send(err);
      } else if (err) {
         return res.send(err);
      }
      const files = req.files['gallery'];
      if (typeof files === 'undefined') {
         var gallery = [];
      } else {
         gallery = files.map(file => file.filename);
      }
      const round_Of_Price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const product = new Product({
         title: title,
         slug: slug,
         desc: desc,
         option1: option1,
         price: round_Of_Price,
         deposit: deposit,
         option2: option2,
         location: location,
         floorArea: floorArea,
         bathroom: bathroom,
         isOn: isOn,
         category: category,
         amenities: amenities,
         nearby: nearby,
         avatar: imageFile,
         gallery: gallery,
      });
      product.save(err => {
         if (err) return console.log(err);
         req.flash('success_msg', 'Product added!');
         res.redirect('/admin/products');
      });
   });
});

/*
 * GET edit product
 */
router.get('/edit_products/:_id', isAdmin,(req, res) => {
   Category.find((err, categories) => {
      Product.findById(req.params._id, (err, product) => {
         if (err) {
            console.log(err);
            res.redirect('/admin/products');
         }
         res.render('admin/edit_products', {
            title: product.title,
            slug: product.slug,
            desc: product.desc,
            option1: product.option1,
            NonRental: 'NonRental',
            Rental: 'Rental',
            price: product.price,
            deposit: product.deposit,
            option2: product.option2,
            ReadyPosession: 'Ready posession',
            UnderConstrution: 'Under Constrution',
            categories: categories,
            category: product.category.replace(/\s+/g, '-').toLowerCase(),
            location: product.location,
            floorArea: product.floorArea,
            bathroom: product.bathroom,
            amenities: product.amenities,
            isOn: product.isOn,
            Garden: 'Garden',
            PowerBackup: 'Power Backup',
            Lift: 'Lift',
            Temple: 'Temple',
            nearby: product.nearby,
            ChildrenPlayArea: 'Children Play Area',
            GYM: 'GYM',
            School: 'School',
            SuperMarket: 'Super Market',
            Station: 'Station',
            image: product.avatar,
            _id: product._id,
         });
      });
   });
});
/*
 * POST edit product
 */
router.post('/edit_products/:_id', (req, res) => {
   let upload = multer({
      storage: storage,
      fileFilter: helpers.imageFilter,
   }).fields([{
         name: 'avatar',
         maxCount: 1,
      },
      {
         name: 'gallery',
         maxCount: 10,
      },
   ]);
   upload(req, res, err => {
      const {
         title,
         desc,
         option1,
         price,
         deposit,
         option2,
         category,
         amenities,
         nearby,
         pimage,
         bathroom,
         floorArea,
         location,
         isOn
      } = req.body;
      var imageFile =
         typeof req.files['avatar'] !== 'undefined' ?
         req.files.avatar[0].filename :
         '';
      // console.log('Pimage=' + pimage);
      // console.log('imageFile=' + imageFile.filename);
      const slug = title.replace(/\s+/g, '-').toLowerCase();
      const _id = req.params._id;
      Product.findById(_id, (err, product) => {
         if (err) return console.log(err);
         product.title = title;
         product.slug = slug;
         product.desc = desc;
         product.option1 = option1;
         product.price = price;
         product.deposit = deposit;
         product.option2 = option2;
         product.location = location;
         product.floorArea = floorArea;
         product.bathroom = bathroom;
         product.isOn = isOn;
         product.category = category;
         product.amenities = amenities;
         product.nearby = nearby;
         if (imageFile != '') {
            product.avatar = imageFile;
         }
         product.save(err => {
            if (err) return console.log(err);
            if (imageFile != '') {
               if (pimage != '') {
                  fs.unlink('public/uploads/avatar/' + pimage, err => {
                     if (err) {
                        return console.log(err);
                     } else if (path === 'public/uploads/avatar') {
                        console.log('Image are not present');
                     } else {
                        console.log(`File deleted!`);
                     }
                  });
               }
            }
            req.flash('success_msg', 'Product added!');
            res.redirect('/admin/products');
         });
      });
   });
});

/*
 * GET delete product
 */
router.get('/delete_product/:_id', isAdmin,(req, res) => {
   Product.findByIdAndDelete(req.params._id, function (err, data) {
      if (err) return console.log(err);
      const path = 'public/uploads/avatar/' + data.avatar;
      fs.unlink(path, err => {
         if (path === 'public/uploads/avatar') {
            console.log('Image are not present');
         } else if (err) {
            console.log('No error found');
         } else {
            console.log('Successfully Avatar is deleted');
         }
      });
      const gallery = data.gallery;
      if (gallery.length > 0) {
         gallery.forEach(filePath => {
            fs.unlink('public/uploads/gallery/' + filePath, err => {
               if (err) {
                  console.log("No files found =>",err);
               } else {
                  console.log('Successfully Gallery is deleted');
               }
            });
            return;
         });
      }
   });
   req.flash('success_msg', 'Product added!');
   res.redirect('/admin/products');
});

// Exports
module.exports = router;