(function() {
  /*
  Test Setup
  */  var Init, Instagram, app, assert, completed, should, test, to_do;
  console.log("\nInstagram API Node.js Lib Tests :: Media");
  Init = require('./initialize');
  Instagram = Init.Instagram;
  app = Init.app;
  assert = require('assert');
  should = require('should');
  test = require('./helpers');
  completed = 0;
  to_do = 0;
  /*
  Tests
  */
  module.exports = {
    'media#popular': function() {
      return test.helper('media#popular', Instagram, 'media', 'popular', {}, function(data) {
        data.length.should.equal(32);
        test.output("data had length equal to 32");
        data[0].should.have.property('id');
        test.output("data[0] had the property 'id'", data[0].id);
        return app.finish_test();
      });
    },
    'media#info for id#3': function() {
      return test.helper('media#info for id#3', Instagram, 'media', 'info', {
        media_id: 3
      }, function(data) {
        data.should.have.property('id', '3');
        test.output("data had the property 'id' equal to 3");
        data.should.have.property('created_time', '1279315783');
        test.output("data had the property 'created_time' equal to 1279315783");
        return app.finish_test();
      });
    },
    'media#search for 48.858844300000001/2.2943506': function() {
      return test.helper('media#search for 48.858844300000001/2.2943506', Instagram, 'media', 'search', {
        lat: 48.858844300000001,
        lng: 2.2943506
      }, function(data) {
        data.length.should.be.above(0);
        test.output("data had length greater than 0", data.length);
        data[0].should.have.property('id');
        test.output("data[0] had the property 'id'", data[0].id);
        return app.finish_test();
      });
    },
    'media#like id#3': function() {
      return test.helper('media#like id#3', Instagram, 'media', 'like', {
        media_id: 3
      }, function(data) {
        if (data !== null) {
          throw "like failed";
        }
        test.output("data was null; we liked media #3");
        return test.helper('media#likes for id#3', Instagram, 'media', 'likes', {
          media_id: 3
        }, function(data) {
          data.length.should.be.above(0);
          test.output("data had length greater than 0", data.length);
          return test.helper('media#unlike id#3', Instagram, 'media', 'unlike', {
            media_id: 3
          }, function(data) {
            if (data !== null) {
              throw "unlike failed";
            }
            test.output("data was null; we unliked media #3");
            return app.finish_test();
          });
        });
      });
    },
    'media#comment id#53355234': function() {
      return test.helper('media#comment id#53355234', Instagram, 'media', 'comment', {
        media_id: 53355234,
        text: 'Instagame was here.'
      }, function(data) {
        var comment_id;
        data.should.have.property('id');
        test.output("data had the property 'id'", data.id);
        data.should.have.property('from');
        test.output("data had the property 'from'", data.from);
        data.should.have.property('created_time');
        test.output("data had the property 'created_time'", data.created_time);
        data.should.have.property('text');
        test.output("data had the property 'text'", data.text);
        comment_id = data['id'];
        test.output("created comment " + comment_id);
        return test.helper('media#comments for id#53355234', Instagram, 'media', 'comments', {
          media_id: 53355234
        }, function(data) {
          data.length.should.be.above(0);
          test.output("data had length greater than 0", data.length);
          return test.helper('media#uncomment id#53355234', Instagram, 'media', 'uncomment', {
            media_id: 53355234,
            comment_id: comment_id
          }, function(data) {
            if (data !== null) {
              throw "uncomment failed";
            }
            test.output("data was null; we deleted comment " + comment_id);
            return app.finish_test();
          });
        });
      });
    },
    'media#subscriptions': function() {
      return test.helper("media#subscriptions subscribe to geography near Eiffel Tower", Instagram, 'media', 'subscribe', {
        lat: 48.858844300000001,
        lng: 2.2943506,
        radius: 1000
      }, function(data) {
        var subscription_id;
        data.should.have.property('id');
        test.output("data had the property 'id'");
        data.id.should.be.above(0);
        test.output("data.id was greater than 0", data.id);
        data.should.have.property('type', 'subscription');
        test.output("data had the property 'type' equal to 'subscription'", data);
        subscription_id = data.id;
        return test.helper('media#subscriptions list', Instagram, 'subscriptions', 'list', {}, function(data) {
          var found, i;
          data.length.should.be.above(0);
          test.output("data had length greater than 0", data.length);
          found = false;
          for (i in data) {
            if (data[i].id === subscription_id) {
              found = true;
            }
          }
          if (!found) {
            throw "subscription not found";
          }
          test.output("data had the subscription " + subscription_id);
          return test.helper("media#subscriptions unsubscribe from media near Eiffel Tower", Instagram, 'media', 'unsubscribe', {
            id: subscription_id
          }, function(data) {
            if (data !== null) {
              throw "geography near Eiffel Tower unsubscribe failed";
            }
            test.output("data was null; we unsubscribed from the subscription " + subscription_id);
            return app.finish_test();
          });
        });
      });
    }
  };
  /*
  tested on Austin, Tx. { lat: 30.30, lng: -97.70, distance: 5000 }; weird, request with count 200 produces 54, request with count 50 produces 46, request with count 46 produces 42, request with count 42 produces 38... I think you see the pattern. :)
  
    'media#search for 30.30/-97.70 with count of 42': ->
      test.helper 'media#search for 30.30/-97.70 with count of 42', Instagram, 'media', 'search', { lat: 30.30, lng: -97.70, distance: 5000, count: 42 }, (data) ->
        data.length.should.equal 42
        test.output "data had length equal to 42", data.length
        app.finish_test()
  */
  app.start_tests(module.exports);
}).call(this);
