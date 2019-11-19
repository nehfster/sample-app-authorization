const express = require('express');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const rp = require('request-promise');
// const process = require('process');
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
  if(process.env.OAUTH2_REVOKE_URL){
    logout(req,res);
  }
  else{
    res.redirect('/');
  }
});


router.get('/refresh', function(req, res, next) {
  if (req.user.rt) {
    refresh.requestNewAccessToken('oauth2', req.user.rt, function(err, accessToken, refreshToken, results) {
      req.user.at = accessToken;
      req.user.rt = refreshToken || req.user.rt;
      req.user.idToken = results.idToken;
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


function logout(req, res) {
  const options = {
    method: 'POST',
    uri: process.env.OAUTH2_REVOKE_URL,
    form: {
      // Like <input type="text" name="name">
      // name: 'Josh'
      client_id: process.env.OAUTH2_CLIENT_ID,
      client_secret: process.env.OAUTH2_CLIENT_SECRET,
      token: req.user.rt
    },
    headers: {
      /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
    }
  };

  rp(options)
      .then(function (body) {
        req.logout();
        res.redirect('/');
      })
      .catch(function (err) {
        res.redirect('/failure')
      });
}

module.exports = router;
