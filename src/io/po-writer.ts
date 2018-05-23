
import { copyFileSync, existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import { v4 } from "uuid";
import { Translation, TranslationFile } from "../translation.types";
import { PoConfiguration } from "./po-configuration";
import { PoLocator } from "./po-locator";

export class PoWriter {

  static buildTemporaryWriter(poExtention: string): PoWriter {
    const temporaryFolder = `.${v4()}`;
    mkdirSync(temporaryFolder);
    const temporaryConfiguration = {
      poExtention: poExtention,
      poDirectory: temporaryFolder
    };
    return new PoWriter(temporaryConfiguration);
  }

  static builDestinationWriter(configuration: PoConfiguration): PoWriter {
    return new PoWriter(configuration);
  }

  private locator: PoLocator;

  constructor(private configuration: PoConfiguration) {
    this.locator = new PoLocator(configuration);
  }

  write(translation: Translation): TranslationFile {
    const destination = this.locator.findPathTo(translation.locale);
    console.log(`Writing locale ${destination.locale} to ${destination.path}...`);
    writeFileSync(destination.path, translation.content);
    return destination;
  }

  commitTo(destinationConfiguration: PoConfiguration, locales: string[]) {
    const destinationLocator = new PoLocator(destinationConfiguration);
    locales.map(locale => [this.locator.findPathTo(locale), destinationLocator.findPathTo(locale)])
           .forEach(sourceAndDestination => {
             const source = sourceAndDestination[0];
             const destination = sourceAndDestination[1];
             console.log(`Copying temporary file for locale ${source.locale} located at ${source.path} to location: ${destination.path}...`);
             copyFileSync(source.path, destination.path);
           });
    console.log("All temporary files have been committed.");
  }

  clean(locales: string[]) {
    console.log("Cleaning all temporary files");
    locales.map(locale => this.locator.findPathTo(locale))
           .filter(file => existsSync(file.path))
           .forEach(file => {
             console.log(`Removing temporary locale ${file.locale} located at ${file.path}...`);
             unlinkSync(file.path);
           });
    rmdirSync(this.configuration.poDirectory);
    console.log("Cleaning completed.");
  }
}
