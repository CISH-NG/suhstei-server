let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');


// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});


// Multer Mime Type Validation
var upload = multer({
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


// User model
let Book = require('../models/book');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.put('/update', auth, ctrlProfile.profileUpdate);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// POST User
router.post('/create-new-book', upload.single('avatar'), (req, res, next) => {
  console.log(req.body);

  const url = req.protocol + '://' + req.get('host')
  console.log(url);
  res.setHeader('Content-Type', 'application/json');
  // enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    avatar: url + '/public/' + req.file.filename,
    title: req.body.title,
    author: req.body.author,
    description: req.body.review
  });
  book.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Book registered successfully!",
      bookCreated: {
        _id: result._id,
        avatar: result.avatar,
        title: result.title,
        author: result.author,
        description: result.description,
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})


// GET All User
router.get("/", (req, res, next) => {
  Book.find().then(data => {
    res.status(200).json({
      message: "Books retrieved successfully!",
      books: data
    });
  });
});

router.post('/login', function (req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  var auth = passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.sendStatus(403);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.send({
        success: true,
        user: user
      });
    })
  })
  auth(req, res, next);
});


// GET User
// router.get("/:id", (req, res, next) => {
//   User.findById(req.params.id).then(data => {
//     if (data) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({
//         message: "User not found!"
//       });
//     }
//   });
// });


module.exports = router;
