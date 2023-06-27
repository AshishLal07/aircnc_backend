const express = require('express');
const router = express.Router();

const photosmiddleware = require('../middleware/photoMiddleware.js')
const userController = require('../controller/userController.js');
const { verifyToken } = require('../middleware/Auth.js');

verifyToken

router.get('/profile', verifyToken,userController.userProfile);
router.get('/placesList',verifyToken,userController.userPlaces)
router.get('/place/:id',userController.userPlace)
router.get('/allPlaces',userController.allPlaces);
router.get('/houseDetail/:id',userController.houseDetails);
router.get('/bookings',verifyToken,userController.userBooking);

router.post('/register' ,userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/logout',userController.userLogut)
router.post('/uploadLink',userController.userLinkUploads);
router.post('/uploads',photosmiddleware,userController.userUploads);
router.post('/newPlace',verifyToken,userController.userNewPlace)
router.post('/reserve' ,userController.reservePlace);


router.put('/updatePlace',verifyToken,userController.updatePlace);

module.exports = router;