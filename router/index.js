const express = require('express');
const router = express.Router();

const photosmiddleware = require('../middleware/photoMiddleware.js')
const userController = require('../controller/userController.js')

router.get('/profile',userController.userProfile);
router.get('/placesList',userController.userPlaces)
router.get('/place/:id',userController.userPlace)
router.get('/allPlaces',userController.allPlaces);
router.get('/houseDetail/:id',userController.houseDetails);
router.get('/bookings',userController.userBooking);

router.post('/register' ,userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/logout',userController.userLogut)
router.post('/uploadLink',userController.userLinkUploads);
router.post('/uploads',photosmiddleware,userController.userUploads);
router.post('/newPlace',userController.userNewPlace)
router.post('/reserve' ,userController.reservePlace);


router.put('/updatePlace',userController.updatePlace);

module.exports = router;