import { Translation, TranslationFile } from "../translation.types";
import { PoConfiguration } from "./po-configuration";
export declare class PoWriter {
    private configuration;
    static buildTemporaryWriter(poExtention: string): PoWriter;
    static builDestinationWriter(configuration: PoConfiguration): PoWriter;
    private locator;
    constructor(configuration: PoConfiguration);
    write(translation: Translation): TranslationFile;
    commitTo(destinationConfiguration: PoConfiguration, locales: string[]): void;
    clean(locales: string[]): void;
}
