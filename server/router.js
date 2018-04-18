const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/boards', mid.requiresLogin, controllers.Board.makerPage);
  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  app.get('/getUsername', mid.requiresLogin, controllers.Account.getUsername);
  app.get('/premium', mid.requiresLogin, controllers.Account.premiumPage);
  app.post('/boards', mid.requiresLogin, controllers.Board.make);
  app.post('/deleteBoard', mid.requiresLogin, controllers.Board.delete);
  app.get('/board', mid.requiresLogin, controllers.BoardItem.boardPage);
  app.post('/board', mid.requiresLogin, controllers.BoardItem.make);
  app.post('/loadBoard', mid.requiresLogin, controllers.BoardItem.load);
  app.get('/getBoardItems', mid.requiresLogin, controllers.BoardItem.getBoardItems);
  app.post('/deleteBoardItem', mid.requiresLogin, controllers.BoardItem.delete);
  app.post('/changeStatus', mid.requiresLogin, controllers.BoardItem.changeStatus);
  app.post('/friends', mid.requiresLogin, controllers.Friends.addFriend);
  app.get('/friends', mid.requiresLogin, controllers.Friends.friendsPage);
  app.get('/getFriends', mid.requiresLogin, controllers.Friends.getFriends);
  app.post('/removeFriend', mid.requiresLogin, controllers.Friends.removeFriend);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', mid.requiresLogin, mid.requiresLogout);
};

module.exports = router;
