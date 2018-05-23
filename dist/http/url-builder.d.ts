import { ServiceConfiguration } from "./service-configuration.types";
export declare class UrlBuilder {
    private configuration;
    constructor(configuration: ServiceConfiguration);
    synchronize(): string;
    init(): string;
    private computePath(action);
}
