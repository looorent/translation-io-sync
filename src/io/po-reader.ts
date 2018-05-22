import { existsSync, readFileSync } from "fs";
import { Translation, TranslationFile } from "../translation.types";
import { PoConfiguration } from "./po-configuration";
import { PoLocator } from "./po-locator";

export class PoReader {

  constructor(private configuration: PoConfiguration) {}

  read(poFilePath: string): string {
    return readFileSync(poFilePath, { encoding: "utf8" });
  }

  list(locales: string[]): TranslationFile[] {
    const locator = new PoLocator(this.configuration);
    return locales.map(locale => locator.findPathTo(locale))
                  .filter(file => existsSync(file.path));
  }

  readAll(locales: string[]): Translation[] {
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
