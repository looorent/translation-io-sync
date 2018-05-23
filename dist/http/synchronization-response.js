"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const POT_FILE_MATCHER = /^po_data_(.*)/;
const YAML_FILE_MATCHER = /^yaml_po_data_(.*)/;
class SynchronizationResponse {
    constructor(projectName, projectUrl, unusedSegments, getTextTranslations, yamlTranslations) {
        this.projectName = projectName;
        this.projectUrl = projectUrl;
        this.unusedSegments = unusedSegments;
        this.getTextTranslations = getTextTranslations;
        this.yamlTranslations = yamlTranslations;
    }
    static parse(bodyAsJson) {
        const body = JSON.parse(bodyAsJson);
        return new SynchronizationResponse(body.project_name, body.project_url, this.parseSegments(body.unused_segments), this.parseTranslations(body, POT_FILE_MATCHER), this.parseTranslations(body, YAML_FILE_MATCHER));
    }
    static parseSegments(bodySegments) {
        return bodySegments.map((segment) => {
            return {
                kind: segment.kind,
                messageId: segment.msgid,
                messageContext: segment.msgcontext,
                languages: segment.languages.split(",")
            };
        });
    }
    static parseTranslations(body, matcher) {
        return Object.keys(body)
            .filter(key => key.match(matcher))
            .map(filename => {
            const match = filename.match(matcher);
            return {
                locale: match[1],
                content: body[filename]
            };
        });
    }
    get numberOfUnusedSegments() {
        return this.unusedSegments.length;
    }
}
exports.SynchronizationResponse = SynchronizationResponse;
