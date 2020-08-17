var mongoose = require('mongoose');

// Category Schema
var commericalCategorySchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }

});

var CommericalCategory = module.exports = mongoose.model('CommericalCategory', commericalCategorySchema);