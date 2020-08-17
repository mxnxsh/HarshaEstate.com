const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const isAdmin = auth.isAdmin;
// Get Category model
const CommericalCategory = require('../models/commericalcategory');
/*
 * GET category index
 */
router.get('/', isAdmin,(req, res) => {
    CommericalCategory.find((err, commericalCategory) => {
        if (err) return console.log(err);
        res.render('admin/comm_categories', {
            commericalCategory: commericalCategory,
        });
    });
});

/*
 * GET add category
 */
router.get('/commerical-add-categories', isAdmin,(req, res) => {
    const title = '';
    const error = ''
    res.render('admin/comm_add_categories', {
        title: title,
        error: error
    });
});

/*
 * POST add category
 */
router.post('/commerical-add-categories', (req, res) => {
    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    CommericalCategory.findOne({
            slug: slug,
        },
        (err, category) => {
            if (category) {
                res.render('admin/comm_add_categories', {
                    title: title,
                    error: `${category.title} already present`
                });
            } else {
                var commericalCat = new CommericalCategory({
                    title: title,
                    slug: slug,
                });
                commericalCat.save(err => {
                    if (err) return console.log(err);
                    CommericalCategory.find(function (err, commericalCategory) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.commericalCategory = commericalCategory;
                        }
                    });
                    req.flash('success_msg', 'Category added!');
                    res.redirect('/admin/commerical-categories');
                });
            }
        },
    );
});

/*
 * GET edit category
 */
router.get('/commerical-edit-categories/:id', isAdmin,(req, res) => {
    const error = ''
    CommericalCategory.findById(req.params.id, (err, category) => {
        if (err) return console.log(err);
        res.render('admin/comm_edit_categories', {
            title: category.title,
            id: category._id,
            error: error
        });
    });
});
/*
 * POST edit category
 */
router.post('/commerical-edit-categories/:id', (req, res) => {
    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const id = req.params.id;
    CommericalCategory.findOne({
            slug: slug,
            _id: {
                $ne: id,
            },
        },
        (err, category) => {
            if (category) {
                res.render('admin/comm_edit_categories', {
                    title: title,
                    id: id,
                    error: `${category.title} already present`
                });
            } else {
                CommericalCategory.findById(id, (err, category) => {
                    if (err) return console.log(err);
                    category.title = title;
                    category.slug = slug;
                    category.save(err => {
                        if (err) return console.log(err);
                        CommericalCategory.find(function (err, commericalCategory) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.commericalCategory = commericalCategory;
                            }
                        });
                        req.flash('success_msg', 'Category added!');
                        res.redirect('/admin/commerical-categories');
                    });
                });
            }
        },
    );
});

/*
 * GET delete category
 */
router.get('/delete-commerical-category/:id', isAdmin
       , function (req, res) {
    CommericalCategory.findByIdAndDelete(req.params.id, function (err) {
        if (err) return console.log(err);
        CommericalCategory.find(function (err, commericalCategory) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.commericalCategory = commericalCategory;
            }
        });
        req.flash('success_msg', 'Category deleted!');
        res.redirect('/admin/commerical-categories');
    });
});
// Exports
module.exports = router;