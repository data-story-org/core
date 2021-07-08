"use strict";
var _a;
exports.__esModule = true;
var ServerDiagram_1 = require("../server/ServerDiagram");
var ServerNodeFactory_1 = require("../server/ServerNodeFactory");
var type = process.argv[2];
var args = process.argv.slice(3);
var boot = function () {
    return {
        data: {
            stories: [],
            availableNodes: ServerNodeFactory_1["default"].all().map(function (node) { return (new node()).serialize(); })
        }
    };
};
var help = function () {
    return 'Please use syntax:\n\n    node data-story.js <ACTION> <DATA>\n\navailable actions [boot, help, run]';
};
var run = function (serializedDiagram) {
    return ServerDiagram_1["default"].hydrate(serializedDiagram, ServerNodeFactory_1["default"]).run();
};
var handlers = { boot: boot, help: help, run: run };
var handler = (_a = handlers[type]) !== null && _a !== void 0 ? _a : help;
console.info(handler.apply(void 0, args));
