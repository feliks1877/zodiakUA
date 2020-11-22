const multer = require('multer')
const uuid = require('uuid').v4
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'images')
    },
    filename(req, file, cb){
        cb(null, uuid())
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', "image/gif"]

const fileFilter = (req, file, cb) => {
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})