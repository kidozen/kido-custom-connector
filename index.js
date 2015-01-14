var winston     = require("winston");
var connector   = require("./index");

connector.init("sample", winston);

module.exports.Sample = function (config) {

    var createSession = function (credential, cb) {
        // Here you must authenticate the user and return a new session for the user.
        // and optionally its expiration time.

        // If an error ocurred you have to return it
        //   cb(new Error( ...));

        // If authentication was succesfully, you have to return a new session
        //   cb(null, session) 
        // or
        //   cb(null, session, expiresOn) 
    };

    var disposeSession = function (session, cb) {
        // Here you hace to dispose any resource and invoke cb.
    };


    var refreshSession = function (session, cb) {
        // Here you have to create a new session to replace the one passed by argument

        // If an error ocurred you have to return it
        //   cb(new Error( ...));

        // If you was able to create a new session, you have to return it
        //   cb(null, newSession) 
        // or
        //   cb(null, newSession, expiresOn) 
    };

    var config = {
        // any config valu required by the connector
    };

    var _connector = new connector.Connector({
        config: { /* any config valu required by the connector */ },
        credentialProps: [ "username", "password" ],
        createSessionCb: createSession,
        disposeSessionCb: disposeSession,
        refreshSessionCb: refreshSession
    });

    // The authenticate method of your connector will be:
    this.authenticate = function (options, cb) {
        //get session
        _connector.getSession(options, function (err, session, auth) {
            if (err) return cb(err);
            cb( { auth: auth });
        });
    };

    // A secured method
    this.mySecuredMethod = function (options, cb) {
        // Get session
        _connector.getSession(options, function (err, session, auth) {
            if (err) return cb(err);

            // Implement your method here and use the session 
        });
    };

    // Close and release all sessions.
    this.close = function(cb) {
        _connector.close(cb);
    };
};