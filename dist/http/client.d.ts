import { Configuration } from "../configuration.types";
import { Translation } from "../translation.types";
export declare class Client {
    private configuration;
    constructor(configuration: Configuration);
    update(translationKeys: Translation[], purge: boolean): Promise<Translation[]>;
    init(translations: Translation[]): Promise<any>;
    private buildInitParameters(translations);
    private buildUpdateParameters(translationKeys, purge);
    private buildRequestOptions(url, body);
    private logUpdateResponse(response);
}
