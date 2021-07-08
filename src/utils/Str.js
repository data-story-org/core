"use strict";
exports.__esModule = true;
exports.trim = void 0;
exports.trim = function (s, c) {
    if (c === "]")
        c = "\\]";
    if (c === "^")
        c = "\\^";
    if (c === "\\")
        c = "\\\\";
    return s.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
};
