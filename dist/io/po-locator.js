"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class PoLocator {
    constructor(configuration) {
        this.configuration = configuration;
    }
    findPathTo(locale) {
        const filename = `${locale}.${this.configuration.poExtention}`;
        const filepath = path_1.join(this.configuration.poDirectory, filename);
        return {
            locale: locale,
            path: filepath
        };
    }
}
exports.PoLocator = PoLocator;
