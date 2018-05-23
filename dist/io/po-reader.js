"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const po_locator_1 = require("./po-locator");
class PoReader {
    constructor(configuration) {
        this.configuration = configuration;
    }
    read(poFilePath) {
        return fs_1.readFileSync(poFilePath, { encoding: "utf8" });
    }
    list(locales) {
        const locator = new po_locator_1.PoLocator(this.configuration);
        return locales.map(locale => locator.findPathTo(locale))
            .filter(file => fs_1.existsSync(file.path));
    }
    readAll(locales) {
        const translations = this.list(locales)
            .map(file => {
            return {
                locale: file.locale,
                content: this.read(file.path)
            };
        });
        if (translations.length !== locales.length) {
            const localesFound = translations.map(translation => translation.locale);
            throw new Error(`Some locales (${locales.length - localesFound.length}) has not been found. Locales found: ${localesFound}`);
        }
        return translations;
    }
}
exports.PoReader = PoReader;
