const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');
let BoardModel = {};

// mongoose.Types.ObjetcID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

// Represents a task board.
const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// Finds all boards for the given user
BoardSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BoardModel.find(search).select('name').exec(callback);
};

BoardModel = mongoose.model('Board', BoardSchema);

module.exports.BoardModel = BoardModel;
module.exports.BoardSchema = BoardSchema;
