"use strict";
exports.__esModule = true;
exports["default"] = (function () {
    // Copied from @projectstorm/react-canvas-core/src/Toolkit.ts how to import instead?
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
});
