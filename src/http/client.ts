import { Configuration } from "../configuration.types";
import { Translation } from "../translation.types";
import { SynchronizationResponse } from "./synchronization-response";
import { UrlBuilder } from "./url-builder";
import fetch from "node-fetch";

export class Client {

  constructor(private configuration: Configuration) {}

  async update(translationKeys: Translation[], purge: boolean): Promise<Translation[]> {
    if (translationKeys.length === 0) {
      return [];
    } else {
      const url = new UrlBuilder(this.configuration.service).synchronize();
      const payload = this.buildUpdateParameters(translationKeys, purge);
      
      console.log(`Sending translations to translation.io`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (response.status === 200) {
        const parsedResponse = SynchronizationResponse.parse(await response.json());
        this.logUpdateResponse(parsedResponse);
        return parsedResponse.getTextTranslations;
      } else {
        const body = await response.json();
        throw new Error(`An error occurred (status code: ${response.status}) when calling translation.io. Body: ${JSON.stringify(body)}`);
      }
    }
  }

  async init(translations: Translation[]): Promise<any> {
    const url = new UrlBuilder(this.configuration.service).init();
    const payload = this.buildInitParameters(translations);
    console.log(`Initializing project @ translation.io`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      const body = await response.json();
      throw new Error(`An error occurred (status code: ${response.status}) when calling translation.io. Body: ${JSON.stringify(body)}`);
    }
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
