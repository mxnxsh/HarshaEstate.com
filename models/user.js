const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isChecked:{
        type:Boolean,
        default:true
    },
    admin: {
        type: Number
    }

});

var User = module.exports = mongoose.model('User', UserSchema);