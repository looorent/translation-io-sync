"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const PREFIX = "/api/projects";
const SCHEMA = "https://";
class UrlBuilder {
    constructor(configuration) {
        this.configuration = configuration;
    }
    synchronize() {
        return `${SCHEMA}${this.configuration.hostname}${this.computePath("sync")}`;
    }
    init() {
        return `${SCHEMA}${this.configuration.hostname}${this.computePath("init")}`;
    }
    computePath(action) {
        return path_1.join(PREFIX, this.configuration.apiKey, action);
    }
}
exports.UrlBuilder = UrlBuilder;
