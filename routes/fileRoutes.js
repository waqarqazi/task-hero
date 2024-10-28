const express = require('express');

const router = express.Router();
const fileController = require('../controllers/fileController.js');
const auth = require('../middleware/authMiddleware.js');

router.route('/upload').post(auth, fileController.fileUpload);
router.route('/').get(auth, fileController.getAllFiles);
router.route('/share/:shareId').get(fileController.createShareableLink);


module.exports = router;
