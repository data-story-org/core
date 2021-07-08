"use strict";
exports.__esModule = true;
exports.Feature = void 0;
var Obj_1 = require("./utils/Obj");
var Feature = /** @class */ (function () {
    function Feature(original) {
        if (original === void 0) { original = null; }
        this.original = original;
    }
    Feature.prototype.get = function (property) {
        return Obj_1.get(this.original, property);
    };
    Feature.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 2) {
            this.original[args[0]] = args[1];
        }
        if (args.length === 1) {
            this.original = args[0];
        }
        return this;
    };
    Feature.prototype.type = function () {
        return typeof this.original;
    };
    Feature.prototype.unbox = function () {
        if (this.type() == 'object') {
            return this.original;
        }
        return this.original;
    };
    return Feature;
}());
exports.Feature = Feature;
