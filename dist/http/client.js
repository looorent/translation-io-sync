"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const synchronization_response_1 = require("./synchronization-response");
const url_builder_1 = require("./url-builder");
class Client {
    constructor(configuration) {
        this.configuration = configuration;
    }
    update(translationKeys, purge) {
        if (translationKeys.length === 0) {
            return Promise.resolve([]);
        }
        else {
            const parameters = this.buildUpdateParameters(translationKeys, purge);
            return new Promise((resolve, reject) => {
                const url = new url_builder_1.UrlBuilder(this.configuration.service).synchronize();
                const options = this.buildRequestOptions(url, parameters);
                console.log(`Sending translations to translation.io`);
                request(options, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        const parsedResponse = synchronization_response_1.SynchronizationResponse.parse(body);
                        this.logUpdateResponse(parsedResponse);
                        resolve(parsedResponse.getTextTranslations);
                    }
                    else {
                        reject(new Error(`An error occurred (status code: ${response.statusCode}) when calling translation.io: ${error}`));
                    }
                });
            });
        }
    }
    init(translations) {
        const parameters = this.buildInitParameters(translations);
        return new Promise((resolve, reject) => {
            const url = new url_builder_1.UrlBuilder(this.configuration.service).init();
            const options = this.buildRequestOptions(url, parameters);
            console.log(`Initializing project @ translation.io`);
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                }
                else {
                    reject(new Error(`An error occurred (status code: ${response.statusCode}) when calling translation.io: ${error}`));
                }
            });
        });
    }
    buildInitParameters(translations) {
        const content = {};
        content.target_languages = this.configuration.targetLocales;
        content.version = this.configuration.service.version;
        content.source_language = this.configuration.sourceLocale;
        translations.forEach(translation => {
            content[`pot_data_${translation.locale}`] = translation.content;
            content[`yaml_po_data_${translation.locale}`] = "";
        });
        return content;
    }
    buildUpdateParameters(translationKeys, purge) {
        return {
            target_languages: this.configuration.targetLocales,
            pot_data: translationKeys[0].content,
            version: this.configuration.service.version,
            source_language: this.configuration.sourceLocale,
            purge: purge.toString()
        };
    }
    buildRequestOptions(url, body) {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        return {
            url: url,
            method: "POST",
            headers: headers,
            json: body
        };
    }
    logUpdateResponse(response) {
        console.log(`The project '${response.projectName}' has been updated at '${response.projectUrl}'`);
        if (response.numberOfUnusedSegments > 0) {
            const unusedKeys = response.unusedSegments.map(segment => segment.messageId).join("\n>>");
            console.log(`> ${response.numberOfUnusedSegments} translations are unused:\n ${unusedKeys}`);
        }
        else {
            console.log("> There is no key unused!");
        }
    }
}
exports.Client = Client;
