import { ServiceConfiguration } from "./http/service-configuration.types";
import { PoConfiguration } from "./io/po-configuration";

export interface Configuration {
  targetLocales: string[];
  sourceLocale: string;
  service: ServiceConfiguration;
  po: PoConfiguration;
}
