import { Configuration } from "../configuration.types";
import { Translation } from "../translation.types";
import { UrlBuilder } from "./url-builder";

const CURL = require("node-libcurl").Curl;
const HEADERS = ["Content-Type: application/json", "Accept: application/json"];
const POT_FILE_MATCHER = /^po_data_(.*)/;

export class Client {

  constructor(private configuration: Configuration) {}

  update(translationKeys: Translation[], purge: boolean): Promise<Translation[]> {
    if (translationKeys.length === 0) {
      return Promise.resolve([]);
    } else {
      const parameters = this.buildUpdateParameters(translationKeys, purge);
      return new Promise((resolve, reject) => {
        const url = new UrlBuilder(this.configuration.service).synchronize();
        const request = this.buildRequest(url, parameters);
        const close = request.close.bind(request);
        console.log(`Sending translations to translation.io`);
        request.on("error", (err: any) => {
          close();
          reject(err);
        });

        request.on("end", (statusCode: number, bodyContent: string) => {
          if (statusCode >= 200 && statusCode < 300) {
            const body = JSON.parse(bodyContent);
            const newTranslations = Object.keys(body)
                                          .map(key => [key, key.match(POT_FILE_MATCHER)])
                                          .filter(keyAndMatch => keyAndMatch[1])
                                          .map(keyAndMatch => {
                                            const key = keyAndMatch[0] as string;
                                            const match = keyAndMatch[1];
                                            const locale = match ? match[1] : undefined;
                                            return {
                                              locale: locale,
                                              content: body[key]
                                            } as Translation;
                                          });
            close();
            resolve(newTranslations);
          } else {
            close();
            reject(new Error(`An error occurred (status code: ${statusCode}) when calling translation.io: ${bodyContent}`));
          }
        });
        request.perform();
      });
    }


  }

  init(translations: Translation[]): Promise<any> {
    const parameters = this.buildInitParameters(translations);
    return new Promise((resolve, reject) => {
      const url = new UrlBuilder(this.configuration.service).init();
      const request = this.buildRequest(url, parameters);
      const close = request.close.bind(request);
      console.log(`Initializing project @ translation.io`);
      request.on("error", (err: any) => {
        close();
        reject(err);
      });

      request.on("end", (statusCode: number, bodyContent: string) => {
        close();
        if (statusCode >= 200 && statusCode < 300) {
          resolve(JSON.parse(bodyContent));
        } else {
          reject(new Error(`An error occurred (status code: ${statusCode}) when calling translation.io: ${bodyContent}`));
        }
      });
      request.perform();
    });
  }

  private buildInitParameters(translations: Translation[]): { [key: string]: string | string[] } {
    const content: any = {};
    content.target_languages = this.configuration.targetLocales;
    content.version = this.configuration.service.version;
    content.source_language = this.configuration.sourceLocale;
    translations.forEach(translation => {
      content[`pot_data_${translation.locale}`] = translation.content;
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

  private buildRequest(url: string, body: { [key: string]: string | string[] }): any {
    const curl = new CURL();
    curl.setOpt(CURL.option.URL, url);
    curl.setOpt(CURL.option.HTTPHEADER, HEADERS);
    curl.setOpt(CURL.option.POSTFIELDS, JSON.stringify(body));
    return curl;
  }
}
