import { Options } from "clime";
import { Configuration } from "../configuration.types";
export declare class ConnectionOptions extends Options {
    private apiKey;
    private sourceLocale;
    private destinationLocale;
    private poDirectory;
    private poExtention;
    createConfiguration(): Configuration;
}
