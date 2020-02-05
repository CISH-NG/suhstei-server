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
const BOOKDIR = './public/books';
// const DIR = './public/profile-img';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BOOKDIR);
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const fileName = file.fieldname.toLowerCase().split(' ').join('-');
    cb(null, fileName + '-' + Date.now() + '.' + extension)
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
let User = require('../models/book');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/user/:id', auth, ctrlProfile.profileRead);
router.put('/update', ctrlProfile.upload.single('avatar'), auth, ctrlProfile.profileUpdate);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// POST User
router.post('/create-new-book', upload.single('avatar'), auth, (req, res, next) => {
  console.log(req.file);
  console.log(req.payload);

  const url = req.protocol + '://' + req.get('host')
  console.log(url);
  res.setHeader('Content-Type', 'application/json');
  // enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    avatar: `${url}/public/books/${req.file.filename}`,
    title: req.body.title,
    author: req.body.author,
    description: req.body.review,
    uploader_id: req.payload._id,
    uploader_name: req.payload.name, // User Avatar revisit
    createdAt: Date.now(),
    updatedAt: Date.now()
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

router.post('/update-book/:id', upload.single('avatar'), auth, (req, res, next) => {
  console.log(req.file);

  const url = req.protocol + '://' + req.get('host')
  console.log(url);
  res.setHeader('Content-Type', 'application/json');
  // enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');


  const formInput = { title: req.body.title,
    author: req.body.author,
    description: req.body.review,
    updatedAt: Date.now()
  };

  if (!!req.file) {
    formInput.avatar = `${url}/public/books/${req.file.filename}`;
  }

  console.log(formInput);

  Book.findByIdAndUpdate({
      _id: req.params.id
    }, formInput, {
      new: true
    }, (err, result) => {
      if (err) return res.status(500).send(err);
      return res.send(result);
    });
})


// GET All User
router.get("/", (req, res, next) => {
  Book.find()
    .then(data => {
      res.status(200).json({
        message: "Books retrieved successfully!",
        books: data
      });
    })
    .catch(err => next(err));
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id)

  Book.findById(req.params.id)
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: "Book not found!"
        });
      }
    })
    .catch(err => next(err));
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


module.exports = router;
