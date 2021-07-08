"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var _ = require("lodash");
var UID_1 = require("../utils/UID");
var NodeParameter_1 = require("../NodeParameter");
var ServerNode = /** @class */ (function () {
    function ServerNode(options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e;
        this.category = 'Custom';
        this.editableInPorts = false;
        this.editableOutPorts = false;
        this.key = 'test-key';
        this.nodeReact = 'Node';
        this.summary = 'No summary provided.';
        this.diagram = options.diagram;
        this.id = (_a = options.id) !== null && _a !== void 0 ? _a : UID_1["default"]();
        this.name = options.name,
            this.summary = options.summary,
            this.category = options.category,
            this.defaultInPorts = (_b = options.defaultInPorts) !== null && _b !== void 0 ? _b : ['Input'],
            this.defaultOutPorts = (_c = options.defaultOutPorts) !== null && _c !== void 0 ? _c : ['Output'],
            this.editableInPorts = (_d = options.editableInPorts) !== null && _d !== void 0 ? _d : false;
        this.editableOutPorts = (_e = options.editableOutPorts) !== null && _e !== void 0 ? _e : false;
        this.parameters = options.parameters ? options.parameters : [];
        this.ports = this.createPorts(options);
    }
    ServerNode.prototype.createPorts = function (options) {
        var _a;
        return (_a = options.ports) !== null && _a !== void 0 ? _a : __spreadArrays(this.getDefaultInPorts(), this.getDefaultOutPorts());
    };
    ServerNode.prototype.getDefaultInPorts = function () {
        return (this.defaultInPorts).map(function (name) {
            return {
                name: name,
                "in": true
            };
        });
    };
    ServerNode.prototype.getDefaultOutPorts = function () {
        return this.defaultOutPorts.map(function (name) {
            return {
                name: name,
                "in": false
            };
        });
    };
    ServerNode.prototype.serialize = function () {
        return {
            category: this.category,
            editableInPorts: this.editableInPorts,
            editableOutPorts: this.editableOutPorts,
            ports: this.ports,
            key: this.key,
            name: this.name,
            nodeReact: this.nodeReact,
            serverNodeType: this.name,
            parameters: this.getParameters(),
            summary: this.summary
        };
    };
    ServerNode.prototype.getParameters = function () {
        return [
            NodeParameter_1["default"].string('node_name').withValue(this.name)
        ];
    };
    ServerNode.prototype.getParameter = function (name) {
        return this.parameters.find(function (p) { return p.name == name; });
    };
    ServerNode.prototype.getParameterValue = function (name, feature) {
        if (feature === void 0) { feature = null; }
        var value = this.getParameter(name).value;
        if (!feature)
            return value;
        return this.interpretParameterValue(value, feature);
    };
    ServerNode.prototype.interpretParameterValue = function (parametric, feature) {
        var matches = parametric.match(/\{\{[\.a-zA-Z\s_]*\}\}/g);
        if (matches) {
            for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                var match = matches_1[_i];
                var originalMatch = match;
                var parts = match.replace('{{', '')
                    .replace('}}', '')
                    .trim()
                    .split('.');
                parts.shift(); // Remove 'feature'
                var interpreted = parts.reduce(function (carry, property) {
                    return carry[property];
                }, feature.original);
                parametric = parametric.replace(originalMatch, interpreted);
            }
        }
        return parametric;
    };
    ServerNode.prototype.input = function (portName) {
        if (portName === void 0) { portName = 'Input'; }
        return this.getDataAtPortNamed(portName);
    };
    ServerNode.prototype.getDataAtPortNamed = function (name) {
        var _this = this;
        if (name === void 0) { name = 'Input'; }
        var port = this.portNamed(name);
        var features = port.links.map(function (linkId) {
            var _a;
            var link = _this.diagram.find(linkId);
            var source = _this.diagram.find(link.sourcePort);
            return (_a = source.features) !== null && _a !== void 0 ? _a : [];
        }).flat();
        return _.cloneDeep(features);
    };
    ServerNode.prototype.output = function (features, port) {
        if (port === void 0) { port = 'Output'; }
        this.portNamed(port).features = this.portNamed(port).features ? this.portNamed(port).features.concat(features) : features;
    };
    ServerNode.prototype.portNamed = function (name) {
        return this.ports.find(function (port) { return port.name == name; });
    };
    return ServerNode;
}());
exports["default"] = ServerNode;
