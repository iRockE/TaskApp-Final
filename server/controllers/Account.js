const models = require('../models');

const Account = models.Account;

// Renders the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Logs the user out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Logs the user in as long as all fields are provided and correct
const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/boards' });
  });
};

// Registers a new user into the system as long as all fields are provided and correct
const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/boards' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// Changes the password of the user as long as all fields are provided and correct
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  return Account.AccountModel.
    authenticate(req.session.account.username, req.body.oldPass, (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Wrong old password' });
      }
      return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => Account.AccountModel.
        findByIdAndUpdate(req.session.account._id, { salt, password: hash }, (err2) => {
          if (err2) {
            return res.status(401).json({ error: 'Password could not be changed.' });
          }
          return res.json({ redirect: '/logout' });
        }));
    });
};

// Renders the account page
const accountPage = (req, res) => res.render('account', { csrfToken: req.csrfToken() });

// Renders the premium page
const premiumPage = (req, res) => res.render('premium', { csrfToken: req.csrfToken() });

// Gets the CSRF token out of the request
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.accountPage = accountPage;
module.exports.premiumPage = premiumPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
