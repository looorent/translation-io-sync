import { join } from "path";
import { TranslationFile } from "../translation.types";
import { PoConfiguration } from "./po-configuration";

export class PoLocator {

  constructor(private configuration: PoConfiguration) {}

  findPathTo(locale: string): TranslationFile {
    const filename = `${locale}.${this.configuration.poExtention}`;
    const filepath = join(this.configuration.poDirectory, filename);
    return {
      locale: locale,
      path: filepath
    };
  }
}
