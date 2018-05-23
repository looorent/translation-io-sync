"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const po_locator_1 = require("./po-locator");
class PoWriter {
    constructor(configuration) {
        this.configuration = configuration;
        this.locator = new po_locator_1.PoLocator(configuration);
    }
    static buildTemporaryWriter(poExtention) {
        const temporaryFolder = `.${uuid_1.v4()}`;
        fs_1.mkdirSync(temporaryFolder);
        const temporaryConfiguration = {
            poExtention: poExtention,
            poDirectory: temporaryFolder
        };
        return new PoWriter(temporaryConfiguration);
    }
    static builDestinationWriter(configuration) {
        return new PoWriter(configuration);
    }
    write(translation) {
        const destination = this.locator.findPathTo(translation.locale);
        console.log(`Writing locale ${destination.locale} to ${destination.path}...`);
        fs_1.writeFileSync(destination.path, translation.content);
        return destination;
    }
    commitTo(destinationConfiguration, locales) {
        const destinationLocator = new po_locator_1.PoLocator(destinationConfiguration);
        locales.map(locale => [this.locator.findPathTo(locale), destinationLocator.findPathTo(locale)])
            .forEach(sourceAndDestination => {
            const source = sourceAndDestination[0];
            const destination = sourceAndDestination[1];
            console.log(`Copying temporary file for locale ${source.locale} located at ${source.path} to location: ${destination.path}...`);
            fs_1.copyFileSync(source.path, destination.path);
        });
        console.log("All temporary files have been committed.");
    }
    clean(locales) {
        console.log("Cleaning all temporary files");
        locales.map(locale => this.locator.findPathTo(locale))
            .filter(file => fs_1.existsSync(file.path))
            .forEach(file => {
            console.log(`Removing temporary locale ${file.locale} located at ${file.path}...`);
            fs_1.unlinkSync(file.path);
        });
        fs_1.rmdirSync(this.configuration.poDirectory);
        console.log("Cleaning completed.");
    }
}
exports.PoWriter = PoWriter;
