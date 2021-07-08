"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ServerNode_1 = require("../ServerNode");
var NodeParameter_1 = require("../../NodeParameter");
var Feature_1 = require("../../Feature");
var placeholder = "// PER FEATURE mode gives you access to variables: previous, current and next, ie\n// previous.get('some_property')\n// current.set('some_property', 123)\n\n// GLOBAL mode gives full control\n// use this.input() and this.output()\n";
var Evaluate = /** @class */ (function (_super) {
    __extends(Evaluate, _super);
    function Evaluate(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, __assign({ 
            // Defaults
            name: 'Evaluate', summary: 'Evaluate javascript', category: 'Workflow', defaultInPorts: ['Input'], defaultOutPorts: ['Output'] }, options)) || this;
    }
    Evaluate.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getParameterValue('evaluation_context') == 'per_feature'
                        ? this.runPerFeature()
                        : this.runGlobal()];
            });
        });
    };
    Evaluate.prototype.runPerFeature = function () {
        var _this = this;
        var inputs = this.input(); // maintain state - no additional feature clones
        this.output(inputs.map(function (current, index) {
            var _a, _b;
            // previous and next have 'null' features as fallback
            var previous = (_a = inputs[index - 1]) !== null && _a !== void 0 ? _a : new Feature_1.Feature();
            var next = (_b = inputs[index + 1]) !== null && _b !== void 0 ? _b : new Feature_1.Feature();
            eval(_this.getExpression());
            return current;
        }));
    };
    Evaluate.prototype.runGlobal = function () {
        eval(this.getExpression());
    };
    Evaluate.prototype.getExpression = function () {
        return this.getParameterValue('expression');
    };
    Evaluate.prototype.getParameters = function () {
        return __spreadArrays(_super.prototype.getParameters.call(this), [
            NodeParameter_1["default"].select('evaluation_context')
                .withOptions(['per_feature', 'global'])
                .withValue('per_feature'),
            NodeParameter_1["default"].js('expression')
                .withDescription("javascript code to execute")
                .withValue(placeholder)
        ]);
    };
    return Evaluate;
}(ServerNode_1["default"]));
exports["default"] = Evaluate;
