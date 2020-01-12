const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let bookSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  avatar: {
    type: String
  },
  title: {
    type: String
  },
  author: {
    type: String
  },
  description: {
    type: String
  },
}, {
  collection: 'books'
})

module.exports = mongoose.model('Book', bookSchema)
