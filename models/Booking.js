const mongoose = require('mongoose');

const bookingSchmea = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId, required:true, },
    place:{type:mongoose.Types.ObjectId, required:true,ref:'Places'},
    checkIn:{type:Date ,required:true},
    checkOut:{type:Date ,required:true},
    guest:{type:Number ,required:true},
    name:{type:String ,required:true}, 
    mobNo:{type:String ,required:true}, 
    price:{type:Number, required:true}
})


const Booking = mongoose.model('Booking', bookingSchmea);


module.exports = Booking;