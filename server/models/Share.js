const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let ShareModel = {};

// Represents a sharing of a board.
const ShareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  board: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Board',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ShareSchema.index({ user: 1, board: 1 }, { unique: true });

ShareModel = mongoose.model('Share', ShareSchema);

module.exports.ShareModel = ShareModel;
module.exports.ShareSchema = ShareSchema;
