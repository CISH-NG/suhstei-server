const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let requestSchema = new Schema({
  request_time: {
    type: Date
  },
  approved: {
    type: Boolean
  },
  requester: {
    type: Object
  },
  book_requested: {
    type: Object
  },
}, {
  collection: 'requests'
})

module.exports = mongoose.model('Request', requestSchema)
