const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');
let BoardItemModel = {};

// mongoose.Types.ObjetcID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

// Represents an item on a task board.
const BoardItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['toDo', 'inProgress', 'complete'],
    default: 'toDo',
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

// Finds all items for the given board
BoardItemSchema.statics.findByBoard = (boardId, callback) => {
  const search = {
    board: convertId(boardId),
  };

  return BoardItemModel.find(search).select('name description status').exec(callback);
};

BoardItemModel = mongoose.model('BoardItem', BoardItemSchema);

module.exports.BoardItemModel = BoardItemModel;
module.exports.BoardItemSchema = BoardItemSchema;
