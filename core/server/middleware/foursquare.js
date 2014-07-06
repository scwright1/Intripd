(function() {
  config = require('../config')();
  var handleRes, querystring, request;

  request = require('request');

  querystring = require('querystring');

  module.exports = function() {
    var credentials = {
      'v': config.apps.FOURSQUARE.v,
      'client_id': config.apps.FOURSQUARE.id,
      'client_secret': config.apps.FOURSQUARE.sec
    };
    return {
      getVenues: function(params, callback) {
        var urlString;
        urlString = "https://api.foursquare.com/v2/venues/search?" + querystring.stringify(params) + '&' + querystring.stringify(credentials);
        return request(urlString, function(error, response, body) {
          return handleRes(response, body, callback);
        });
      },
      getVenue: function(params, callback) {
        var urlString;
        urlString = "https://api.foursquare.com/v2/venues/" + params.venue_id + '?' + querystring.stringify(credentials);
        return request(urlString, function(error, response, body) {
          return handleRes(response, body, callback);
        });
      }
    };
  };

  handleRes = function(res, body, callback) {
    config.apps.FOURSQUARE.calls = res.headers['x-ratelimit-remaining'];
    if (res.statusCode >= 300) {
      return callback(body, null);
    } else {
      return callback(null, JSON.parse(body));
    }
  };

}).call(this);
