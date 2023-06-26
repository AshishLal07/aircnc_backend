const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title:String,
    address:String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut:Number,
    maxGuest:Number,
    price:Number,
},{timestamps:true});

const Places = mongoose.model('Places',placeSchema);

module.exports = Places;
