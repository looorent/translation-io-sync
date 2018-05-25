import { Translation } from "../translation.types";

const POT_FILE_MATCHER = /^po_data_(.*)/;
const YAML_FILE_MATCHER = /^yaml_po_data_(.*)/;

export interface TranslationSegment {
  kind: string;
  messageId: string;
  messageContext: string;
  languages: string[];
}

export class SynchronizationResponse {
  static parse(body: any): SynchronizationResponse {
    return new SynchronizationResponse(body.project_name,
                                       body.project_url,
                                       this.parseSegments(body.unused_segments),
                                       this.parseTranslations(body, POT_FILE_MATCHER),
                                       this.parseTranslations(body, YAML_FILE_MATCHER));
  }

  private static parseSegments(bodySegments: any): TranslationSegment[] {
    return bodySegments.map((segment: any) => {
      return {
        kind: segment.kind,
        messageId: segment.msgid,
        messageContext: segment.msgcontext,
        languages: segment.languages.split(",")
      };
    });
  }

  private static parseTranslations(body: any, matcher: RegExp): Translation[] {
    return Object.keys(body)
                 .filter(key => key.match(matcher))
                 .map(filename => {
      const match = filename.match(matcher);
      return {
        locale: match![1],
        content: body[filename]
      } as Translation;
    });
  }

  constructor(readonly projectName: string,
              readonly projectUrl: string,
              readonly unusedSegments: TranslationSegment[],
              readonly getTextTranslations: Translation[],
              readonly yamlTranslations: Translation[]) {}

  get numberOfUnusedSegments(): number {
    return this.unusedSegments.length;
  }
}
