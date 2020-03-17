const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let requestSchema = new Schema({
  request_time: {
    type: Date
  },
  request_viewed: {
    type: Boolean
  },
  approved: {
    type: Boolean
  },
  disapproved: {
    type: Boolean
  },
  returned: {
    type: Boolean
  },
  // Todo - Point to users collection
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
