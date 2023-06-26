const multer = require('multer');

 const photosMiddleware = multer({dest:'uploads'}).array('photos',100);

module.exports = photosMiddleware;