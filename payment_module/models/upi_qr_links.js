const mongoose = require('mongoose');

const upiPayLinks = new mongoose.Schema({
    payeeName:{
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        min: 0
    },
    vpa:{
        type: String,
        required: true,
        unique: true
    },
    reason:{
        type:String,
        required: true
    },
    qrcode:{
        type: String,
        required: true
    },
    bgColor:{
        type: String,
        default:'#000000'
    },
    logo: {
        type: String,
    }
});
module.exports = mongoose.model('upi_link',upiPayLinks);