const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let bookSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  avatar: {
    type: String
  },
  imageId: {
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
  uploader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  uploader_name: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
}, {
  collection: 'books'
})

module.exports = mongoose.model('Book', bookSchema)
