const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to db
mongoose.connect('mongodb://localhost:27017/MeetrealEstate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   useCreateIndex: true,
});
// Connect to cloud db
/*mongoose.connect(
   'mongodb+srv://admin-manish:kingisback123@cluster0-tm1kx.mongodb.net/MeetRealEstate',
   {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   },
);*/

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log('Connected to MongoDB');
});

// set view engine
app.set('view engine', 'ejs');

// use bodyparser middleware
app.use(
   bodyParser.urlencoded({
      extended: true,
   }),
);

// use public folder
app.use(express.static('public'));

// Express session
app.use(
   session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
   }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.danger_msg = req.flash('danger_msg');
   res.locals.error = req.flash('error');
   next();
});

// Set global errors variable
app.locals.errors = null;
app.get('*', function (req, res, next) {
   res.locals.wishlist = req.session.wishlist;
   res.locals.user = req.user || null;
   next();
});

// Get Category Model
const Category = require('./models/category');

// Get all categories to pass to header.ejs
Category.find((err, categories) => {
   if (err) {
      console.log(err);
   } else {
      app.locals.categories = categories;
   }
});
// Get commerical Category Model
const CommericalCategory = require('./models/commericalcategory');

// Get all commerical Category to pass to header.ejs
CommericalCategory.find((err, commericalCategory) => {
   if (err) {
      console.log(err);
   } else {
      app.locals.commericalCategory = commericalCategory;
   }
});

// adding routes
const product = require('./routes/products');
const home = require('./routes/home');
const adminProducts = require('./routes/admin_products.js');
const adminCategories = require('./routes/resi_categories.js');
const adminCommericalProperty = require('./routes/comm_product.js');
const adminCommericalCategory = require('./routes/comm_categories.js');
const users = require('./routes/users.js');
const wishlist = require('./routes/wishlist');

// using routes
app.use('/', product);
app.use('/admin', home);
app.use('/admin/products', adminProducts);
app.use('/admin/categories', adminCategories);
app.use('/admin/commerical-property', adminCommericalProperty);
app.use('/admin/commerical-categories', adminCommericalCategory);
app.use('/users', users);
app.use('/wishlist', wishlist);

app.get('/about', (req, res) => {
   res.render('user/about', {
      title: 'about',
   });
});
app.get('/services', (req, res) => {
   res.render('user/services', {
      title: 'services',
   });
});

app.use((req, res, next) => {
   res.status(404).render('user/404', {
      title: 'Error',
   });
});
// Connect with the server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on ${port}`));
