const mongoose = require('mongoose');

// pin schema
const PinSchema = new mongoose.Schema({
  author: {
    // related to users from another collection
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  image: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentAuthor: {
      // related to users from another collection
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    commentDate: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

// pin model
const Pin = mongoose.model('pins', PinSchema);
module.exports = Pin;
