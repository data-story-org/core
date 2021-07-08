"use strict";
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
exports.__esModule = true;
var Aggregate_1 = require("./nodes/Aggregate");
var Clone_1 = require("./nodes/Clone_");
var Comment_1 = require("./nodes/Comment");
var Create_1 = require("./nodes/Create");
var CreateGrid_1 = require("./nodes/CreateGrid");
var CreateAttribute_1 = require("./nodes/CreateAttribute");
var CreateCSV_1 = require("./nodes/CreateCSV");
var CreateJSON_1 = require("./nodes/CreateJSON");
var CreateSequence_1 = require("./nodes/CreateSequence");
// import DownloadCSV from './nodes/DownloadCSV'
// import DownloadJSON from './nodes/DownloadJSON'
// import DownloadGeoJSON from './nodes/DownloadGeoJSON'
var Evaluate_1 = require("./nodes/Evaluate");
var FilterDuplicates_1 = require("./nodes/FilterDuplicates");
var Flatten_1 = require("./nodes/Flatten");
var Group_1 = require("./nodes/Group");
// import HTTPRequest from './nodes/HTTPRequest'
var Inspect_1 = require("./nodes/Inspect");
var Log_1 = require("./nodes/Log");
var Map_1 = require("./nodes/Map");
var OutputProvider_1 = require("./nodes/OutputProvider");
var RegExpFilter_1 = require("./nodes/RegExpFilter");
// import DeleteRepositories from './nodes/github/DeleteRepositories'
// import Repositories from './nodes/github/Repositories'
var Sample_1 = require("./nodes/Sample");
var Sort_1 = require("./nodes/Sort");
var Sleep_1 = require("./nodes/Sleep");
var ThrowError_1 = require("./nodes/ThrowError");
var ServerNodeFactory = /** @class */ (function () {
    function ServerNodeFactory() {
    }
    ServerNodeFactory.find = function (type) {
        return this.nodes[type];
    };
    ServerNodeFactory.all = function () {
        return Object.values(this.nodes);
    };
    ServerNodeFactory.make = function (type) {
        return new (this.find(type));
    };
    ServerNodeFactory.hydrate = function (node, diagram) {
        if (diagram === void 0) { diagram = null; }
        var type = this.find(node.serverNodeType);
        return new type(__assign(__assign({}, node), { diagram: diagram }));
    };
    ServerNodeFactory.nodes = {
        Aggregate: Aggregate_1["default"],
        Clone_: Clone_1["default"],
        Comment: Comment_1["default"],
        Create: Create_1["default"],
        CreateAttribute: CreateAttribute_1["default"],
        CreateCSV: CreateCSV_1["default"],
        CreateGrid: CreateGrid_1["default"],
        CreateJSON: CreateJSON_1["default"],
        CreateSequence: CreateSequence_1["default"],
        // DeleteRepositories,
        // DownloadCSV,
        // DownloadJSON,
        // DownloadGeoJSON,
        Evaluate: Evaluate_1["default"],
        FilterDuplicates: FilterDuplicates_1["default"],
        Flatten: Flatten_1["default"],
        Group: Group_1["default"],
        // HTTPRequest,
        Inspect: Inspect_1["default"],
        Log: Log_1["default"],
        Map: Map_1["default"],
        OutputProvider: OutputProvider_1["default"],
        RegExpFilter: RegExpFilter_1["default"],
        // Repositories,
        Sample: Sample_1["default"],
        Sleep: Sleep_1["default"],
        Sort: Sort_1["default"],
        ThrowError: ThrowError_1["default"]
    };
    return ServerNodeFactory;
}());
exports["default"] = ServerNodeFactory;
