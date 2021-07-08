"use strict";
exports.__esModule = true;
var NodeParameter = /** @class */ (function () {
    function NodeParameter(name) {
        this.description = '';
        this.fieldType = "String_";
        this.value = '';
        this.name = name;
    }
    NodeParameter.make = function (name) {
        return new this(name);
    };
    NodeParameter.json = function (name) {
        return this.make(name).withFieldType('JSON_');
    };
    NodeParameter.number = function (name) {
        return this.make(name).withFieldType('Number');
    };
    NodeParameter.select = function (name) {
        return this.make(name).withFieldType('Select');
    };
    NodeParameter.string = function (name) {
        return this.make(name).withFieldType('String_');
    };
    NodeParameter.js = function (name) {
        return this.make(name).withFieldType('JS');
    };
    NodeParameter.textarea = function (name) {
        return this.make(name).withFieldType('Textarea');
    };
    NodeParameter.prototype.withFieldType = function (type) {
        this.fieldType = type;
        return this;
    };
    NodeParameter.prototype.withOptions = function (options) {
        this.options = options;
        return this;
    };
    NodeParameter.prototype.withPlaceholder = function (placeholder) {
        this.placeholder = placeholder;
        return this;
    };
    NodeParameter.prototype.withValue = function (value) {
        this.value = value;
        return this;
    };
    NodeParameter.prototype.withDescription = function (description) {
        this.description = description;
        return this;
    };
    return NodeParameter;
}());
exports["default"] = NodeParameter;
