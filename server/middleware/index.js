// Ensures a user is logged in. If not, redirects to login page.
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Ensures a user is logged out. If they are logged in, redirects to boards page.
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/boards');
  }
  return next();
};

// Ensures information is served over a secure connection
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// Does not require a secure connection if in a development environment.
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
