import { join } from "path";
import { ServiceConfiguration } from "./service-configuration.types";

const PREFIX = "/api/projects";
const SCHEMA = "https://";

export class UrlBuilder {
  constructor(private configuration: ServiceConfiguration) {}

  synchronize(): string {
    return `${SCHEMA}${this.configuration.hostname}${this.computePath("sync")}`;
  }

  private computePath(action: string): string {
    return join(PREFIX, this.configuration.apiKey, action);
  }
}
