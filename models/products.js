const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        //required: true
    },
    slug: {
        type: String,
    },
    desc: {
        type: String,
        //required: true
    },
    option1: {
        type: String,
    },
    price: {
        type: String,
    },
    deposit: {
        type: Number,
    },
    option2: {
        type: String,
    },
    bathroom: {
        type: Number,
    },
    floorArea: {
        type: Number,
    },
    location: {
        type: String,
    },
    category: {
        type: String,
        //required: true
    },
    amenities: [{
        type: String
    }],
    nearby: [{
        type: String
    }],
    avatar: {
        type: String
    },
    isOn: {
        type: String
    },
    gallery: [{
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    }

});
const Product = module.exports = mongoose.model('Product', productSchema);