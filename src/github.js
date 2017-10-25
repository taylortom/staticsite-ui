var electronOauth2 = require('electron-oauth2');
var appdata = require("./data/appdata")();

// TODO should support paging
function request(url, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  var apiPrefix = 'https://api.github.com/';
  if(url.indexOf(apiPrefix) === -1) {
    url = apiPrefix + url;
  }
  $.ajax(Object.assign(opts, {
    url: url,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + appdata.get('authToken')
    }
  })).fail(function(error) {
    cb(error);
  }).done(function(data, textStatus, jqXHR) {
    cb(null, data, textStatus, jqXHR);
  });
}

var exports = module.exports = {
  authenticate: function(done) {
    var token = appdata.get('authToken');
    if(token) {
      return done(null, token);
    }
    var githubOauth = electronOauth2({
        clientId: '54c145107f8456d5e002',
        clientSecret: '5c15dcf27d38a2e6deb76309b3f769e8fde62df1',
        authorizationUrl: 'http://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        useBasicAuthorizationHeader: false,
        redirectUri: 'http://localhost'
    }, {
      alwaysOnTop: true,
      frame: false,
      width: 400,
      height: 750,
      webPreferences: { nodeIntegration: false }
    });
    githubOauth.getAccessToken({}).then(function(tokenData) {
      appdata.set('authToken', tokenData.access_token);
      exports.getUser(function(error, userData) {
        if(error) {
          return console.error(error);
        }
        appdata.set('authUser', userData);
      });
      done(null, tokenData.access_token);
    }).catch(function(error) {
      done(error);
    });
  },

  getUser: function(cb) {
    var user = appdata.get('authUser');
    if(user) {
      return cb(null, user);
    }
    request('user', cb);
  },

  getRepos: function(cb) {
    function _getRepoPage(url) {
      request(url, function(error, data, textStatus, jqXHR) {
        if(error) {
          return cb(error);
        }
        repos.push(...data);
        var linkHead = jqXHR.getResponseHeader('Link');
        var match = linkHead.match(RegExp('<(.+?)>; rel="(.+?)"'));
        if(match[2] !== 'next') {
          return cb(null, repos);
        }
        _getRepoPage(match[1]);
      });
    }
    var repos = [];
    _getRepoPage('user/repos');
  }
};
