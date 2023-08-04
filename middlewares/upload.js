const path = require('path');
const multer = require('multer');

const tempPath = path.join(__dirname,'../', 'tmp');

const multerConfig = multer.diskStorage({
    destination: tempPath
})

const upload = multer({
    storage: multerConfig
})

module.exports = upload;