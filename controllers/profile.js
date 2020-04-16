let mongoose = require('mongoose'),
  multer = require('multer'),
  tinified = require("tinify"),
  User = mongoose.model('User');

// Multer File upload settings
// const BOOKDIR = './public/books';
const DIR = './public/profile-img';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const fileName = file.fieldname.toLowerCase().split(' ').join('-');
    cb(null, fileName + '-' + Date.now() + '.' + extension)
  }
});


// Multer Mime Type Validation
var upload;
module.exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


module.exports.profileRead = function (req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else if (!!req.params.id) {
    User
      .findById(req.params.id)
      .exec(function (err, user) {
        res.status(200).json(user);
      });
  } else {
    User
      .findById(req.payload._id)
      .exec(function (err, user) {
        res.status(200).json(user);
      });
  }

};

module.exports.profileUpdate = function (req, res) {
  const url = req.protocol + '://' + req.get('host')
  console.log(req.file);
  console.log(req.payload);

  const formInput = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    avatar: `${url}/public/profile-img/${req.file.filename}`,
  }

  // const url = req.protocol + '://' + req.get('host')
  if (!req.payload._id) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else {
    User.findByIdAndUpdate({
      _id: req.payload._id
    }, formInput, {
      new: true
    }, (err, result) => {
      if (err) return res.status(500).send(err);
      return res.send(result);
    });
  }

};
