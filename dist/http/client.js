"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const synchronization_response_1 = require("./synchronization-response");
const url_builder_1 = require("./url-builder");
const CURL = require("node-libcurl").Curl;
const HEADERS = ["Content-Type: application/json", "Accept: application/json"];
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
                const request = this.buildRequest(url, parameters);
                const close = request.close.bind(request);
                console.log(`Sending translations to translation.io`);
                request.on("error", (err) => {
                    close();
                    reject(err);
                });
                request.on("end", (statusCode, bodyContent) => {
                    if (statusCode >= 200 && statusCode < 300) {
                        const response = synchronization_response_1.SynchronizationResponse.parse(bodyContent);
                        this.logUpdateResponse(response);
                        close();
                        resolve(response.getTextTranslations);
                    }
                    else {
                        close();
                        reject(new Error(`An error occurred (status code: ${statusCode}) when calling translation.io: ${bodyContent}`));
                    }
                });
                request.perform();
            });
        }
    }
    init(translations) {
        const parameters = this.buildInitParameters(translations);
        return new Promise((resolve, reject) => {
            const url = new url_builder_1.UrlBuilder(this.configuration.service).init();
            const request = this.buildRequest(url, parameters);
            const close = request.close.bind(request);
            console.log(`Initializing project @ translation.io`);
            request.on("error", (err) => {
                close();
                reject(err);
            });
            request.on("end", (statusCode, bodyContent) => {
                close();
                if (statusCode >= 200 && statusCode < 300) {
                    resolve(JSON.parse(bodyContent));
                }
                else {
                    reject(new Error(`An error occurred (status code: ${statusCode}) when calling translation.io: ${bodyContent}`));
                }
            });
            request.perform();
        });
    }
    buildInitParameters(translations) {
        const content = {};
        content.target_languages = this.configuration.targetLocales;
        content.version = this.configuration.service.version;
        content.source_language = this.configuration.sourceLocale;
        translations.forEach(translation => {
            content[`pot_data_${translation.locale}`] = translation.content;
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
    buildRequest(url, body) {
        const curl = new CURL();
        curl.setOpt(CURL.option.URL, url);
        curl.setOpt(CURL.option.HTTPHEADER, HEADERS);
        curl.setOpt(CURL.option.POSTFIELDS, JSON.stringify(body));
        return curl;
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
