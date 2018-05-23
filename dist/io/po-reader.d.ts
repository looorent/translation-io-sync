import { Translation, TranslationFile } from "../translation.types";
import { PoConfiguration } from "./po-configuration";
export declare class PoReader {
    private configuration;
    constructor(configuration: PoConfiguration);
    read(poFilePath: string): string;
    list(locales: string[]): TranslationFile[];
    readAll(locales: string[]): Translation[];
}
