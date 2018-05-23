"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const clime_1 = require("clime");
const clime_2 = require("clime");
class ConnectionOptions extends clime_1.Options {
    constructor() {
        super(...arguments);
        this.apiKey = "";
        this.sourceLocale = "";
        this.destinationLocale = "";
        this.poDirectory = "";
        this.poExtention = "";
    }
    createConfiguration() {
        return {
            sourceLocale: this.sourceLocale,
            targetLocales: this.destinationLocale.split(","),
            po: {
                poDirectory: this.poDirectory,
                poExtention: this.poExtention
            },
            service: {
                apiKey: this.apiKey,
                hostname: "translation.io",
                version: "2.0"
            }
        };
    }
}
__decorate([
    clime_2.option({
        flag: "a",
        description: "Your project's api key for translation.io",
        default: ""
    }),
    __metadata("design:type", String)
], ConnectionOptions.prototype, "apiKey", void 0);
__decorate([
    clime_2.option({
        flag: "s",
        description: "The source language",
        default: "en"
    }),
    __metadata("design:type", String)
], ConnectionOptions.prototype, "sourceLocale", void 0);
__decorate([
    clime_2.option({
        flag: "d",
        description: "The destination languages (separated by a comma)",
        default: "fr-FR,nl-BE"
    }),
    __metadata("design:type", String)
], ConnectionOptions.prototype, "destinationLocale", void 0);
__decorate([
    clime_2.option({
        flag: "p",
        description: "Path to the folder that contains your PO files that will be sent and replaced.",
        default: "./"
    }),
    __metadata("design:type", String)
], ConnectionOptions.prototype, "poDirectory", void 0);
__decorate([
    clime_2.option({
        flag: "e",
        description: "Extention of your PO files (do not include a 'dot')",
        default: "po"
    }),
    __metadata("design:type", String)
], ConnectionOptions.prototype, "poExtention", void 0);
exports.ConnectionOptions = ConnectionOptions;
