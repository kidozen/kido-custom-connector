"use strict";
var expect = require("chai").expect;
var assert = require("assert");
var Connector = require("../index.js");

var DEFAULT_CONFIG = {maxSize: 20};

describe("validation", function () {

    it("should fail without initial configuration", function (done) {

        expectException(function () {
            new Connector();
        }, Error, "'config' object is missing.");
        done();

        //expect(function () {new Connector()}).to.throw(Error, "'config' object is missing");
    });

    it("should fail when maxSize is not a number", function (done) {

        expectException(function () {
            new Connector({maxSize: "notANumber"});
        }, Error, "configuration.maxSize must be a positive number.");
        done();
    });

    it("should fail when maxSize is a negative number", function (done) {

        expectException(function () {
            new Connector({maxSize: -1});
        }, Error, "configuration.maxSize must be a positive number.");
        done();
    });
});

describe("push", function () {

    it("should push successfully", function (done) {
        var connector = new Connector(DEFAULT_CONFIG);
        connector.push({
            data: "hi"
        }, function (err, res) {
            assertPushWasOk(err, res, 1);
            done();
        });
    });

    it("should fail when no parameters are passed in", function (done) {
        var connector = new Connector(DEFAULT_CONFIG);
        connector.push(null, function (error, data) {
            expect(data).not.to.be.ok;
            expect(error).to.be.ok;
            expect(error).to.be.instanceof(Error);
            assert.equal(error.message, "'options' is missing.");
            done();
        });
    });

    it("should fail when attempting to push in already full stack", function (done) {
        var connector = new Connector({maxSize: 1});

        connector.push({ data: "hi" }, function (err, res) {
            assertPushWasOk(err, res, 1);
        });

        connector.push({data: "i'm gonna bounce"}, function (error, data) {
            expect(data).not.to.be.ok;
            expect(error).to.be.ok;
            expect(error).to.be.instanceof(Error);
            assert.equal(error.message, "The max size of the stack (1) was reached.");
            done();
        });
    });
});

describe("pop", function () {

    it("should pop successfully", function (done) {
        var connector = new Connector(DEFAULT_CONFIG);

        var pushedMessage = "hello";

        connector.push({
            data: pushedMessage
        }, function (err, res) {
            assertPushWasOk(err, res, 1);
        });

        connector.pop({}, function (err, res) {
            assertPopWasOk(err, res, pushedMessage);
            done();
        });
    });

    it("should fail when attempting to pop from an empty stack", function (done) {
        var connector = new Connector(DEFAULT_CONFIG);

        connector.pop({}, function (error, data) {
            expect(data).not.to.be.ok;
            expect(error).to.be.ok;
            expect(error).to.be.instanceof(Error);
            assert.equal(error.message, "The stack is empty.");
            done();
        });
    });
});

function assertPushWasOk(err, res, expectedStackSize) {
    expect(err).to.be.not.ok;
    expect(res).to.be.ok;
    expect(res).to.be.a('number');
    expect(res).to.equal(expectedStackSize);
}

function assertPopWasOk(err, res, expectedPoppedElement) {
    expect(err).to.be.not.ok;
    expect(res).to.be.ok;
    expect(res).to.be.a('string');
    expect(res).to.equal(expectedPoppedElement);
}

function expectException(fn, expectedType, expectedMessage) {
    try {
        fn();
    } catch (e) {
        expect(e).to.be.ok;
        expect(e).to.be.instanceof(expectedType);
        assert.equal(e.message, expectedMessage);
    }
}