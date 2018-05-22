import { Configuration } from "../configuration.types";
import { Translation } from "../translation.types";
import { UrlBuilder } from "./url-builder";

const CURL = require("node-libcurl").Curl;
const HEADERS = ["Content-Type: application/json", "Accept: application/json"];
const POT_FILE_MATCHER = /^po_data_(.*)/;

interface TranslationBody {
  target_languages: string[];
  pot_data: string;
  gem_version: string;
  source_language: string;
  purge: string;
}

export class Client {

  constructor(private configuration: Configuration) {}

  send(translation: Translation, purge: boolean): Promise<Translation> {
    const parameters = this.buildParameters(translation.content, purge);
    return new Promise((resolve, reject) => {
      const request = this.buildRequest(parameters);
      const close = request.close.bind(request);
      console.log(`Sending new translation for locale ${translation.locale} to translation.io`);

      request.on("error", (err: any) => {
        console.log("POUET", err);
        close();
        reject(err);
      });

      request.on("end", (statusCode: number, bodyContent: string) => {
        console.log("COUCOU", statusCode);
        console.log("COUCOU", bodyContent);
        if (statusCode >= 200 && statusCode < 300) {
          const body = JSON.parse(bodyContent);
          const entry = Object.keys(body).find(key => {
            const match = key.match(POT_FILE_MATCHER);
            return match !== undefined && match !== null && match[1] === translation.locale;
          });
  
          close();
          if (entry) {
            resolve({
              locale: translation.locale,
              content: body[entry]
            });
          } else {
            reject(new Error(`No matching key found in translations.io's response for locale: ${translation.locale}`));
          }
        } else {
          close();
          reject(new Error(`An error occurred (status code: ${statusCode}) when calling translation.io: ${bodyContent}`));
        }
      });
      request.perform();
    });
  }

  private buildParameters(potData: string, purge: boolean): TranslationBody {
    return {
      target_languages : this.configuration.targetLocales,
      pot_data         : potData,
      gem_version      : this.configuration.service.gemVersion,
      source_language  : this.configuration.sourceLocale,
      purge            : purge.toString()
    };
  }

  private buildRequest(body: TranslationBody): any {
    const curl = new CURL();
    const url = new UrlBuilder(this.configuration.service).synchronize();
    curl.setOpt(CURL.option.URL, url);
    curl.setOpt(CURL.option.HTTPHEADER, HEADERS);
    curl.setOpt(CURL.option.POSTFIELDS, JSON.stringify(body));
    return curl;
  }
}
