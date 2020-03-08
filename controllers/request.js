let mongoose = require('mongoose'),
  multer = require('multer'),
  tinified = require("tinify");
// Request = mongoose.model('Request');

// Request model
let Request = require('../models/request');


module.exports.requestCreate = function (req, res) {

  if (!req.payload._id) {

    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });

  } else if (!!req.payload._id) {

    const request = new Request({
      request_time: Date.now(),
      approved: false,
      requester: req.body.requester,
      book_requested: req.body.book,
    });

    request.save().then(result => {
      // console.log(result);
      res.status(201).json({
        message: "Request registered successfully!",
        bookCreated: result
      })
    }).catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    });

  }

};


module.exports.getRequest = function (req, res) {


  if (!req.payload._id) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else if (!!req.params.id) {
    Request
      .findById(req.params.id)
      .then(request => {
        res.status(200).json(request);
      })
      .catch(err => next(err));
  } else {
    Request
      .find()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => next(err));
  }
}
