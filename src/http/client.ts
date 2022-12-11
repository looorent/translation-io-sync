import * as request from "request";
import { Configuration } from "../configuration.types";
import { Translation } from "../translation.types";
import { SynchronizationResponse } from "./synchronization-response";
import { UrlBuilder } from "./url-builder";

export class Client {

  constructor(private configuration: Configuration) {}

  update(translationKeys: Translation[], purge: boolean): Promise<Translation[]> {
    if (translationKeys.length === 0) {
      return Promise.resolve([]);
    } else {
      const parameters = this.buildUpdateParameters(translationKeys, purge);
      return new Promise((resolve, reject) => {
        const url = new UrlBuilder(this.configuration.service).synchronize();
        const options = this.buildRequestOptions(url, parameters);

        console.log(`Sending translations to translation.io`);
        request(options, (error: any, response: any, body: any) => {
          if (!error && response.statusCode === 200) {
            const parsedResponse = SynchronizationResponse.parse(body);
            this.logUpdateResponse(parsedResponse);
            resolve(parsedResponse.getTextTranslations);
          } else {
            reject(new Error(`An error occurred (status code: ${response.statusCode}) when calling translation.io: ${error}. Body: ${JSON.stringify(body)}`));
          }
        });
      });
    }


  }

  init(translations: Translation[]): Promise<any> {
    const parameters = this.buildInitParameters(translations);
    return new Promise((resolve, reject) => {
      const url = new UrlBuilder(this.configuration.service).init();
      const options = this.buildRequestOptions(url, parameters);
      console.log(`Initializing project @ translation.io`);
      request(options, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(new Error(`An error occurred (status code: ${response.statusCode}) when calling translation.io: ${error}. Body: ${JSON.stringify(body)}`));
        }
      });
    });
  }

  private buildInitParameters(translations: Translation[]): { [key: string]: string | string[] } {
    const content: any = {};
    content.target_languages = this.configuration.targetLocales;
    content.version = this.configuration.service.version;
    content.source_language = this.configuration.sourceLocale;
    translations.forEach(translation => {
      content[`po_data_${translation.locale}`] = translation.content;
      content[`yaml_po_data_${translation.locale}`] = "";
    });
    return content;
  }

  private buildUpdateParameters(translationKeys: Translation[], purge: boolean): { [key: string]: string | string[] } {
    return {
      target_languages: this.configuration.targetLocales,
      pot_data: translationKeys[0].content,
      version: this.configuration.service.version,
      source_language: this.configuration.sourceLocale,
      purge: purge.toString()
    };
  }

  private buildRequestOptions(url: string, body: { [key: string]: string | string[] }): any {
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

  private logUpdateResponse(response: SynchronizationResponse) {
    console.log(`The project '${response.projectName}' has been updated at '${response.projectUrl}'`);
    if (response.numberOfUnusedSegments > 0) {
      const unusedKeys = response.unusedSegments.map(segment => segment.messageId).join("\n>>");
      console.log(`> ${response.numberOfUnusedSegments} translations are unused:\n ${unusedKeys}`);
    } else {
      console.log("> There is no key unused!");
    }
  }
}
