import { Options } from "clime";
import { option } from "clime";
import { Configuration } from "../configuration.types";

export class ConnectionOptions extends Options {
  @option({
    flag: "a",
    description: "Your project's api key for translation.io",
    default: ""
  })
  private apiKey: string = "";

  @option({
    flag: "s",
    description: "The source language",
    default: "en"
  })
  private sourceLocale: string = "";

  @option({
    flag: "d",
    description: "The destination languages (separated by a comma)",
    default: "fr-FR,nl-BE"
  })
  private destinationLocale: string = "";

  @option({
    flag: "p",
    description: "Path to the folder that contains your PO files that will be sent and replaced.",
    default: "./"
  })
  private poDirectory: string = "";

  @option({
    flag: "p",
    description: "Extention of your PO files (do not include a 'dot')",
    default: "po"
  })
  private poExtention: string = "";

  createConfiguration(): Configuration {
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
