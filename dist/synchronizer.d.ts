import { Configuration } from "./configuration.types";
export declare class Synchronizer {
    private configuration;
    constructor(configuration: Configuration);
    sync(): void;
    syncAndPurge(): void;
    run(purge: boolean): void;
    init(): void;
}
