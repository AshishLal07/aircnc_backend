const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const multer = require('multer')
const path = require('path');
const fs = require("fs");
const Place = require('../models/Place');
const Places = require("../models/Place");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");


function getUserDataFromJwt(token){
    return new Promise((resolve,reject) => {
        jwt.verify(token,process.env.JWT_SECRET,{},(err,userData)=>{
            if(err)throw err;
            resolve(userData);
        })
    })
}

module.exports.userRegister = async (req,res) => {
   try {
    
    const {name,email,password} = req.body
    const saltRound = 10;
    const hashPassword = bcrypt.hashSync(password,saltRound);
    
    const newUser = await User.create({name,email,password:hashPassword});

    res.json(newUser);

   } catch (error) {
        res.status(401).json(error);
   }
};

module.exports.userLogin = async (req,res) => {
    
    const {email,password} =req.body;
    if(email === "" || password ==="" ){
        return res.statue(400).json('Enter the valid details')
    }
    const validUser = await User.findOne({email});
    if(validUser){
        const passOk = bcrypt.compare(password,validUser.password);
        if(!passOk){
            return res.status(404).json('Enter a valid email/password');
        }

    }else{
        return res.status(404).json('Enter a valid email/password');
    }

    jwt.sign({email:validUser.email,id:validUser._id}, process.env.JWT_SECRET,{}, (err,token)=> {
        if(err) throw err;
        res.cookie("token", token).json(validUser);
    });

}

module.exports.userProfile = async (req,res) => {
    
        const{ token} = req.cookies;
        
        if(token){
            
            jwt.verify(token, process.env.JWT_SECRET,{},async (err,data)=>{
                if(err)throw err
                const userData = await User.findById(data.id);
                
                if(userData){
                    data['name'] = userData.name;
                    res.json(data);
                }else{
                    res.json('Error while login');
                }  
            });
            // res.json("error in while logging")
        }else{
            res.json({})
        }
       
}

module.exports.userLogut = async(req,res) => {
        
       res.cookie('token', '').json(true);
}

module.exports.userLinkUploads = async (req,res) => {

    const {link} = req.body;
    const newPath = path.join(__dirname,'../uploads/');
    const newName = 'photo'+Date.now()+'.jpeg';
    await imageDownloader.image({
        url:link,
        dest: `${newPath}`+newName
    })
    res.json(newName)


}
// const photosmiddleware = multer.diskStorage({destination:'uploads'})
module.exports.userUploads = async(req,res) => {
    const uploadedFiles = []

    for(let i = 0 ; i< req.files.length ;i++){
        const {path,originalname} = req.files[i];
        const part = originalname.split('.');
        const ext = part[part.length - 1];
        const newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/',''));
    }    
    
    res.json(uploadedFiles);
}
module.exports.userNewPlace = async (req,res) => {
    const {token} = req.cookies;
    const {
        title,
        address,
        addedPhoto,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price
    } = req.body;
    
    jwt.verify(token,process.env.JWT_SECRET, {}, async(err,userData)=>{
        if(err) throw err;
       const placeDoc = await Places.create({
            owner:userData.id,
			title,
			address,
			photos:addedPhoto,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuest,price
		});
        res.json(placeDoc)
    });
    
}

module.exports.userPlaces = async (req,res) => {
    const {token} = req.cookies;
    
    jwt.verify(token,process.env.JWT_SECRET, {}, async (err,userData)=>{
       const {id} = userData;
       const ObjectId = new mongoose.Types.ObjectId(id);
       const list = await Places.find({owner:ObjectId});
    
       res.json(list);

    })
    

}

module.exports.userPlace = async (req,res) => {

    const {id} = req.params;

    const place = await Places.findById(id);
    
    if(place){
        res.json(place);
    }else{
        res.json('re-login');
    }

}

module.exports.updatePlace = async( req,res) => {
    const {token} =req.cookies;
    const {id,  title,
        address,
        addedPhoto,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,price} = req.body;
    jwt.verify(token,process.env.JWT_SECRET, {}, async(err,userData)=>{
        const place = await Places.findById(id);
        
        if(place.owner.toString() === userData.id){
            
             place.set({
                title,
                address,
                photos:addedPhoto,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuest,price
            });

            await place.save();
            
            res.json('ok');
        }
       

})
}

module.exports.allPlaces = async(req,res)=>{
    const placeList = await Places.find();
    res.json(placeList);
}

module.exports.houseDetails = async(req, res) => {
        const {id} = req.params;

        const house = await Places.findById(id);
        
        if(house){
            res.json(house);
        }else{
            res.json('not exist');
        }
        
        
}

module.exports.reservePlace = async(req,res) => {
    const {user,place,checkIn, checkOut, guest, name, mobNo, price} = req.body;
    // console.log(req.body);
   
    const newBooking =  await Booking.create({user,
        place,checkIn, checkOut, guest, name, mobNo, price
    })
    if(newBooking){
        res.json({message:'succesfull reserve',data:newBooking})
    }
   
}

module.exports.userBooking = async(req,res) => {
    const {token} = req.cookies;
    const validUserId = await getUserDataFromJwt(token)
    const bookingData = await Booking.find({user:validUserId.id}).populate("place");
    
    res.json(bookingData);
    

    
}