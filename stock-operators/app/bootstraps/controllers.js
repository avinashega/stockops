var fs = require('fs'),
express = require('express');

/**
 *
 * @param {express} parent
 */
module.exports = function (parent, acl) {
    var controllersDir = __dirname + '/../controllers/';
    fs.readdirSync(controllersDir).forEach(function (file) {
        var controller = require(controllersDir + file);
        controller.routes(parent, acl);
    });
};