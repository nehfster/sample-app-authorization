const express = require('express');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', passport.authenticate('oauth2', {
  responseType: 'code',
  scope: 'openid profile offline_access'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.get('/refresh', function(req, res, next) {
  if (req.user.rt) {
    refresh.requestNewAccessToken('oauth2', req.user.rt, function(err, accessToken, refreshToken) {
      req.user.at = accessToken;
      req.user.rt = refreshToken || req.user.rt;
      res.redirect("/user");    
    });    
  } else {
    res.redirect("/user");    
  }
});

router.get('/callback',
  passport.authenticate('oauth2', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;
