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
var Feature_1 = require("../../Feature");
var ServerNode_1 = require("../ServerNode");
var NodeParameter_1 = require("../../NodeParameter");
var CreateGrid = /** @class */ (function (_super) {
    __extends(CreateGrid, _super);
    function CreateGrid(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, __assign({ 
            // Defaults
            name: 'CreateGrid', summary: 'Create a set of objects with coordinates x and y', category: 'Reader', defaultInPorts: [], defaultOutPorts: ['Output'] }, options)) || this;
    }
    CreateGrid.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var type, gridMinX, gridMinY, gridMaxX, gridMaxY, gridSizeX, gridSizeY, gridSpacingX, gridSpacingY, features, x, y, point;
            return __generator(this, function (_a) {
                type = this.getParameterValue('grid_type');
                gridMinX = parseFloat(this.getParameterValue('grid_min_x'));
                gridMinY = parseFloat(this.getParameterValue('grid_min_y'));
                gridMaxX = parseFloat(this.getParameterValue('grid_max_x'));
                gridMaxY = parseFloat(this.getParameterValue('grid_max_y'));
                gridSizeX = parseInt(this.getParameterValue('grid_size_x'));
                gridSizeY = parseInt(this.getParameterValue('grid_size_y'));
                gridSpacingX = parseFloat(this.getParameterValue('grid_spacing_x'));
                gridSpacingY = parseFloat(this.getParameterValue('grid_spacing_y'));
                if (gridMaxX && gridMaxY) {
                    gridSizeX = Math.ceil((gridMaxX - gridMinX) / gridSpacingX);
                    gridSizeY = Math.ceil((gridMaxY - gridMinY) / gridSpacingY);
                }
                features = [];
                for (x = 0; x < gridSizeX; x++) {
                    for (y = 0; y < gridSizeY; y++) {
                        point = {
                            x: gridMinX + x * gridSpacingX,
                            y: gridMinY + y * gridSpacingY
                        };
                        if (type == 'points') {
                            features.push(new Feature_1.Feature(point));
                        }
                        if (type == 'boxes') {
                            features.push(new Feature_1.Feature({
                                x_min: point.x,
                                y_min: point.y,
                                x_max: point.x + gridSpacingX,
                                y_max: point.y + gridSpacingY
                            }));
                        }
                    }
                }
                this.output(features);
                return [2 /*return*/];
            });
        });
    };
    CreateGrid.prototype.getParameters = function () {
        return __spreadArrays(_super.prototype.getParameters.call(this), [
            NodeParameter_1["default"].select('grid_type').withOptions(['points', 'boxes']).withValue('points'),
            NodeParameter_1["default"].number('grid_min_x').withValue(0),
            NodeParameter_1["default"].number('grid_min_y').withValue(0),
            NodeParameter_1["default"].number('grid_max_x').withValue(10),
            NodeParameter_1["default"].number('grid_max_y').withValue(10),
            NodeParameter_1["default"].number('grid_size_x').withDescription('Ignored if grid_max_x is set'),
            NodeParameter_1["default"].number('grid_size_y').withDescription('Ignored if grid_max_y is set'),
            NodeParameter_1["default"].number('grid_spacing_x').withValue(1),
            NodeParameter_1["default"].number('grid_spacing_y').withValue(1),
        ]);
    };
    return CreateGrid;
}(ServerNode_1["default"]));
exports["default"] = CreateGrid;
