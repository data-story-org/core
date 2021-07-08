"use strict";
exports.__esModule = true;
exports.pickBy = exports.get = void 0;
exports.get = function (object, path) {
    if (path === void 0) { path = ''; }
    var steps = path ? path.split('.') : [];
    return steps.reduce(function (traversed, part) {
        var _a;
        if (typeof traversed !== 'object' || traversed === null)
            return null;
        return (_a = traversed[part]) !== null && _a !== void 0 ? _a : null;
    }, object);
};
exports.pickBy = function (object, picker) {
    var result = {};
    for (var _i = 0, _a = Object.entries(object); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (picker(value, key)) {
            result[key] = value;
        }
    }
    return result;
};
