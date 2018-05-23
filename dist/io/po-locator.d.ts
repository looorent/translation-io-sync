import { TranslationFile } from "../translation.types";
import { PoConfiguration } from "./po-configuration";
export declare class PoLocator {
    private configuration;
    constructor(configuration: PoConfiguration);
    findPathTo(locale: string): TranslationFile;
}
