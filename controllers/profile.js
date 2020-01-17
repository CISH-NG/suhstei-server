let mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};

module.exports.profileUpdate = function(req, res) {
  console.log(req.body);

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User.findByIdAndUpdate({_id: req.payload._id}, {...req.body}, {new: true}, (err, result) => {
      if (err) return res.status(500).send(err);
      return res.send(result);
    });
  }

};
