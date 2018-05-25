import { Translation } from "../translation.types";
export interface TranslationSegment {
    kind: string;
    messageId: string;
    messageContext: string;
    languages: string[];
}
export declare class SynchronizationResponse {
    readonly projectName: string;
    readonly projectUrl: string;
    readonly unusedSegments: TranslationSegment[];
    readonly getTextTranslations: Translation[];
    readonly yamlTranslations: Translation[];
    static parse(body: any): SynchronizationResponse;
    private static parseSegments(bodySegments);
    private static parseTranslations(body, matcher);
    constructor(projectName: string, projectUrl: string, unusedSegments: TranslationSegment[], getTextTranslations: Translation[], yamlTranslations: Translation[]);
    readonly numberOfUnusedSegments: number;
}
