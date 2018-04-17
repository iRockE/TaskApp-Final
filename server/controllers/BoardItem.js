const models = require('../models');

const BoardItem = models.BoardItem;
const Board = models.Board;
const Account = models.Account;

// Renders the board page
const boardPage = (req, res) => Account.AccountModel.
    findById(req.session.account._id, 'lastBoard', (err, doc) => {
      if (err || !doc.lastBoard) {
        return res.status(401).json({ error: 'Board not found' });
      }
      return Board.BoardModel.findById(doc.lastBoard, (err2, doc2) => {
        if (err2 || !doc2) {
          return res.status(401).json({ error: 'Board not found' });
        }
        return res.render('board', { csrfToken: req.csrfToken() });
      });
    });

// Ensures that a board was clicked and redirects to that board's page
const loadBoard = (req, res) => {
  if (!`${req.body.boardID}`) {
    return res.status(401).json({ error: 'Board not found' });
  }
  return Account.AccountModel.
    findByIdAndUpdate(req.session.account._id, { lastBoard: `${req.body.boardID}` }, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Board not found' });
      }
      return res.json({ redirect: '/board' });
    });
};

// Deletes an item from the current board
const deleteBoardItem = (req, res) => {
  if (!req.body.itemID) {
    return res.status(400).json({ error: 'Missing item ID' });
  }
  return BoardItem.BoardItemModel.remove({ _id: req.body.itemID }, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ redirect: '/board' });
  });
};

// Returns all items for the current baord
const getBoardItems = (req, res) => {
  Account.AccountModel.findById(req.session.account._id, 'lastBoard', (err, docs) => {
    if (err || !docs.lastBoard) {
      return res.status(401).json({ error: 'Board not found' });
    }
    return BoardItem.BoardItemModel.findByBoard(docs.lastBoard, (err2, docs2) => {
      if (err2) {
        console.log(err2);
        return res.status(400).
          json({ error: 'An error occurred. Board Item could not be loaded.' });
      }
      return res.json({ boardItems: docs2 });
    });
  });
};

// Creates an item for the current board
const makeBoardItem = (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ error: 'Name and description required' });
  }
  return Account.AccountModel.
    findById(req.session.account._id, 'lastBoard', (err, doc) => {
      if (err || !doc.lastBoard) {
        return res.status(401).json({ error: 'Board not found' });
      }
      const boardItemData = {
        name: req.body.name,
        description: req.body.description,
        board: doc.lastBoard,
      };
      const newBoardItem = new BoardItem.BoardItemModel(boardItemData);

      const boardItemPromise = newBoardItem.save();

      boardItemPromise.then(() => res.json({ redirect: '/board' }));

      boardItemPromise.catch(() => res.status(400).json({ error: 'An error occurred' }));
      return boardItemPromise;
    });
};

// Changes the status of the given board item to the given status
const changeStatus = (req, res) => {
  if (!`${req.body.itemID}` || !`${req.body.status}`) {
    return res.status(400).json({ error: 'Missing item or status' });
  }
  return BoardItem.BoardItemModel.
    findByIdAndUpdate(`${req.body.itemID}`, { status: `${req.body.status}` }, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Status could not be updated' });
      }
      return res.json({ redirect: '/board' });
    });
};

module.exports.boardPage = boardPage;
module.exports.load = loadBoard;
module.exports.getBoardItems = getBoardItems;
module.exports.make = makeBoardItem;
module.exports.delete = deleteBoardItem;
module.exports.changeStatus = changeStatus;
