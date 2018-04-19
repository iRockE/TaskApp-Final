const models = require('../models');

const Account = models.Account;
const Board = models.Board;

// Renders the boards page
const sharePage = (req, res) => res.render('share', { csrfToken: req.csrfToken() });

// Share the current board with the given friend
const shareFriend = (req, res) => {
  if (!req.body.friendID) {
    return res.status(400).json({ error: 'Missing friend ID' });
  }
  return Account.AccountModel.findById(req.session.account._id, (err, accountDoc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Board.BoardModel.findByIdAndUpdate(
      accountDoc.lastBoard,
      { $addToSet: { shared: req.body.friendID } },
      { safe: true, upsert: true, new: true },
      (err2, boardDoc) => {
        if (err2 || !boardDoc) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }
        return res.json({ redirect: '/share' });
      });
  });
};

// Share the current board with the given friend
const unshareFriend = (req, res) => {
  if (!req.body.friendID) {
    return res.status(400).json({ error: 'Missing friend ID' });
  }
  return Account.AccountModel.findById(req.session.account._id, (err, accountDoc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Board.BoardModel.findByIdAndUpdate(
      accountDoc.lastBoard,
      { $pull: { shared: req.body.friendID } },
      (err2) => {
        if (err2) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }
        return res.json({ redirect: '/share' });
      });
  });
};

// gets all of the friends for the current user and
// sort by shared and unshared for the current board
const getSharedFriends = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.findById(req.session.account._id, (err, accountDoc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Board.BoardModel.findById(accountDoc.lastBoard, (err2, boardDoc) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return Account.AccountModel.find({ _id: { $in: accountDoc.friends } },
        'username', (err3, friends) => {
          if (err3) {
            console.log(err3);
            return res.status(400).json({ error: 'An error occurred' });
          }
          const sharedFriends = [];
          const unsharedFriends = [];
          friends.forEach(friend => {
            if (boardDoc.shared.some((sharedFriendId) => sharedFriendId.equals(friend._id))) {
              sharedFriends.push(friend);
            } else {
              unsharedFriends.push(friend);
            }
          });
          return res.json({ unsharedFriends, sharedFriends });
        });
    });
  });
};

module.exports.sharePage = sharePage;
module.exports.shareFriend = shareFriend;
module.exports.unshareFriend = unshareFriend;
module.exports.getSharedFriends = getSharedFriends;
