const models = require('../models');

const Account = models.Account;
const Board = models.Board;
const Share = models.Share;

// Renders the boards page
const friendsPage = (req, res) => res.render('friends', { csrfToken: req.csrfToken() });

// Adds a new friend from form input
const addFriend = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Username required' });
  }
  return Account.AccountModel.findByUsername(req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    if (!docs) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (req.body.name === req.session.account.username) {
      return res.status(404).json({ error: 'Cannot add yourself' });
    }
    return Account.AccountModel.findByIdAndUpdate(
      req.session.account._id,
      { $addToSet: { friends: docs._id } },
      { safe: true, upsert: true, new: true },
      (err2, docs2) => {
        if (err2 || !docs2) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }
        return res.json({ redirect: '/friends' });
      });
  });
};

// removes a friend with the provided id
const removeFriend = (req, res) => {
  if (!req.body.friendID) {
    return res.status(400).json({ error: 'Missing board ID' });
  }
  return Account.AccountModel.findByIdAndUpdate(
    req.session.account._id,
    { $pull: { friends: req.body.friendID } },
    (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return Board.BoardModel.findByOwner(req.session.account._id, (err2, boards) => {
        if (err2) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }
        return Share.ShareModel.remove({ board: { $in: boards.map(x => x._id) },
          user: req.body.friendID }, (err3) => {
          if (err3) {
            console.log(err3);
            return res.status(400).json({ error: 'An error occurred' });
          }
          return res.json({ redirect: '/friends' });
        });
      });
    });
};

// gets all of the friends for the current user
const getFriends = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findById(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Account.AccountModel.find({ _id: { $in: docs.friends } }, 'username', (err2, docs2) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ friends: docs2 });
    });
  });
};

module.exports.addFriend = addFriend;
module.exports.friendsPage = friendsPage;
module.exports.getFriends = getFriends;
module.exports.removeFriend = removeFriend;
